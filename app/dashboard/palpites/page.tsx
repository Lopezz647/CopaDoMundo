"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

import UserHeader from "@/components/layout/UserHeader";
import PromoBanner from "@/components/bolao/PromoBanner";
import DateNavigator from "@/components/bolao/DateNavigator";
import ProgressSection from "@/components/bolao/ProgressSection";
import MatchCard from "@/components/bolao/MatchCard";
import LiveRanking from "@/components/bolao/LiveRanking";

export default function Palpites() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("usuario@email.com");

  // Estados de controle de navegação sincronizada
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Dados vindos da API e Banco
  const [matches, setMatches] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 1. Carregar os jogos reais da API e os palpites do Supabase
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        // Rota alterada para BSA
        const response = await fetch("/api/futebol/competitions/BSA/matches"); 
        const matchData = await response.json();

        // Mapeia os dados da API para o formato esperado pelos MatchCards
        const formattedMatches = (matchData.matches || []).map((m: any) => ({
          id: String(m.id),
          home_team: m.homeTeam.name,
          away_team: m.awayTeam.name,
          home_flag: m.homeTeam.crest || "🏳️",
          away_flag: m.awayTeam.crest || "🏳️",
          match_date: m.utcDate,
          // Converte a ronda da API (matchday) para número
          round: m.matchday || 1
        }));

        setMatches(formattedMatches);

        // Busca o usuário logado e seus palpites salvos
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          setUserEmail(user.email || "");

          const { data: userPredictions } = await supabase
            .from("predictions")
            .select("*")
            .eq("user_id", user.id);

          if (userPredictions) {
            setPredictions(userPredictions);
          }
        }

        // Define as datas iniciais com base nos primeiros jogos encontrados da API
        if (formattedMatches.length > 0) {
          const firstMatchDate = new Date(formattedMatches[0].match_date);
          setSelectedDate(firstMatchDate);
          setCurrentRound(formattedMatches[0].round || 1);
        }

      } catch (error) {
        console.error("Erro ao inicializar dados do bolão:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // 2. Inteligência de Sincronização Dinâmica
  
  // Lista de todas as datas únicas que possuem jogos no campeonato
  const allUniqueDates = useMemo(() => {
    const datesMap = matches.map(m => new Date(m.match_date).toDateString());
    return Array.from(new Set(datesMap)).map(d => new Date(d)).sort((a, b) => a.getTime() - b.getTime());
  }, [matches]);

  // Função disparada quando o usuário clica para alterar a Rodada/Fase
  const handleRoundChange = (roundNumber: number) => {
    setCurrentRound(roundNumber);

    // Encontra o primeiro jogo pertencente a essa nova rodada selecionada
    const firstMatchOfRound = matches.find(m => m.round === roundNumber);
    if (firstMatchOfRound) {
      // Altera automaticamente a data ativa para o primeiro dia dessa fase
      setSelectedDate(new Date(firstMatchOfRound.match_date));
    }
  };

  // Função disparada quando o usuário clica diretamente em uma Data específica
  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);

    // Descobre qual é a rodada/fase do primeiro jogo que acontece nessa data
    const matchOnThisDate = matches.find(
      m => new Date(m.match_date).toDateString() === newDate.toDateString()
    );
    if (matchOnThisDate && matchOnThisDate.round !== currentRound) {
      // Sincroniza o cabeçalho mudando o nome da Fase/Rodada sozinho!
      setCurrentRound(matchOnThisDate.round);
    }
  };

  // Filtra os jogos que vão de fato aparecer na tela com base no dia ativo
  const filteredMatches = useMemo(() => {
    return matches.filter(
      m => new Date(m.match_date).toDateString() === selectedDate.toDateString()
    );
  }, [matches, selectedDate]);

  const predictionMap = useMemo(() => {
    const map: Record<string, any> = {};
    predictions.forEach(p => { map[p.match_id] = p; });
    return map;
  }, [predictions]);

  // === FUNÇÃO CORRIGIDA AQUI ===
  const handlePredictionChange = async (matchId: string, homeScore: number, awayScore: number) => {
    if (!userId) return;

    const targetMatch = matches.find(m => m.id === matchId);
    if (!targetMatch) return;

    // Verificação de tempo com tratamento seguro de fuso horário
    const matchTime = new Date(targetMatch.match_date).getTime();
    const fifteenMinutes = 15 * 60 * 1000;
    if (matchTime - Date.now() < fifteenMinutes) {
      console.warn("Palpites encerrados para este jogo.");
      return; 
    }

    // Atualização otimista do Estado (Interface responde rápido)
    setPredictions(prev => {
      const existingIndex = prev.findIndex(p => p.match_id === matchId);
      if (existingIndex >= 0) {
        const newPredictions = [...prev];
        newPredictions[existingIndex] = { 
          ...newPredictions[existingIndex], 
          home_score: homeScore, 
          away_score: awayScore 
        };
        return newPredictions;
      }
      return [...prev, { match_id: matchId, home_score: homeScore, away_score: awayScore, user_id: userId }];
    });

    try {
      // Tenta o Upsert padrão (Forçando números inteiros)
      const { error } = await supabase
        .from("predictions")
        .upsert({
          user_id: userId,
          match_id: matchId,
          home_score: Number(homeScore),
          away_score: Number(awayScore),
          updated_at: new Date().toISOString()
        }, { onConflict: "user_id,match_id" });

      // Se der erro de restrição única/onConflict no Supabase, executa o Plano B (Garante o salvamento)
      if (error) {
        console.warn("Upsert falhou, aplicando salvamento alternativo...");
        
        const { data: existing } = await supabase
          .from("predictions")
          .select("id")
          .eq("user_id", userId)
          .eq("match_id", matchId)
          .single();

        if (existing?.id) {
          await supabase
            .from("predictions")
            .update({
              home_score: Number(homeScore),
              away_score: Number(awayScore),
              updated_at: new Date().toISOString()
            })
            .eq("id", existing.id);
        } else {
          await supabase
            .from("predictions")
            .insert({
              user_id: userId,
              match_id: matchId,
              home_score: Number(homeScore),
              away_score: Number(awayScore)
            });
        }
      }
    } catch (err) {
      console.error("Erro crítico ao salvar palpite no banco:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#4edea3]" />
      </div>
    );
  }

  return (
    <>
      <div className="pb-2">
        <UserHeader />
      </div>
     <div className="mt-6 grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        <div className="flex flex-col gap-6 min-w-0">
          <PromoBanner />
          <DateNavigator
            currentRound={currentRound}
            onRoundChange={handleRoundChange}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            dates={allUniqueDates}
            predictions={predictions}
            matches={matches}
          />

          <ProgressSection
            made={predictions.length}
            total={matches.length}
            multiplier={2}
          />

          <div className="flex flex-col gap-4">
            {filteredMatches.length === 0 ? (
              <div className="bg-[#201f1f] rounded-2xl border border-white/5 p-8 text-center">
                <p className="text-[#bbcabf] text-sm">Nenhum jogo agendado para este dia.</p>
              </div>
            ) : (
              filteredMatches.map(match => (
                <MatchCard
                  key={match.id}
                  match={match}
                  prediction={predictionMap[match.id]}
                  onPredictionChange={handlePredictionChange}
                />
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <LiveRanking user={{ email: userEmail, full_name: "Competidor" }} predictions={predictions} />
        </div>
      </div>
    </>
  );
}

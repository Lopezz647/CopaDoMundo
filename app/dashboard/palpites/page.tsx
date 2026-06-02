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
  const [dbRanking, setDbRanking] = useState<any[]>([]);
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
          round: m.matchday || 1,
          status: m.status,
          score: m.score
        }));

        setMatches(formattedMatches);

        // Busca o usuário logado e seus palpites salvos
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          setUserEmail(user.email || "");

         const { data: rankingData } = await supabase
          .from("profiles")
          .select("*");
          
        if (rankingData) {
          setDbRanking(rankingData);
        }
          if (userPredictions) {
            // CORREÇÃO: Traduz os dados do banco (score_home) para o formato que a interface (MatchCard) precisa usar internamente
            const mappedPredictions = userPredictions.map((p: any) => ({
              id: p.id,
              user_id: p.user_id,
              match_id: p.match_id,
              home_score: p.score_home, 
              away_score: p.score_away,
              points: p.points
            }));
            setPredictions(mappedPredictions);
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
  const allUniqueDates = useMemo(() => {
    const datesMap = matches.map(m => new Date(m.match_date).toDateString());
    return Array.from(new Set(datesMap)).map(d => new Date(d)).sort((a, b) => a.getTime() - b.getTime());
  }, [matches]);

  const handleRoundChange = (roundNumber: number) => {
    setCurrentRound(roundNumber);
    const firstMatchOfRound = matches.find(m => m.round === roundNumber);
    if (firstMatchOfRound) {
      setSelectedDate(new Date(firstMatchOfRound.match_date));
    }
  };

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
    const matchOnThisDate = matches.find(
      m => new Date(m.match_date).toDateString() === newDate.toDateString()
    );
    if (matchOnThisDate && matchOnThisDate.round !== currentRound) {
      setCurrentRound(matchOnThisDate.round);
    }
  };

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
  
// Lógica para filtrar apenas os jogos e palpites da Rodada/Fase atual
  const matchesInCurrentRound = useMemo(() => {
    return matches.filter(m => m.round === currentRound);
  }, [matches, currentRound]);

  const predictionsInCurrentRound = useMemo(() => {
    return predictions.filter(p => 
      matchesInCurrentRound.some(m => m.id === String(p.match_id))
    );
  }, [predictions, matchesInCurrentRound]);
  
  // === FUNÇÃO DE SALVAMENTO CORRIGIDA E ADAPTADA ===
  const handlePredictionChange = async (matchId: string, homeScore: number, awayScore: number) => {
    if (!userId) return;

    const targetMatch = matches.find(m => m.id === matchId);
    if (!targetMatch) return;

    // Bloqueio de tempo (segurança de 15 minutos)
    const matchTime = new Date(targetMatch.match_date).getTime();
    const tempoAteOJogo = matchTime - Date.now();
    if (tempoAteOJogo > 0 && tempoAteOJogo < 15 * 60 * 1000) {
      console.warn("Palpites encerrados para este jogo.");
      return; 
    }

    // Atualização otimista do Estado local (mantém resposta visual instantânea)
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
      // 1. Procura se o registro já existe de forma segura usando maybeSingle (Evita Erro 406)
      const { data: existing, error: selectError } = await supabase
        .from("predictions")
        .select("id")
        .eq("user_id", userId)
        .eq("match_id", matchId)
        .maybeSingle(); 

      if (selectError) {
        console.error("Erro ao verificar palpite existente:", selectError.message);
        return;
      }

      // 2. Executa a gravação usando os nomes exatos das suas colunas do banco (Evita Erro 400)
      if (existing?.id) {
        // Se já existe, atualiza as colunas corretas
        const { error: updateError } = await supabase
          .from("predictions")
          .update({
            score_home: Number(homeScore),
            score_away: Number(awayScore)
          })
          .eq("id", existing.id);

        if (updateError) console.error("Erro ao atualizar dados:", updateError.message);
      } else {
        // Se não existe, insere a nova linha sem passar a coluna inexistente updated_at
        const { error: insertError } = await supabase
          .from("predictions")
          .insert({
            user_id: userId,
            match_id: matchId,
            score_home: Number(homeScore),
            score_away: Number(awayScore)
          });

        if (insertError) console.error("Erro ao inserir dados:", insertError.message);
      }
    } catch (err) {
      console.error("Erro crítico no fluxo de salvamento:", err);
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
            made={predictionsInCurrentRound.length}
            total={matchesInCurrentRound.length}
            multiplier={2} // Mantenha o multiplicador que você já usa
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
          <LiveRanking 
  user={{ id: userId, email: userEmail, name: "Você" }} 
  predictions={predictions} 
  liveMatches={matches} 
  dbRanking={dbRanking} // <-- Agora enviando os pontos consolidados oficiais!
/>
        </div>
      </div>
    </>
  );
}

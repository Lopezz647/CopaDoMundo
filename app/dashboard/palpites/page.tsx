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

// --- INTERFACES DE TIPAGEM ---

// Tipagem para o retorno bruto da API de Futebol
interface ApiMatch {
  id: number | string;
  homeTeam: { name: string; crest?: string };
  awayTeam: { name: string; crest?: string };
  utcDate: string;
  matchday?: number;
  status: string;
  score: any; // Pode ser detalhado futuramente se necessário
}

// Tipagem para as Partidas Formatadas que vão para o Estado
export interface Match {
  id: string;
  home_team: string;
  away_team: string;
  home_flag: string;
  away_flag: string;
  match_date: string;
  round: number;
  status: string;
  score: any;
}

// Tipagem para o retorno bruto do Supabase
interface DbPrediction {
  id: string;
  user_id: string;
  match_id: string | number;
  score_home: number;
  score_away: number;
  points?: number;
}

// Tipagem para as Predições no Estado do Frontend
export interface Prediction {
  id?: string;
  user_id: string;
  match_id: string;
  home_score: number;
  away_score: number;
  points?: number;
}

// Tipagem genérica para o Perfil/Ranking
export interface Profile {
  id: string;
  [key: string]: any; // Permite propriedades flexíveis do banco
}

// -----------------------------

export default function Palpites() {
  const supabase = createClient();
  
  // Substituímos os "any[]" pelas interfaces corretas
  const [dbRanking, setDbRanking] = useState<Profile[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("usuario@email.com");

  // Estados de controle de navegação sincronizada
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Dados vindos da API e Banco devidamente tipados
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [allPredictions, setAllPredictions] = useState<Prediction[]>([]); 

  // 1. Carregar os jogos reais da API e os palpites do Supabase
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        // Buscar matches da API
        const response = await fetch("/api/futebol/competitions/WC/matches");
        const matchData = await response.json();

        const formattedMatches: Match[] = (matchData.matches || []).map((m: ApiMatch) => ({
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

        // Buscar usuário e palpites
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          // Opcional: buscar email do usuário se necessário depois
          
          const { data: rankingData } = await supabase.from("profiles").select("*");
          if (rankingData) setDbRanking(rankingData);

          const { data: allPredictionsData } = await supabase.from("predictions").select("*");
          if (allPredictionsData) {
            const mappedAll: Prediction[] = allPredictionsData.map((p: DbPrediction) => ({
              id: p.id,
              user_id: p.user_id,
              match_id: String(p.match_id),
              home_score: p.score_home,
              away_score: p.score_away,
              points: p.points
            }));
            setAllPredictions(mappedAll);
            const myPredictions = mappedAll.filter(p => p.user_id === user.id);
            setPredictions(myPredictions);
          }
        }

        if (formattedMatches.length > 0) {
          const firstMatchDate = new Date(formattedMatches[0].match_date);
          setSelectedDate(firstMatchDate);
          setCurrentRound(formattedMatches[0].round || 1);
        }

      } catch (error) {
        console.error("Erro ao inicializar dados:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();

    // ✅ NOVO: Polling automático a cada 5 segundos durante partidas
    const interval = setInterval(async () => {
      try {
        const response = await fetch("/api/futebol/competitions/WC/matches");
        const matchData = await response.json();

        const formattedMatches: Match[] = (matchData.matches || []).map((m: ApiMatch) => ({
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

        // Só atualiza se houve mudança
        const hasChanges = JSON.stringify(formattedMatches) !== JSON.stringify(matches);
        if (hasChanges) {
          setMatches(formattedMatches);
        }
      } catch (error) {
        console.error("Erro ao atualizar matches:", error);
      }
    }, 5000); // A cada 5 segundos

    return () => clearInterval(interval);
  }, [matches, supabase]);

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
    const map: Record<string, Prediction> = {};
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
  
  // === FUNÇÃO DE SALVAMENTO ===
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

      // 2. Executa a gravação usando os nomes exatos das colunas do banco (Evita Erro 400)
      if (existing?.id) {
        const { error: updateError } = await supabase
          .from("predictions")
          .update({
            score_home: Number(homeScore),
            score_away: Number(awayScore)
          })
          .eq("id", existing.id);

        if (updateError) console.error("Erro ao atualizar dados:", updateError.message);
      } else {
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
          <LiveRanking 
  user={{ id: userId || "", email: userEmail, name: "Você" }} 
  predictions={allPredictions} 
  liveMatches={matches} 
  dbRanking={dbRanking} 
/>
        </div>
      </div>
    </>
  );
}

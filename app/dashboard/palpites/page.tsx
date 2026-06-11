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

const getRoundFromStage = (stage: string, matchday: number | null | undefined): number => {
  if (matchday) return matchday;
  switch (stage) {
    case 'LAST_32': return 4; // 16 avos
    case 'LAST_16': return 5; // Oitavas
    case 'QUARTER_FINALS': return 6;
    case 'SEMI_FINALS': return 7;
    case 'FINAL': return 8;
    default: return 1;
  }
};

    // 1. Carregar os jogos reais da API e os palpites do Supabase
  useEffect(() => {
    let isMounted = true; // Segurança para evitar memory leak

    async function loadData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/futebol/competitions/WC/matches?t=${Date.now()}`, { cache: 'no-store' });
        const matchData = await response.json();

        if (!isMounted) return;

        const formattedMatches: Match[] = (matchData.matches || []).map((m: any) => ({
          id: String(m.id),
          home_team: m.homeTeam?.name,
          away_team: m.awayTeam?.name,
          home_flag: m.homeTeam?.crest || "🏳️",
          away_flag: m.awayTeam?.crest || "🏳️",
          match_date: m.utcDate,
          round: getRoundFromStage(m.stage, m.matchday),
          status: m.status,
          score: m.score
        }));

        setMatches(formattedMatches);
        
        // [Aqui mantém o seu código existente de carregar palpites e ranking...]
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }

    loadData();

    // Polling ajustado para 10 segundos (10000ms)
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/futebol/competitions/WC/matches?t=${Date.now()}`, { cache: 'no-store' });
        const matchData = await response.json();
        
        if (!isMounted) return;

        const newMatches: Match[] = (matchData.matches || []).map((m: any) => ({
          id: String(m.id),
          home_team: m.homeTeam?.name,
          away_team: m.awayTeam?.name,
          home_flag: m.homeTeam?.crest || "🏳️",
          away_flag: m.awayTeam?.crest || "🏳️",
          match_date: m.utcDate,
          round: getRoundFromStage(m.stage, m.matchday),
          status: m.status,
          score: m.score
        }));

        // LÓGICA DE PROTEÇÃO: Só atualiza se o placar ou status mudou
        setMatches((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(newMatches)) {
            return newMatches;
          }
          return prev;
        });
      } catch (error) {
        console.error("Erro no polling:", error);
      }
    }, 10000); 

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [supabase]);



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

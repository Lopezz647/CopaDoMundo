"use client";
import React, { useState, useMemo } from "react";
import { addDays } from "date-fns";
import { Loader2 } from "lucide-react";

import UserHeader from "@/components/layout/UserHeader";
import PromoBanner from "@/components/bolao/PromoBanner";
import DateNavigator from "@/components/bolao/DateNavigator";
import ProgressSection from "@/components/bolao/ProgressSection";
import MatchCard from "@/components/bolao/MatchCard";
import LiveRanking from "@/components/bolao/LiveRanking";

// TODO: Substituir essa lista estática pelas chamadas reais da API-Football
const MOCK_MATCHES = [
  { id: "mock-1", home_team: "Coreia do Sul", away_team: "República Tcheca", home_flag: "🇰🇷", away_flag: "🇨🇿", match_date: new Date(2026, 5, 11, 16, 0).toISOString(), round: 1 },
  { id: "mock-2", home_team: "México", away_team: "África do Sul", home_flag: "🇲🇽", away_flag: "🇿🇦", match_date: new Date(2026, 5, 11, 19, 0).toISOString(), round: 1 },
  { id: "mock-3", home_team: "Japão", away_team: "Holanda", home_flag: "🇯🇵", away_flag: "🇳🇱", match_date: new Date(2026, 5, 12, 13, 0).toISOString(), round: 1 },
  { id: "mock-4", home_team: "Brasil", away_team: "Alemanha", home_flag: "🇧🇷", away_flag: "🇩🇪", match_date: new Date(2026, 5, 13, 16, 0).toISOString(), round: 1 },
  { id: "mock-5", home_team: "Argentina", away_team: "França", home_flag: "🇦🇷", away_flag: "🇫🇷", match_date: new Date(2026, 5, 14, 16, 0).toISOString(), round: 1 },
  { id: "mock-6", home_team: "Portugal", away_team: "Espanha", home_flag: "🇵🇹", away_flag: "🇪🇸", match_date: new Date(2026, 5, 15, 16, 0).toISOString(), round: 1 },
  { id: "mock-7", home_team: "Inglaterra", away_team: "Itália", home_flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", away_flag: "🇮🇹", match_date: new Date(2026, 5, 16, 13, 0).toISOString(), round: 1 },
  { id: "mock-8", home_team: "Uruguai", away_team: "Colômbia", home_flag: "🇺🇾", away_flag: "🇨🇴", match_date: new Date(2026, 5, 17, 16, 0).toISOString(), round: 1 },
];

export default function Palpites() {
  // TODO: Substituir pela chamada real da sessão do Supabase (ex: const supabase = createClient(); const { data } = await supabase.auth.getUser(); )
  const user = { email: "usuario@email.com", full_name: "Usuário Teste" };
  
  const [currentRound, setCurrentRound] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 5, 15));
  
  // TODO: Ao integrar com o backend, 'matches' virá da API-Football e 'predictions' virá do Supabase
  const [matches, setMatches] = useState(MOCK_MATCHES);
  const [predictions, setPredictions] = useState<any[]>([]); // Estado local temporário para a interface
  const [loadingMatches, setLoadingMatches] = useState(false);

  const dates = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => addDays(new Date(2026, 5, 11), i)),
    []
  );

  const filteredMatches = useMemo(() =>
    matches.filter(m => new Date(m.match_date).toDateString() === selectedDate.toDateString()),
    [matches, selectedDate]
  );

  const predictionMap = useMemo(() => {
    const map: Record<string, any> = {};
    predictions.forEach(p => { map[p.match_id] = p; });
    return map;
  }, [predictions]);

  // Função simulada para atualizar a interface. No futuro, conectará ao Supabase.
  const handlePredictionChange = (matchId: string, homeScore: number, awayScore: number) => {
    console.log(`TODO Supabase: Salvar palpite -> Jogo ${matchId} | ${homeScore} x ${awayScore}`);
    
    setPredictions(prev => {
      const existingIndex = prev.findIndex(p => p.match_id === matchId);
      if (existingIndex >= 0) {
        const newPredictions = [...prev];
        newPredictions[existingIndex] = { ...newPredictions[existingIndex], home_score: homeScore, away_score: awayScore };
        return newPredictions;
      }
      return [...prev, { match_id: matchId, home_score: homeScore, away_score: awayScore, user_email: user.email }];
    });
  };

  return (
    <>
      <div className="pb-2">
        <UserHeader />
      </div>
      <div className="mt-6 grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          <PromoBanner />

          <DateNavigator
            currentRound={currentRound}
            onRoundChange={setCurrentRound}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            dates={dates}
            predictions={predictions}
            matches={matches}
          />

          <ProgressSection
            made={predictions.length}
            total={matches.length}
            multiplier={2}
          />

          {/* Match list */}
          <div className="flex flex-col gap-4">
            {loadingMatches ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-[#4edea3]" />
              </div>
            ) : filteredMatches.length === 0 ? (
              <div className="bg-[#201f1f] rounded-2xl border border-white/5 p-8 text-center">
                <p className="text-[#bbcabf] text-sm">Nenhum jogo nesta data.</p>
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

        {/* Right column */}
        <div className="flex flex-col gap-6">
          <LiveRanking user={user} predictions={predictions} />
        </div>
      </div>
    </>
  );
}

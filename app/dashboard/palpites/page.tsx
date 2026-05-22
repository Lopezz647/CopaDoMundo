import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { addDays } from "date-fns";
import { Loader2 } from "lucide-react";

import UserHeader from "@/components/layout/UserHeader";
import PromoBanner from "@/components/bolao/PromoBanner";
import DateNavigator from "@/components/bolao/DateNavigator";
import ProgressSection from "@/components/bolao/ProgressSection";
import MatchCard from "@/components/bolao/MatchCard";
import LiveRanking from "@/components/bolao/LiveRanking";

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
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentRound, setCurrentRound] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 5, 15));

  const { data: dbMatches, isLoading: loadingMatches } = useQuery({
    queryKey: ["matches"],
    queryFn: () => base44.entities.Match.list(),
    initialData: [],
  });

  const { data: predictions } = useQuery({
    queryKey: ["predictions", user?.email],
    queryFn: () => base44.entities.Prediction.filter({ user_email: user?.email }),
    initialData: [],
    enabled: !!user?.email,
  });

  const matches = dbMatches.length > 0 ? dbMatches : MOCK_MATCHES;

  const dates = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => addDays(new Date(2026, 5, 11), i)),
    []
  );

  const filteredMatches = useMemo(() =>
    matches.filter(m => new Date(m.match_date).toDateString() === selectedDate.toDateString()),
    [matches, selectedDate]
  );

  const predictionMap = useMemo(() => {
    const map = {};
    predictions.forEach(p => { map[p.match_id] = p; });
    return map;
  }, [predictions]);

  const createPrediction = useMutation({
    mutationFn: (data) => base44.entities.Prediction.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["predictions"] }),
  });

  const updatePrediction = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Prediction.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["predictions"] }),
  });

  const handlePredictionChange = (matchId, homeScore, awayScore) => {
    const existing = predictionMap[matchId];
    if (existing) {
      updatePrediction.mutate({ id: existing.id, data: { home_score: homeScore, away_score: awayScore } });
    } else {
      createPrediction.mutate({ match_id: matchId, home_score: homeScore, away_score: awayScore, user_email: user?.email });
    }
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

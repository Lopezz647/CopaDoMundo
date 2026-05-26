import React, { useState, useEffect } from "react";

export default function MatchCard({ match, prediction, onPredictionChange }) {
  const [homeScore, setHomeScore] = useState(prediction?.home_score ?? null);
  const [awayScore, setAwayScore] = useState(prediction?.away_score ?? null);

  useEffect(() => {
    setHomeScore(prediction?.home_score ?? null);
    setAwayScore(prediction?.away_score ?? null);
  }, [prediction]);

  const hasPrediction = homeScore !== null && awayScore !== null;
  const matchTime = new Date(match.match_date).getTime();
  const now = Date.now();
  const fifteenMinutesInMs = 15 * 60 * 1000;
  const isLocked = matchTime - now < fifteenMinutesInMs;
  const daysLeft = Math.max(0, Math.ceil((matchTime - now) / (1000 * 60 * 60 * 24)));

  const handleChange = (side, delta) => {
    if (isLocked) return;
    if (side === "home") {
      const next = Math.max(0, (homeScore ?? 0) + delta);
      setHomeScore(next);
      onPredictionChange?.(match.id, next, awayScore ?? 0);
    } else {
      const next = Math.max(0, (awayScore ?? 0) + delta);
      setAwayScore(next);
      onPredictionChange?.(match.id, homeScore ?? 0, next);
    }
  };

  return (
    <div
      className={`rounded-xl border overflow-hidden transition-opacity ${isLocked ? "opacity-85" : ""}`}
      style={{ background: "#181818", borderColor: isLocked ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          {isLocked ? (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
              <span className="material-symbols-rounded text-[12px]">lock</span>
              Encerrado
            </div>
          ) : (
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold"
              style={hasPrediction
                ? { background: "rgba(78,222,163,0.12)", color: "#4edea3", border: "1px solid rgba(78,222,163,0.2)" }
                : { background: "#222", color: "#8a9a8e", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span className="material-symbols-rounded text-[12px]">{hasPrediction ? "check_circle" : "schedule"}</span>
              {hasPrediction ? "Palpite feito" : "Sem palpite"}
            </div>
          )}
        </div>
      </div>

      {/* Match Content */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-center gap-6">
          
          {/* Home Team */}
          <div className="flex flex-col items-center gap-3 w-[120px]">
            <div className="w-14 h-10 flex items-center justify-center text-4xl leading-none">
              {match.home_flag?.startsWith('http') ? (
                <img src={match.home_flag} alt={match.home_team} className="h-10 object-contain" />
              ) : (
                match.home_flag || "🏳️"
              )}
            </div>
            <span className="text-[13px] font-semibold text-[#e5e2e1] text-center">{match.home_team}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => handleChange("home", -1)} disabled={isLocked} className="w-7 h-7 rounded bg-[#222] flex items-center justify-center hover:bg-[#333] disabled:opacity-30">
                <span className="material-symbols-rounded text-[16px]">remove</span>
              </button>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[20px] font-bold bg-[#111]">
                {homeScore ?? "-"}
              </div>
              <button onClick={() => handleChange("home", 1)} disabled={isLocked} className="w-7 h-7 rounded bg-[#222] flex items-center justify-center hover:bg-[#333] disabled:opacity-30">
                <span className="material-symbols-rounded text-[16px]">add</span>
              </button>
            </div>
          </div>

          <div className="text-[#444] font-bold text-xl">×</div>

          {/* Away Team */}
          <div className="flex flex-col items-center gap-3 w-[120px]">
            <div className="w-14 h-10 flex items-center justify-center text-4xl leading-none">
              {match.away_flag?.startsWith('http') ? (
                <img src={match.away_flag} alt={match.away_team} className="h-10 object-contain" />
              ) : (
                match.away_flag || "🏳️"
              )}
            </div>
            <span className="text-[13px] font-semibold text-[#e5e2e1] text-center">{match.away_team}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => handleChange("away", -1)} disabled={isLocked} className="w-7 h-7 rounded bg-[#222] flex items-center justify-center hover:bg-[#333] disabled:opacity-30">
                <span className="material-symbols-rounded text-[16px]">remove</span>
              </button>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[20px] font-bold bg-[#111]">
                {awayScore ?? "-"}
              </div>
              <button onClick={() => handleChange("away", 1)} disabled={isLocked} className="w-7 h-7 rounded bg-[#222] flex items-center justify-center hover:bg-[#333] disabled:opacity-30">
                <span className="material-symbols-rounded text-[16px]">add</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
);
}
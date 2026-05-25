import React, { useState, useEffect } from "react";

export default function MatchCard({ match, prediction, onPredictionChange }) {
  const [homeScore, setHomeScore] = useState(prediction?.home_score ?? null);
  const [awayScore, setAwayScore] = useState(prediction?.away_score ?? null);

  useEffect(() => {
    setHomeScore(prediction?.home_score ?? null);
    setAwayScore(prediction?.away_score ?? null);
  }, [prediction]);

  const hasPrediction = homeScore !== null && awayScore !== null;

  const daysLeft = Math.max(0, Math.ceil(
    (new Date(match.match_date) - new Date()) / (1000 * 60 * 60 * 24)
  ));

  const handleChange = (side, delta) => {
    if (side === "home") {
      const next = Math.max(0, (homeScore ?? 0) + delta);
      setHomeScore(next);
      const aw = awayScore ?? 0;
      setAwayScore(aw);
      onPredictionChange?.(match.id, next, aw);
    } else {
      const next = Math.max(0, (awayScore ?? 0) + delta);
      setAwayScore(next);
      const hw = homeScore ?? 0;
      setHomeScore(hw);
      onPredictionChange?.(match.id, hw, next);
    }
  };

  return (
    <div
      className="rounded-xl border border-white/5 overflow-hidden"
      style={{ background: "#181818" }}
    >
      {/* Top status bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          {/* Sem palpite / Palpite feito pill */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold"
            style={hasPrediction
              ? { background: "rgba(78,222,163,0.12)", color: "#4edea3", border: "1px solid rgba(78,222,163,0.2)" }
              : { background: "#222", color: "#8a9a8e", border: "1px solid rgba(255,255,255,0.06)" }
            }
          >
            <span className="material-symbols-rounded text-[12px]">{hasPrediction ? "check_circle" : "schedule"}</span>
            {hasPrediction ? "Palpite feito" : "Sem palpite"}
          </div>

          {/* Fecha em X dias pill */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#4edea3]"
            style={{ background: "rgba(78,222,163,0.08)", border: "1px solid rgba(78,222,163,0.2)" }}
          >
            <span className="material-symbols-rounded text-[12px]">schedule</span>
            Fecha em {daysLeft} dias
          </div>
        </div>

        {/* Quem palpitou */}
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold text-[#4edea3] transition-colors hover:bg-[#4edea3]/20"
          style={{ background: "rgba(78,222,163,0.15)", border: "1px solid rgba(78,222,163,0.25)" }}
        >
          <span className="material-symbols-rounded text-[14px]">group</span>
          Quem palpitou
        </button>
      </div>

      {/* Match body */}
      <div className="px-6 py-6">
        <div className="flex items-start justify-center gap-6">
          {/* Home team */}
          <div className="flex flex-col items-center gap-3 w-[130px]">
            {/* Flag */}
            <div className="w-14 h-10 flex items-center justify-center text-4xl leading-none">
              {match.home_flag || "🏳️"}
            </div>
            <span className="text-[13px] font-semibold text-[#e5e2e1] text-center leading-tight">{match.home_team}</span>
            {/* Score controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleChange("home", -1)}
                className="w-7 h-7 rounded flex items-center justify-center text-[#8a9a8e] hover:text-white transition-colors"
                style={{ background: "#222", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <span className="material-symbols-rounded text-[16px]">remove</span>
              </button>
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-[20px] font-bold"
                style={{ background: "#111", border: "1px solid rgba(255,255,255,0.08)", color: homeScore !== null ? "#e5e2e1" : "#444" }}
              >
                {homeScore !== null ? homeScore : "-"}
              </div>
              <button
                onClick={() => handleChange("home", 1)}
                className="w-7 h-7 rounded flex items-center justify-center text-[#8a9a8e] hover:text-white transition-colors"
                style={{ background: "#222", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <span className="material-symbols-rounded text-[16px]">add</span>
              </button>
            </div>
          </div>

          {/* X separator */}
          <div className="flex items-center justify-center mt-8 text-[#444] font-bold text-[15px] w-8">×</div>

          {/* Away team */}
          <div className="flex flex-col items-center gap-3 w-[130px]">
            <div className="w-14 h-10 flex items-center justify-center text-4xl leading-none">
              {match.away_flag || "🏳️"}
            </div>
            <span className="text-[13px] font-semibold text-[#e5e2e1] text-center leading-tight">{match.away_team}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleChange("away", -1)}
                className="w-7 h-7 rounded flex items-center justify-center text-[#8a9a8e] hover:text-white transition-colors"
                style={{ background: "#222", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <span className="material-symbols-rounded text-[16px]">remove</span>
              </button>
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-[20px] font-bold"
                style={{ background: "#111", border: "1px solid rgba(255,255,255,0.08)", color: awayScore !== null ? "#e5e2e1" : "#444" }}
              >
                {awayScore !== null ? awayScore : "-"}
              </div>
              <button
                onClick={() => handleChange("away", 1)}
                className="w-7 h-7 rounded flex items-center justify-center text-[#8a9a8e] hover:text-white transition-colors"
                style={{ background: "#222", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <span className="material-symbols-rounded text-[16px]">add</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

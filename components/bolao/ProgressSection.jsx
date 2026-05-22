import React from "react";

export default function ProgressSection({ made, total, multiplier }) {
  const pct = total > 0 ? Math.round((made / total) * 100) : 0;

  return (
    <div className="rounded-xl border border-white/5 px-5 py-4" style={{ background: "#181818" }}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-[13px] font-semibold text-[#e5e2e1]">{made} de {total} palpites feitos</span>
        <span
          className="text-[11px] font-bold text-[#ffb95f] px-2 py-0.5 rounded"
          style={{ background: "rgba(255,185,95,0.12)", border: "1px solid rgba(255,185,95,0.25)" }}
        >
          {pct}%
        </span>
      </div>
      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full mb-3" style={{ background: "#2a2a2a" }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: "#ffb95f",
            boxShadow: "0 0 8px rgba(255,185,95,0.6)",
          }}
        />
      </div>
      <div className="flex items-center gap-1.5">
        <span className="material-symbols-outlined text-[14px] text-[#ffb95f]">local_fire_department</span>
        <span className="text-[12px] text-[#ffb95f]">Rodada com multiplicador {multiplier}x — cada palpite vale mais!</span>
      </div>
    </div>
  );
}

import React from "react";

export default function LiveRanking({ user, predictions }) {
  return (
    <div
      className="rounded-xl border border-white/5 p-5 sticky top-6"
      style={{ background: "#181818" }}
    >
      {/* Title */}
      <div className="flex items-center gap-2 mb-5">
        <span className="text-[18px]">🏆</span>
        <h2 className="text-[16px] font-bold text-[#e5e2e1]">Ranking ao Vivo</h2>
      </div>

      {/* User row */}
      <div
        className="flex items-center justify-between px-3 py-3 rounded-xl relative overflow-hidden"
        style={{ background: "#111", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Left green accent bar */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl" style={{ background: "#4edea3" }} />

        <div className="flex items-center gap-3 ml-2">
          {/* Rank badge */}
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold text-[#8a9a8e]"
            style={{ background: "#1e1e1e", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            🏆
          </div>

          {/* Avatar */}
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "rgba(78,222,163,0.15)", border: "1px solid rgba(78,222,163,0.2)" }}
          >
            <span className="material-symbols-rounded text-[#4edea3] text-[14px]">person</span>
          </div>

          {/* Name + palpites */}
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-[#e5e2e1]">{user?.full_name || "Aquila"}</span>
            <span className="text-[10px] text-[#8a9a8e]">{predictions?.length || 0} palpites</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[20px] font-bold text-[#e5e2e1]">0</span>
          <div
            className="text-[10px] font-bold text-[#4edea3] px-2 py-0.5 rounded uppercase tracking-wider"
            style={{ background: "rgba(78,222,163,0.15)", border: "1px solid rgba(78,222,163,0.25)" }}
          >
            Você
          </div>
        </div>
      </div>
    </div>
  );
}

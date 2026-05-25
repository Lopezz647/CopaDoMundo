import React from "react";

export default function PromoBanner() {
  return (
    <div
      className="rounded-xl overflow-hidden relative"
      style={{ background: "linear-gradient(135deg, #1a2e24 0%, #0f1f17 60%, #0a0a0a 100%)", border: "1px solid rgba(78,222,163,0.15)" }}
    >
      <div className="relative p-5 flex items-center justify-between">
        <div className="flex items-center gap-5">
          {/* FIFA-style trophy circle */}
          <div
            className="w-[72px] h-[72px] rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
            style={{ background: "radial-gradient(circle, #1e3d2e 0%, #0d1f16 100%)", border: "2px solid rgba(78,222,163,0.25)", boxShadow: "0 0 20px rgba(78,222,163,0.1)" }}
          >
            <span className="text-4xl">🏆</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <h1 className="text-[22px] font-bold text-[#e5e2e1] leading-none">Bolão</h1>
            <div className="flex items-center gap-1.5 text-[12px] text-[#4edea3]">
              <span className="material-symbols-rounded text-[13px]">sync</span>
              <span>Atualizações em até 2 minutos.</span>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-[#ff6b6b]">
              <span className="material-symbols-rounded text-[13px]">radio_button_checked</span>
              <span>Palpites até 5min antes do jogo</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <button
            className="border border-[#4edea3]/50 text-[#4edea3] text-[11px] font-bold px-4 py-1.5 rounded-full tracking-wider uppercase hover:bg-[#4edea3]/10 transition-colors"
          >
            COPA DO MUNDO
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold text-[#003824] transition-all"
            style={{ background: "#4edea3", boxShadow: "0 2px 10px rgba(78,222,163,0.35)" }}
          >
            <span className="material-symbols-rounded text-[16px]">table_chart</span>
            Tabela
          </button>
        </div>
      </div>
    </div>
  );
}

import React from "react";

const DAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTH_NAMES = ["JAN","FEV","MAR","ABR","MAI","JUN","JUL","AGO","SET","OUT","NOV","DEZ"];

// Constante para controlar o limite de rodadas da Fase de Grupos
const MAX_GROUP_ROUNDS = 6;

export default function DateNavigator({ currentRound, onRoundChange, selectedDate, onDateChange, dates, predictions, matches }) {
  const predictionMatchIds = new Set(predictions.map(p => p.match_id));

  // Lógica para nomear o cabeçalho dependendo da rodada
  const roundTitle = currentRound <= MAX_GROUP_ROUNDS 
    ? `Fase de Grupos - ${currentRound}` 
    : "Playoffs";

  return (
    <div className="rounded-xl border border-white/5 overflow-hidden" style={{ background: "#181818" }}>
      {/* Round header row */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <button
          onClick={() => onRoundChange(Math.max(1, currentRound - 1))}
          className="w-7 h-7 flex items-center justify-center text-[#8a9a8e] hover:text-[#e5e2e1] transition-colors"
        >
          <span className="material-symbols-rounded text-[20px]">keyboard_double_arrow_left</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[15px] font-bold text-[#e5e2e1]">{roundTitle}</span>
          
          {/* Mostra o ícone de fogo/multiplicador apenas nas fases de grupos */}
          {currentRound <= MAX_GROUP_ROUNDS && (
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold text-[#ffb95f]"
              style={{ background: "rgba(255,185,95,0.12)", border: "1px solid rgba(255,185,95,0.25)" }}
            >
              <span className="material-symbols-rounded text-[12px]">local_fire_department</span>
              2x
            </div>
          )}
        </div>

        <button
          onClick={() => onRoundChange(currentRound + 1)}
          // Opcional: Se quiser bloquear o avanço após os playoffs (ex: max round 7), adicione uma lógica aqui
          className="w-7 h-7 flex items-center justify-center text-[#8a9a8e] hover:text-[#e5e2e1] transition-colors"
        >
          <span className="material-symbols-rounded text-[20px]">keyboard_double_arrow_right</span>
        </button>
      </div>

      {/* Date row (Modificado para Scroll Horizontal) */}
      {/* O overflow-x-auto permite a rolagem. scrollbar-hide esconde a barra visual para um look mais limpo */}
      <div className="flex px-2 py-3 gap-1 overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide">
        {dates.map((date, idx) => {
          const d = new Date(date);
          const dayName = DAY_NAMES[d.getDay()];
          const dayNum = d.getDate();
          const month = MONTH_NAMES[d.getMonth()];
          const isSelected = selectedDate && new Date(selectedDate).toDateString() === d.toDateString();

          const matchesOnDay = matches.filter(m => new Date(m.match_date).toDateString() === d.toDateString());
          const allPredicted = matchesOnDay.length > 0 && matchesOnDay.every(m => predictionMatchIds.has(m.id));
          const hasPending = matchesOnDay.length > 0 && matchesOnDay.some(m => !predictionMatchIds.has(m.id));

          if (isSelected) {
            return (
              <button
                key={idx}
                onClick={() => onDateChange(d)}
                // Removido flex-1, adicionado min-w-[70px] e flex-shrink-0
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg relative min-w-[70px] flex-shrink-0"
                style={{ background: "rgba(78,222,163,0.12)", border: "1px solid rgba(78,222,163,0.35)" }}
              >
                {/* orange dot top-right */}
                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#ffb95f]" style={{ boxShadow: "0 0 6px rgba(255,185,95,0.9)" }} />
                <span className="text-[10px] font-bold text-[#4edea3] uppercase tracking-wide">{dayName}</span>
                <span className="text-[13px] font-bold text-[#4edea3]">{dayNum} <span className="text-[10px] font-medium">{month}</span></span>
              </button>
            );
          }

          return (
            <button
              key={idx}
              onClick={() => onDateChange(d)}
              // Removido flex-1, adicionado min-w-[70px] e flex-shrink-0
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5 min-w-[70px] flex-shrink-0"
            >
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-[#8a9a8e] uppercase tracking-wide">{dayName}</span>
                {allPredicted && (
                  <span className="material-symbols-rounded text-[11px] text-[#4edea3]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                )}
                {!allPredicted && hasPending && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ffb95f]" />
                )}
              </div>
              <span className="text-[13px] font-medium text-[#8a9a8e]">{dayNum} <span className="text-[10px]">{month}</span></span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

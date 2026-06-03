import React, { useRef, useEffect } from "react";

const DAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTH_NAMES = ["JAN","FEV","MAR","ABR","MAI","JUN","JUL","AGO","SET","OUT","NOV","DEZ"];

// AJUSTE 1: Definindo o limite de grupos e o total de fases da Copa
const MAX_GROUP_ROUNDS = 3; 
const MAX_TOTAL_ROUNDS = 7; 

// --- NOVAS INTERFACES DE TIPAGEM ---
export interface Prediction {
  match_id: string | number;
}

export interface Match {
  id: string | number;
  match_date?: string | Date;
  utcDate?: string | Date;
}

interface DateNavigatorProps {
  currentRound: number;
  onRoundChange: (round: number) => void;
  selectedDate: string | Date | null;
  onDateChange: (date: Date) => void;
  dates: (string | Date)[];
  predictions: Prediction[];
  matches: Match[];
}
// -----------------------------------

export default function DateNavigator({ 
  currentRound, 
  onRoundChange, 
  selectedDate, 
  onDateChange, 
  dates, 
  predictions, 
  matches 
}: DateNavigatorProps) {
  
  // Tipagem aplicada na predição
  const predictionMatchIds = new Set(predictions.map((p: Prediction) => p.match_id));
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // AJUSTE 2: Função que nomeia a rodada de acordo com o número numérico (1 a 7)
  const getRoundTitle = (round: number) => {
    if (round <= MAX_GROUP_ROUNDS) return `Rodada ${round} - Grupos`;
    if (round === 4) return "Oitavas de Final";
    if (round === 5) return "Quartas de Final";
    if (round === 6) return "Semifinal";
    if (round === 7) return "Final";
    return "Playoffs";
  };

  const roundTitle = getRoundTitle(currentRound);

  // Lógica de Auto-Scroll mantida intacta
  useEffect(() => {
    if (scrollContainerRef.current && selectedDate) {
      const container = scrollContainerRef.current;
      const selectedDateStr = new Date(selectedDate).toDateString();
      
      const selectedButton = container.querySelector(`[data-date="${selectedDateStr}"]`) as HTMLElement;
      if (selectedButton) {
        const containerWidth = container.offsetWidth;
        const buttonWidth = selectedButton.offsetWidth;
        const buttonLeft = selectedButton.offsetLeft;

        const scrollPosition = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);

        container.scrollTo({
          left: scrollPosition,
          behavior: "smooth"
        });
      }
    }
  }, [selectedDate, dates]); 

  return (
    <div className="rounded-xl border border-white/5 overflow-hidden" style={{ background: "#181818" }}>
      {/* Round header row */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <button
          onClick={() => onRoundChange(Math.max(1, currentRound - 1))}
          disabled={currentRound === 1}
          className={`w-7 h-7 flex items-center justify-center transition-colors ${currentRound === 1 ? "text-white/10 cursor-not-allowed" : "text-[#8a9a8e] hover:text-[#e5e2e1]"}`}
        >
          <span className="material-symbols-rounded text-[20px]">keyboard_double_arrow_left</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[15px] font-bold text-[#e5e2e1]">{roundTitle}</span>
          
          {currentRound <= MAX_GROUP_ROUNDS && (
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold text-[#ffb95f]"
              style={{ background: "rgba(255,185,95,0.12)", border: "1px solid rgba(255,185,95,0.25)" }}
            >
              <span className="material-symbols-rounded text-[12px]">local_fire_department</span>
            </div>
          )}
        </div>

        {/* AJUSTE 3: Impede a seta da direita de passar da fase Final (Fase 7) */}
        <button
          onClick={() => onRoundChange(Math.min(MAX_TOTAL_ROUNDS, currentRound + 1))}
          disabled={currentRound === MAX_TOTAL_ROUNDS}
          className={`w-7 h-7 flex items-center justify-center transition-colors ${currentRound === MAX_TOTAL_ROUNDS ? "text-white/10 cursor-not-allowed" : "text-[#8a9a8e] hover:text-[#e5e2e1]"}`}
        >
          <span className="material-symbols-rounded text-[20px]">keyboard_double_arrow_right</span>
        </button>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex px-2 py-3 gap-1 w-full custom-scrollbar-dates overflow-x-auto"
      >
        {/* Tipagem aplicada no parâmetro 'date' */}
        {dates.map((date: string | Date, idx: number) => {
          const d = new Date(date);
          const dateString = d.toDateString(); 
          const dayName = DAY_NAMES[d.getDay()];
          const dayNum = d.getDate();
          const month = MONTH_NAMES[d.getMonth()];
          
          const isSelected = selectedDate && new Date(selectedDate).toDateString() === dateString;

          // Tipagem aplicada nos parâmetros 'm' das partidas
          const matchesOnDay = matches.filter((m: Match) => new Date(m.match_date || m.utcDate || "").toDateString() === dateString);
          const allPredicted = matchesOnDay.length > 0 && matchesOnDay.every((m: Match) => predictionMatchIds.has(m.id));
          const hasPending = matchesOnDay.length > 0 && matchesOnDay.some((m: Match) => !predictionMatchIds.has(m.id));

          const baseButtonClasses = "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg relative min-w-[70px] flex-shrink-0";

          if (isSelected) {
            return (
              <button
                key={idx}
                data-date={dateString}
                onClick={() => onDateChange(d)}
                className={baseButtonClasses}
                style={{ background: "rgba(78,222,163,0.12)", border: "1px solid rgba(78,222,163,0.35)" }}
              >
                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#ffb95f]" style={{ boxShadow: "0 0 6px rgba(255,185,95,0.9)" }} />
                <span className="text-[10px] font-bold text-[#4edea3] uppercase tracking-wide">{dayName}</span>
                <span className="text-[13px] font-bold text-[#4edea3]">{dayNum} <span className="text-[10px] font-medium">{month}</span></span>
              </button>
            );
          }

          return (
            <button
              key={idx}
              data-date={dateString}
              onClick={() => onDateChange(d)}
              className={`${baseButtonClasses} transition-colors hover:bg-white/5`}
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

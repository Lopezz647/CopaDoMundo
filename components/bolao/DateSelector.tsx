import React from "react";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

const DAY_ABBREVS = {
  0: "DOM",
  1: "SEG",
  2: "TER",
  3: "QUA",
  4: "QUI",
  5: "SEX",
  6: "SÁB",
};

const MONTH_ABBREVS = [
  "JAN", "FEV", "MAR", "ABR", "MAI", "JUN",
  "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"
];

export default function DateSelector({ selectedDate, onDateChange, dates }) {
  // Generate 7 days starting from a base date
  const baseDates = dates && dates.length > 0
    ? dates
    : Array.from({ length: 7 }, (_, i) => addDays(new Date(2026, 5, 11), i));

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1">
      {baseDates.map((date, idx) => {
        const d = new Date(date);
        const dayOfWeek = d.getDay();
        const dayNum = d.getDate();
        const month = MONTH_ABBREVS[d.getMonth()];
        const isSelected =
          selectedDate && new Date(selectedDate).toDateString() === d.toDateString();
        const hasMatches = idx === 0 || idx === 2; // Mock indicator

        return (
          <button
            key={idx}
            onClick={() => onDateChange(d)}
            className={`flex flex-col items-center px-4 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 min-w-[60px] relative ${
              isSelected
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <span className="text-[10px] tracking-wider">{DAY_ABBREVS[dayOfWeek]}</span>
            <span className="text-lg font-bold mt-0.5">{dayNum}</span>
            <span className="text-[10px] tracking-wider">{month}</span>
            {hasMatches && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent" />
            )}
          </button>
        );
      })}
    </div>
  );
}

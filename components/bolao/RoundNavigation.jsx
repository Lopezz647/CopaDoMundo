import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui-dashboard/badge";

export default function RoundNavigation({ currentRound, onRoundChange }) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 flex items-center justify-between">
      <button
        onClick={() => onRoundChange(currentRound - 1)}
        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <div className="flex items-center gap-2">
        <span className="text-base font-bold text-foreground">
          Fase de Grupos - {currentRound}
        </span>
        <Badge className="bg-accent/20 text-accent border-0 text-xs px-2 py-0.5">
          🔥 2x
        </Badge>
      </div>
      <button
        onClick={() => onRoundChange(currentRound + 1)}
        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

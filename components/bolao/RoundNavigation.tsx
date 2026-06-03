import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui-dashboard/badge";

// 1. Criamos a interface para as propriedades
interface RoundNavigationProps {
  currentRound: number;
  onRoundChange: (round: number) => void; // Avisa que é uma função que recebe o número da nova rodada
}

// 2. Aplicamos a interface ao componente
export default function RoundNavigation({ currentRound, onRoundChange }: RoundNavigationProps) {
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
      <Badge variant="default" className="bg-accent/20 text-accent border-0 text-xs px-2 py-0.5">
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

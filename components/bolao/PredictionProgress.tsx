import React from "react";
import { Progress } from "@/components/ui/progress";

interface PredictionProgressProps {
  made: number;
  total: number;
  multiplier?: number;
}

export default function PredictionProgress({ made, total, multiplier }: PredictionProgressProps) {
  const percentage = total > 0 ? Math.round((made / total) * 100) : 0;

  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground">
          <span className="font-bold">{made}</span> de{" "}
          <span className="font-bold">{total}</span> palpites feitos
        </p>
        <span className="text-xs text-muted-foreground font-medium">{percentage}%</span>
      </div>
      
      {/* Adicione esta linha exata abaixo para o TypeScript ignorar o erro do value */}
      {/* @ts-expect-error: Componente Progress está sem a tipagem correta exportada */}
      <Progress value={percentage} className="h-1.5 bg-muted" />
      
      {multiplier && (
        <div className="flex items-center gap-2">
          <span className="text-accent text-sm">🔥</span>
          <span className="text-xs text-muted-foreground">
            Rodada com multiplicador {multiplier}x — cada palpite vale mais!
          </span>
        </div>
      )}
    </div>
  );
}

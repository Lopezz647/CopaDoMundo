import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableProperties } from "lucide-react";

export default function CompetitionHeader() {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center text-3xl">
            🏆
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Bolão</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-primary text-xs">✅</span>
              <span className="text-xs text-muted-foreground">
                Atualizações em até 2 minutos.
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-destructive text-xs">🔴</span>
              <span className="text-xs text-muted-foreground">
                Palpites até 5min antes do jogo
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="border-border text-foreground font-medium px-3 py-1.5">
            COPA DO MUNDO
          </Badge>
          <Button variant="outline" size="sm" className="gap-1.5">
            <TableProperties className="w-3.5 h-3.5" />
            Tabela
          </Button>
        </div>
      </div>
    </div>
  );
}

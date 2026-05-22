import React from "react";
import { Trophy, Medal, User, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const MOCK_RANKING = [
  { name: "Carlos", points: 42, predictions: 24, exact: 5 },
  { name: "Maria", points: 38, predictions: 24, exact: 4 },
  { name: "João", points: 35, predictions: 22, exact: 3 },
  { name: "Ana", points: 30, predictions: 24, exact: 2 },
  { name: "Aquila", points: 28, predictions: 20, exact: 2, isYou: true },
  { name: "Pedro", points: 25, predictions: 24, exact: 1 },
  { name: "Lucas", points: 22, predictions: 18, exact: 1 },
  { name: "Fernanda", points: 20, predictions: 20, exact: 0 },
];

const medalColors = ["text-yellow-400", "text-gray-300", "text-amber-600"];

export default function Ranking() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="w-6 h-6 text-accent" />
        <h1 className="text-2xl font-bold text-foreground">Ranking Geral</h1>
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-4">
        {MOCK_RANKING.slice(0, 3).map((player, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-card rounded-xl border border-border p-5 text-center ${
              idx === 0 ? "ring-1 ring-yellow-400/30" : ""
            }`}
          >
            <Medal className={`w-8 h-8 mx-auto mb-2 ${medalColors[idx]}`} />
            <div className="w-12 h-12 rounded-full bg-muted mx-auto flex items-center justify-center mb-2">
              <User className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-bold text-foreground">{player.name}</p>
            <p className="text-2xl font-bold text-primary mt-1">{player.points}</p>
            <p className="text-xs text-muted-foreground">pontos</p>
          </motion.div>
        ))}
      </div>

      {/* Full ranking table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-[48px_1fr_80px_80px_80px] px-4 py-3 border-b border-border text-xs text-muted-foreground font-medium">
          <span>#</span>
          <span>Jogador</span>
          <span className="text-center">Pts</span>
          <span className="text-center">Palpites</span>
          <span className="text-center">Exatos</span>
        </div>
        {MOCK_RANKING.map((player, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`grid grid-cols-[48px_1fr_80px_80px_80px] px-4 py-3 items-center border-b border-border last:border-0 ${
              player.isYou ? "bg-primary/5" : "hover:bg-muted/50"
            } transition-colors`}
          >
            <span className="text-sm font-bold text-muted-foreground">{idx + 1}</span>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground flex items-center gap-2">
                {player.name}
                {player.isYou && (
                  <Badge className="bg-primary/15 text-primary border-0 text-[10px]">Você</Badge>
                )}
              </span>
            </div>
            <span className="text-sm font-bold text-center text-foreground">{player.points}</span>
            <span className="text-sm text-center text-muted-foreground">{player.predictions}</span>
            <span className="text-sm text-center text-accent font-medium">{player.exact}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

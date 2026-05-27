"use client"; 

import React, { useEffect, useState } from "react";
import { Trophy, Medal, User, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui-dashboard/badge";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

const medalColors = ["text-yellow-400", "text-gray-300", "text-amber-600"];

export default function Ranking() {
  const supabase = createClient();
  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRanking() {
      // 1. Pega o usuário logado
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);

      // 2. Busca os perfis ordenados pelos pontos
      // Nota: Para ter "Palpites" e "Exatos", precisaríamos de uma query mais complexa,
      // mas vamos listar por pontos conforme sua tabela profiles.
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, total_points, avatar_url")
        .order("total_points", { ascending: false });

      if (data) setRanking(data);
      setLoading(false);
    }
    fetchRanking();
  }, []);

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="w-6 h-6 text-accent" />
        <h1 className="text-2xl font-bold text-foreground">Ranking Geral</h1>
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-4">
        {ranking.slice(0, 3).map((player, idx) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-card rounded-xl border border-border p-5 text-center ${
              idx === 0 ? "ring-1 ring-yellow-400/30" : ""
            }`}
          >
            <Medal className={`w-8 h-8 mx-auto mb-2 ${medalColors[idx]}`} />
            <div className="w-12 h-12 rounded-full bg-muted mx-auto flex items-center justify-center mb-2 overflow-hidden border border-white/5">
              {player.avatar_url ? <img src={player.avatar_url} alt={player.name} className="w-full h-full object-cover object-center" /> : <User className="w-6 h-6 text-muted-foreground" />}
            </div>
            <p className="text-sm font-bold text-foreground truncate">{player.name}</p>
            <p className="text-2xl font-bold text-primary mt-1">{player.total_points}</p>
            <p className="text-xs text-muted-foreground">pontos</p>
          </motion.div>
        ))}
      </div>

      {/* Full ranking table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-[48px_1fr_80px] px-4 py-3 border-b border-border text-xs text-muted-foreground font-medium">
          <span>#</span>
          <span>Jogador</span>
          <span className="text-center">Pontos</span>
        </div>
        {ranking.map((player, idx) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`grid grid-cols-[48px_1fr_80px] px-4 py-3 items-center border-b border-border last:border-0 ${
              player.id === currentUserId ? "bg-primary/5" : "hover:bg-muted/50"
            } transition-colors`}
          >
            <span className="text-sm font-bold text-muted-foreground">{idx + 1}º</span>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                {player.avatar_url ? <img src={player.avatar_url} alt={player.name} className="w-full h-full object-cover object-center" /> : <User className="w-4 h-4 text-muted-foreground" />}
              </div>
              <span className="text-sm font-medium text-foreground flex items-center gap-2">
                {player.name}
                {player.id === currentUserId && (
                  <Badge className="bg-primary/15 text-primary border-0 text-[10px]">Você</Badge>
                )}
              </span>
            </div>
            <span className="text-sm font-bold text-center text-foreground">{player.total_points}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

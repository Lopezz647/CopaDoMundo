"use client";

import React, { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { calculateLivePoints } from "@/lib/score-calculator"; // 💡 Removido o .ts daqui

interface LiveRankingProps {
  user: any;
  predictions: any[];
  liveMatches: any[];
  dbRanking: any[];
}

export default function LiveRanking({ user, predictions, liveMatches, dbRanking }: LiveRankingProps) {
  const supabase = createClient();
  const [predictionsCount, setPredictionsCount] = useState(0);

  // 1. O CORAÇÃO DO CÁLCULO AO VIVO (Roda em memória de forma segura)
  const liveLeaderboard = useMemo(() => {
    // Removemos o dbRanking da trava, agora ele só exige as predictions e os liveMatches
    if (!predictions || !liveMatches) return [];

    const rankingMap: Record<string, { name: string; avatar_url: string; points: number }> = {};
    
    // Se o dbRanking foi passado, popula o mapa inicial
    if (dbRanking) {
      dbRanking.forEach((u) => {
        rankingMap[u.id] = {
          name: u.name || "Usuário",
          avatar_url: u.avatar_url,
          points: u.total_points || 0,
        };
      });
    }

    // Percorre os palpites para somar os pontos virtuais dos jogos ao vivo
    predictions.forEach((p) => {
      const match = liveMatches.find((m) => String(m.id) === String(p.match_id));
      
      if (match && (match.status === "IN_PLAY" || match.status === "FINISHED")) {
        const calculatedPoints = calculateLivePoints(
          p.home_score,
          p.away_score,
          match.score?.fullTime?.home,
          match.score?.fullTime?.away
        );

        // A MÁGICA DA RECONCILIAÇÃO:
        // Subtrai do cálculo ao vivo os pontos que já estão consolidados no banco
        const pointsAlreadySaved = p.points || 0;
        const pointsToAdd = calculatedPoints - pointsAlreadySaved;

        if (!rankingMap[p.user_id]) {
          rankingMap[p.user_id] = { name: "Competidor", avatar_url: "", points: 0 };
        }

        // Soma apenas a diferença!
        rankingMap[p.user_id].points += pointsToAdd;
      }

        // Soma os pontos virtuais
        rankingMap[p.user_id].points += points;
      }
    });

    // Transforma o mapa em uma lista organizada do 1º ao último colocado
    return Object.entries(rankingMap)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.points - a.points);
  }, [dbRanking, predictions, liveMatches]);

  // 2. Busca estatísticas extras (como a contagem de palpites do usuário logado)
  useEffect(() => {
    async function fetchStats() {
      if (!user?.id) return;

      const { count } = await supabase
        .from("predictions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (count !== null) setPredictionsCount(count);
    }

    fetchStats();
  }, [user, supabase]);

  return (
    <div
      className="rounded-xl border border-white/5 p-5 sticky top-6 w-full max-w-md"
      style={{ background: "#181818" }}
    >
      {/* Título do Bloco */}
      <div className="flex items-center gap-2 mb-5">
        <span className="text-[18px]">🏆</span>
        <h2 className="text-[16px] font-bold text-[#e5e2e1]">Ranking ao Vivo</h2>
      </div>

      {/* Lista de Classificação */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
        {liveLeaderboard.map((player, index) => {
          const isCurrentUser = player.id === user?.id;

          return (
            <div
              key={player.id}
              className="flex items-center justify-between px-3 py-3 rounded-xl relative overflow-hidden transition-all"
              style={{
                background: isCurrentUser ? "#111" : "transparent",
                border: isCurrentUser 
                  ? "1px solid rgba(78,222,163,0.3)" 
                  : "1px solid rgba(255,255,255,0.03)",
              }}
            >
              {/* Barra lateral verde destacando o usuário atual */}
              {isCurrentUser && (
                <div 
                  className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl" 
                  style={{ background: "#4edea3" }} 
                />
              )}

              <div className="flex items-center gap-3 ml-2">
                {/* Posição no Ranking */}
                <span className="text-[12px] font-mono text-zinc-500 w-5">
                  {index + 1}º
                </span>

                {/* Avatar do competidor */}
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
                  {player.avatar_url ? (
                    <img src={player.avatar_url} alt={player.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#1e1e1e]">
                      <span className="material-symbols-rounded text-zinc-500 text-[16px]">person</span>
                    </div>
                  )}
                </div>

                {/* Nome e subtexto descritivo */}
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-[#e5e2e1]">
                    {player.name}
                  </span>
                  {isCurrentUser && (
                    <span className="text-[10px] text-[#8a9a8e]">
                      {predictionsCount} palpites enviados
                    </span>
                  )}
                </div>
              </div>

              {/* Placar de Pontos e Badge explicativa */}
              <div className="flex items-center gap-2">
                <span className="text-[18px] font-bold text-[#e5e2e1]">
                  {player.points}
                </span>
                
                {isCurrentUser && (
                  <div
                    className="text-[9px] font-bold text-[#4edea3] px-1.5 py-0.5 rounded uppercase tracking-wider"
                    style={{ background: "rgba(78,222,163,0.15)", border: "1px solid rgba(78,222,163,0.25)" }}
                  >
                    Você
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

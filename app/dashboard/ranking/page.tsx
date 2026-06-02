"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const POINT_VALUES = [10, 7, 5, 3, 0];

function PointBadge({ pts, count }: { pts: number; count: number }) {
  const colors: Record<number, { bg: string; color: string }> = {
    10: { bg: "rgba(78,222,163,0.15)", color: "#4edea3" },
    7:  { bg: "rgba(100,160,255,0.15)", color: "#64a0ff" },
    5:  { bg: "rgba(255,185,95,0.15)", color: "#ffb95f" },
    3:  { bg: "rgba(180,130,255,0.15)", color: "#b482ff" },
    0:  { bg: "rgba(255,100,100,0.12)", color: "#ff6464" },
  };
  const c = colors[pts] || colors[0];
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[11px] font-black" style={{ color: c.color }}>{count}</span>
      <span
        className="text-[9px] font-bold px-1.5 py-0.5 rounded"
        style={{ background: c.bg, color: c.color }}
      >
        {pts}pts
      </span>
    </div>
  );
}

function MedalIcon({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-[16px]">🥇</span>;
  if (rank === 2) return <span className="text-[16px]">🥈</span>;
  if (rank === 3) return <span className="text-[16px]">🥉</span>;
  return <span className="text-[13px] font-bold text-[#8a9a8e]">{rank}</span>;
}

export default function Ranking() {
  const supabase = createClient();
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [selectedPhase, setSelectedPhase] = useState<string | number>("all");
  const [filterPoints, setFilterPoints] = useState<number | null>(null); // null = show all

  // Estados de Dados do Supabase
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allPredictions, setAllPredictions] = useState<any[]>([]);
  const [allMatches, setAllMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega os dados reais do Supabase e da API de futebol
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      const { data: profiles } = await supabase.from("profiles").select("*");
      const { data: preds } = await supabase.from("predictions").select("*");

      try {
        const res = await fetch("/api/futebol/competitions/BSA/matches");
        const matchData = await res.json();
        setAllMatches(matchData.matches || []);
      } catch (error) {
        console.error("Erro ao carregar jogos na API:", error);
      }

      if (profiles) setAllUsers(profiles);
      if (preds) setAllPredictions(preds);
      
      setIsLoading(false);
    }
    loadData();
  }, []);

  // Filtra os jogos por Fase/Rodada (matchday)
  const filteredMatches = useMemo(() => {
    if (selectedPhase === "all") return allMatches;
    return allMatches.filter(m => m.matchday === selectedPhase);
  }, [allMatches, selectedPhase]);

  // Considera apenas os jogos finalizados para calcular os acertos passados
  const finishedMatches = useMemo(() => {
    return filteredMatches.filter(m => m.status === "FINISHED");
  }, [filteredMatches]);

  // Constrói o Ranking cruzando Supabase e API
  const ranked = useMemo(() => {
    return allUsers.map(u => {
      const userPreds = allPredictions.filter(p => p.user_id === u.id);
      const predMap: Record<string, any> = {};
      userPreds.forEach(p => { predMap[p.match_id] = p; });

      const counters: Record<number, number> = { 10: 0, 7: 0, 5: 0, 3: 0, 0: 0 };
      let maxRound = 0;

      // Popula os contadores de acertos baseados nos jogos finalizados
      finishedMatches.forEach(match => {
        const pred = predMap[match.id];
        if (pred && pred.points !== null && pred.points !== undefined) {
          const pts = pred.points;
          if (counters[pts] !== undefined) {
            counters[pts] += 1;
          }
        }
      });

      // Calcula a melhor pontuação em uma única rodada
      const rounds = Array.from(new Set(finishedMatches.map(m => m.matchday).filter(Boolean)));
      rounds.forEach(round => {
        const roundMatches = finishedMatches.filter(m => m.matchday === round);
        let roundPts = 0;
        roundMatches.forEach(match => {
          const pred = predMap[match.id];
          if (pred && pred.points) {
            roundPts += pred.points;
          }
        });
        if (roundPts > maxRound) maxRound = roundPts;
      });

      return {
        ...u,
        totalPoints: u.total_points || 0, // Usa os pontos oficiais do banco
        counters,
        maxRound,
        predCount: userPreds.length,
      };
    }).sort((a, b) => b.totalPoints - a.totalPoints);
  }, [allUsers, allPredictions, finishedMatches]);

  // Filtra as linhas por quem tem uma contagem de pontos específica
  const displayedRanked = useMemo(() => {
    if (filterPoints === null) return ranked;
    return ranked.filter(u => (u.counters[filterPoints] || 0) > 0);
  }, [ranked, filterPoints]);

  // Estatísticas Máximas
  const maxPhasePoints = ranked.length > 0 ? Math.max(...ranked.map(u => u.totalPoints)) : 0;
  const maxRoundPoints = ranked.length > 0 ? Math.max(...ranked.map(u => u.maxRound)) : 0;

  // Extrai as Fases (Rodadas) disponíveis diretamente dos jogos da API
  const phasesInData = useMemo(() => {
    const set = new Set(allMatches.map(m => m.matchday).filter(Boolean));
    return Array.from(set).sort((a, b) => Number(a) - Number(b));
  }, [allMatches]);

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-10 mt-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-[22px]">🏆</span>
        <h1 className="text-[22px] font-bold text-[#e5e2e1]">Ranking Geral</h1>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/5 p-4" style={{ background: "#181818" }}>
          <p className="text-[11px] text-[#8a9a8e] mb-1">Maior pontuação {selectedPhase !== "all" ? "na fase" : "acumulada"}</p>
          <p className="text-[24px] font-black text-[#4edea3]">{maxPhasePoints} <span className="text-[13px] font-normal text-[#8a9a8e]">pts</span></p>
        </div>
        <div className="rounded-xl border border-white/5 p-4" style={{ background: "#181818" }}>
          <p className="text-[11px] text-[#8a9a8e] mb-1">Maior pontuação em uma rodada</p>
          <p className="text-[24px] font-black text-[#ffb95f]">{maxRoundPoints} <span className="text-[13px] font-normal text-[#8a9a8e]">pts</span></p>
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-col gap-3">
        {/* Phase filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-[#8a9a8e] font-semibold mr-1">Fase:</span>
          <button
            onClick={() => setSelectedPhase("all")}
            className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
            style={selectedPhase === "all"
              ? { background: "rgba(78,222,163,0.2)", color: "#4edea3", border: "1px solid rgba(78,222,163,0.4)" }
              : { background: "#1a1a1a", color: "#8a9a8e", border: "1px solid rgba(255,255,255,0.06)" }
            }
          >
            Todas
          </button>
          {phasesInData.map(phase => (
            <button
              key={phase as React.Key}
              onClick={() => setSelectedPhase(phase as string | number)}
              className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
              style={selectedPhase === phase
                ? { background: "rgba(78,222,163,0.2)", color: "#4edea3", border: "1px solid rgba(78,222,163,0.4)" }
                : { background: "#1a1a1a", color: "#8a9a8e", border: "1px solid rgba(255,255,255,0.06)" }
              }
            >
              Rodada {phase}
            </button>
          ))}
        </div>

        {/* Points filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-[#8a9a8e] font-semibold mr-1">Filtrar por acerto:</span>
          <button
            onClick={() => setFilterPoints(null)}
            className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
            style={filterPoints === null
              ? { background: "rgba(255,255,255,0.1)", color: "#e5e2e1", border: "1px solid rgba(255,255,255,0.15)" }
              : { background: "#1a1a1a", color: "#8a9a8e", border: "1px solid rgba(255,255,255,0.06)" }
            }
          >
            Todos
          </button>
          {POINT_VALUES.map(p => {
            const colors: Record<number, any> = {
              10: { active: "rgba(78,222,163,0.2)", color: "#4edea3", border: "rgba(78,222,163,0.4)" },
              7:  { active: "rgba(100,160,255,0.2)", color: "#64a0ff", border: "rgba(100,160,255,0.4)" },
              5:  { active: "rgba(255,185,95,0.2)", color: "#ffb95f", border: "rgba(255,185,95,0.4)" },
              3:  { active: "rgba(180,130,255,0.2)", color: "#b482ff", border: "rgba(180,130,255,0.4)" },
              0:  { active: "rgba(255,100,100,0.15)", color: "#ff6464", border: "rgba(255,100,100,0.35)" },
            };
            const c = colors[p];
            return (
              <button
                key={p}
                onClick={() => setFilterPoints(filterPoints === p ? null : p)}
                className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
                style={filterPoints === p
                  ? { background: c.active, color: c.color, border: `1px solid ${c.border}` }
                  : { background: "#1a1a1a", color: "#8a9a8e", border: "1px solid rgba(255,255,255,0.06)" }
                }
              >
                {p} pts
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/5 overflow-hidden" style={{ background: "#181818" }}>
        {/* Table header */}
        <div
          className="grid px-4 py-3 border-b border-white/5 text-[11px] text-[#8a9a8e] font-semibold uppercase tracking-wider"
          style={{ gridTemplateColumns: "40px 1fr 60px 60px 60px 60px 60px 60px" }}
        >
          <span>#</span>
          <span>Jogador</span>
          <span className="text-center">Pts</span>
          <span className="text-center text-[#4edea3]">10</span>
          <span className="text-center text-[#64a0ff]">7</span>
          <span className="text-center text-[#ffb95f]">5</span>
          <span className="text-center text-[#b482ff]">3</span>
          <span className="text-center text-[#ff6464]">0</span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-[#4edea3]" />
          </div>
        ) : displayedRanked.length === 0 ? (
          <div className="py-10 text-center text-[#8a9a8e] text-[13px]">Nenhum resultado encontrado.</div>
        ) : (
          displayedRanked.map((member, idx) => {
            const isYou = currentUser && member.email === currentUser.email;
            const rank = ranked.findIndex(m => m.email === member.email) + 1;
            return (
              <div
                key={member.id}
                className="grid px-4 py-3 items-center border-b border-white/5 last:border-0 transition-colors hover:bg-white/5"
                style={{
                  gridTemplateColumns: "40px 1fr 60px 60px 60px 60px 60px 60px",
                  background: isYou ? "rgba(78,222,163,0.04)" : "transparent",
                }}
              >
                <div className="flex items-center justify-center">
                  <MedalIcon rank={rank} />
                </div>

                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0"
                    style={{ background: "rgba(78,222,163,0.12)", color: "#4edea3", border: "1px solid rgba(78,222,163,0.2)" }}
                  >
                    {member.full_name?.charAt(0).toUpperCase() || member.email?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-semibold text-[#e5e2e1] truncate">{member.full_name || member.email}</span>
                    {isYou && (
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 mt-0.5 rounded self-start"
                        style={{ background: "rgba(78,222,163,0.15)", color: "#4edea3" }}
                      >
                        VOCÊ
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-[15px] font-black text-[#e5e2e1]">{member.totalPoints}</span>
                </div>

                {POINT_VALUES.map(p => {
                  const colors: Record<number, string> = { 10: "#4edea3", 7: "#64a0ff", 5: "#ffb95f", 3: "#b482ff", 0: "#ff6464" };
                  return (
                    <div key={p} className="text-center">
                      <span
                        className="text-[13px] font-bold"
                        style={{
                          color: colors[p],
                          opacity: (member.counters[p] || 0) === 0 ? 0.3 : 1,
                        }}
                      >
                        {member.counters[p] || 0}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

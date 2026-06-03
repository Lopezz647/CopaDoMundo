"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const POINT_VALUES = [10, 7, 5, 3, 0];

// Fases fixas da Copa do Mundo para garantir o filtro correto (3 Rodadas + Mata-Mata)
const WORLD_CUP_PHASES = [
  { id: "ROUND_1", label: "Rodada 1" },
  { id: "ROUND_2", label: "Rodada 2" },
  { id: "ROUND_3", label: "Rodada 3" },
  { id: "LAST_16", label: "Oitavas" },
  { id: "QUARTER_FINALS", label: "Quartas" },
  { id: "SEMI_FINALS", label: "Semifinal" },
  { id: "FINAL", label: "Final" }
];

function MedalIcon({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-[16px]">🥇</span>;
  if (rank === 2) return <span className="text-[16px]">🥈</span>;
  if (rank === 3) return <span className="text-[16px]">🥉</span>;
  return <span className="text-[13px] font-bold text-[#8a9a8e]">{rank}</span>;
}

export default function Ranking() {
  const supabase = createClient();
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const [filterPoints, setFilterPoints] = useState<number | null>(null);

  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allPredictions, setAllPredictions] = useState<any[]>([]);
  const [allMatches, setAllMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      const { data: profiles, error: errorProfiles } = await supabase.from("profiles").select("*");
      if (errorProfiles) console.error("❌ Erro no Supabase (Profiles):", errorProfiles.message);

      const { data: preds, error: errorPreds } = await supabase.from("predictions").select("*");
      if (errorPreds) console.error("❌ Erro no Supabase (Predictions):", errorPreds.message);

      try {
        const res = await fetch("/api/futebol/competitions/BSA/matches");
        const matchData = await res.json();
        setAllMatches(matchData.matches || []);
      } catch (error) {
        console.error("❌ Erro ao carregar jogos na API:", error);
      }

      if (profiles) setAllUsers(profiles);
      if (preds) setAllPredictions(preds);
      
      setIsLoading(false);
    }
    loadData();
  }, []);

  // 1. Filtra partidas baseando-se na fase selecionada de forma exata
  const filteredMatches = useMemo(() => {
    if (selectedPhase === "all") return allMatches;
    
    // Se for fase de grupos (Rodadas 1, 2 ou 3)
    if (selectedPhase.startsWith("ROUND_")) {
      const roundNum = parseInt(selectedPhase.replace("ROUND_", ""));
      return allMatches.filter(m => m.matchday === roundNum || (m.stage === "GROUP_STAGE" && m.matchday === roundNum));
    }
    
    // Se for mata-mata
    return allMatches.filter(m => m.stage === selectedPhase);
  }, [allMatches, selectedPhase]);

  // Filtra apenas partidas concluídas
  const finishedMatches = useMemo(() => {
    return filteredMatches.filter(m => m.status === "FINISHED");
  }, [filteredMatches]);

  // VERIFICADOR DE FASE CONCLUÍDA (Para o Banner de Premiação)
  const isPhaseFinished = useMemo(() => {
    return filteredMatches.length > 0 && filteredMatches.every(m => m.status === "FINISHED");
  }, [filteredMatches]);

  // 2. CORE: Constrói e Recalcula a classificação dinamicamente
  const ranked = useMemo(() => {
    return allUsers.map(u => {
      const userPreds = allPredictions.filter(p => p.user_id === u.id);
      const predMap: Record<string, any> = {};
      userPreds.forEach(p => { predMap[p.match_id] = p; });

      const counters: Record<number, number> = { 10: 0, 7: 0, 5: 0, 2: 0, 0: 0 };
      let totalPointsCalculated = 0;

      finishedMatches.forEach(match => {
        const pred = predMap[match.id];
        if (pred && pred.points !== null && pred.points !== undefined) {
          const pts = pred.points;
          totalPointsCalculated += pts;
          if (counters[pts] !== undefined) {
            counters[pts] += 1;
          }
        }
      });

      const rounds = Array.from(new Set(filteredMatches.map(m => m.matchday).filter(Boolean)));
      let maxRound = 0;
      rounds.forEach(r => {
        const roundMatches = finishedMatches.filter(m => m.matchday === r);
        let roundPts = 0;
        roundMatches.forEach(match => {
          const pred = predMap[match.id];
          if (pred && pred.points) roundPts += pred.points;
        });
        if (roundPts > maxRound) maxRound = roundPts;
      });

      return {
        ...u,
        totalPoints: selectedPhase === "all" ? (u.total_points || totalPointsCalculated) : totalPointsCalculated,
        counters,
        maxRound,
        predCount: userPreds.length,
      };
    }).sort((a, b) => b.totalPoints - a.totalPoints);
  }, [allUsers, allPredictions, finishedMatches, selectedPhase, filteredMatches]);

  const displayedRanked = useMemo(() => {
    if (filterPoints === null) return ranked;
    return ranked.filter(u => (u.counters[filterPoints] || 0) > 0);
  }, [ranked, filterPoints]);

  const maxPhasePoints = ranked.length > 0 ? Math.max(...ranked.map(u => u.totalPoints)) : 0;
  const maxRoundPoints = ranked.length > 0 ? Math.max(...ranked.map(u => u.maxRound)) : 0;
  const topScorer = ranked.length > 0 && ranked[0].totalPoints > 0 ? ranked[0] : null;

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-10 mt-6">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3">
        <span className="text-[22px]">🏆</span>
        <h1 className="text-[22px] font-bold text-[#e5e2e1]">
          {selectedPhase === "all" ? "Ranking Geral" : "Ranking da Rodada"}
        </h1>
      </div>

      {/* BANNER DE PREMIAÇÃO DA RODADA */}
      {selectedPhase !== "all" && (
        <div className="p-4 rounded-xl border border-white/5 bg-[#111] flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in zoom-in-95">
          <div>
            <h4 className="text-[14px] font-bold text-[#e5e2e1]">
              Status: {WORLD_CUP_PHASES.find(f => f.id === selectedPhase)?.label}
            </h4>
            <p className="text-[12px] text-[#8a9a8e] mt-0.5">
              {isPhaseFinished 
                ? "✅ Partidas encerradas! Resultado oficial da fase." 
                : "⏳ Jogos em andamento ou aguardando início."}
            </p>
          </div>

          {isPhaseFinished && topScorer && (
            <div className="flex items-center gap-3 bg-[#4edea3]/10 border border-[#4edea3]/20 px-4 py-2 rounded-lg">
              <span className="material-symbols-rounded text-[#4edea3] text-[24px]">emoji_events</span>
              <div>
                <span className="text-[10px] text-[#4edea3] font-bold uppercase tracking-wider block">Maior Pontuador</span>
                <span className="text-[14px] font-black text-white">{topScorer.name} <span className="text-[#8a9a8e] font-medium text-[12px]">({topScorer.totalPoints} pts)</span></span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Painel de Estatísticas */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/5 p-4" style={{ background: "#181818" }}>
          <p className="text-[11px] text-[#8a9a8e] mb-1">
            {selectedPhase === "all" ? "Maior pontuação geral acumulada" : "Maior pontuação nesta fase"}
          </p>
          <p className="text-[24px] font-black text-[#4edea3]">
            {maxPhasePoints} <span className="text-[13px] font-normal text-[#8a9a8e]">pts</span>
          </p>
        </div>
        <div className="rounded-xl border border-white/5 p-4" style={{ background: "#181818" }}>
          <p className="text-[11px] text-[#8a9a8e] mb-1">Maior pontuação em um único dia</p>
          <p className="text-[24px] font-black text-[#ffb95f]">
            {maxRoundPoints} <span className="text-[13px] font-normal text-[#8a9a8e]">pts</span>
          </p>
        </div>
      </div>

      {/* Filtros Avançados */}
      <div className="flex flex-col gap-3">
        {/* Filtro por Fase da Competição */}
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
          {WORLD_CUP_PHASES.map(phase => (
            <button
              key={phase.id}
              onClick={() => setSelectedPhase(phase.id)}
              className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
              style={selectedPhase === phase.id
                ? { background: "rgba(78,222,163,0.2)", color: "#4edea3", border: "1px solid rgba(78,222,163,0.4)" }
                : { background: "#1a1a1a", color: "#8a9a8e", border: "1px solid rgba(255,255,255,0.06)" }
              }
            >
              {phase.label}
            </button>
          ))}
        </div>

        {/* Filtro de Linhas por Acerto Específico */}
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

      {/* Tabela do Ranking Reordenável */}
      <div className="rounded-xl border border-white/5 overflow-hidden" style={{ background: "#181818" }}>
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
          <span className="text-center text-[#b482ff]">2</span>
          <span className="text-center text-[#ff6464]">0</span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-[#4edea3]" />
          </div>
        ) : displayedRanked.length === 0 ? (
          <div className="py-10 text-center text-[#8a9a8e] text-[13px]">Nenhum resultado encontrado para o filtro atual.</div>
        ) : (
          displayedRanked.map((member, idx) => {
            const isYou = currentUser && member.id === currentUser.id;
            const rank = ranked.findIndex(m => m.id === member.id) + 1;
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
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0 overflow-hidden"
                    style={{ background: "rgba(78,222,163,0.12)", color: "#4edea3", border: "1px solid rgba(78,222,163,0.2)" }}
                  >
                    {member.avatar_url ? (
                      <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      member.name?.charAt(0).toUpperCase() || "?"
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-semibold text-[#e5e2e1] truncate">{member.name || "Membro"}</span>
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

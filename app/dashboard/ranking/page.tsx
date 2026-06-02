"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const POINT_VALUES = [10, 7, 5, 3, 0];

// Mapeamento amigável de estágios/fases vindos de APIs internacionais (ex: football-data)
const STAGE_MAP: Record<string, string> = {
  "GROUP_STAGE": "Fase de Grupos",
  "LAST_64": "64 Avos",
  "LAST_32": "32 Avos",
  "LAST_16": "Oitavas",
  "QUARTER_FINALS": "Quartas",
  "SEMI_FINALS": "Semifinal",
  "THIRD_PLACE": "3° Lugar",
  "FINAL": "Final"
};

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

  // Estados de Dados
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allPredictions, setAllPredictions] = useState<any[]>([]);
  const [allMatches, setAllMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      // BUSCA OS MEMBROS (Com log de erro)
      const { data: profiles, error: errorProfiles } = await supabase.from("profiles").select("*");
      if (errorProfiles) console.error("❌ Erro no Supabase (Profiles):", errorProfiles.message);
      console.log("✅ Membros puxados do banco:", profiles);

      // BUSCA OS PALPITES (Com log de erro)
      const { data: preds, error: errorPreds } = await supabase.from("predictions").select("*");
      if (errorPreds) console.error("❌ Erro no Supabase (Predictions):", errorPreds.message);
      console.log("✅ Palpites puxados do banco:", preds);

      // BUSCA OS JOGOS NA API
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

  // 1. Descobre todas as fases/etapas disponíveis nas partidas
  const phasesInData = useMemo(() => {
    const phasesSet = new Set<string>();
    allMatches.forEach(m => {
      if (m.stage) phasesSet.add(m.stage);
      else if (m.matchday) phasesSet.add(`Rodada ${m.matchday}`);
    });
    return Array.from(phasesSet).sort((a, b) => {
      // Ordenação simples colocando Fase de Grupos / Rodadas menores primeiro
      if (a.includes("GROUP") || a.includes("Rodada")) return -1;
      if (b.includes("GROUP") || b.includes("Rodada")) return 1;
      return 0;
    });
  }, [allMatches]);

  // 2. Filtra partidas baseando-se na fase selecionada
  const filteredMatches = useMemo(() => {
    if (selectedPhase === "all") return allMatches;
    return allMatches.filter(m => m.stage === selectedPhase || `Rodada ${m.matchday}` === selectedPhase);
  }, [allMatches, selectedPhase]);

  // Filtra apenas partidas concluídas para fins estatísticos de acerto
  const finishedMatches = useMemo(() => {
    return filteredMatches.filter(m => m.status === "FINISHED");
  }, [filteredMatches]);

  // 3. CORE: Constrói e Recalcula a classificação dinamicamente
  const ranked = useMemo(() => {
    return allUsers.map(u => {
      const userPreds = allPredictions.filter(p => p.user_id === u.id);
      const predMap: Record<string, any> = {};
      userPreds.forEach(p => { predMap[p.match_id] = p; });

      const counters: Record<number, number> = { 10: 0, 7: 0, 5: 0, 3: 0, 0: 0 };
      let totalPointsCalculated = 0;

      // Calcula os pontos baseando-se estritamente nas partidas da fase selecionada
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

      // Calcula a maior pontuação obtida em uma única rodada/sub-etapa dentro do escopo filtrado
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
        // Se a fase for "Todas", exibe o total global acumulado, caso contrário exibe o recalculado da fase
        totalPoints: selectedPhase === "all" ? (u.total_points || totalPointsCalculated) : totalPointsCalculated,
        counters,
        maxRound,
        predCount: userPreds.length,
      };
    }).sort((a, b) => b.totalPoints - a.totalPoints); // Reclassifica do 1° ao último colocado
  }, [allUsers, allPredictions, finishedMatches, selectedPhase, filteredMatches]);

  // Filtro avançado por acertos específicos de pontuação (10, 7, 5, etc)
  const displayedRanked = useMemo(() => {
    if (filterPoints === null) return ranked;
    return ranked.filter(u => (u.counters[filterPoints] || 0) > 0);
  }, [ranked, filterPoints]);

  // Estatísticas Máximas Dinâmicas
  const maxPhasePoints = ranked.length > 0 ? Math.max(...ranked.map(u => u.totalPoints)) : 0;
  const maxRoundPoints = ranked.length > 0 ? Math.max(...ranked.map(u => u.maxRound)) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-10 mt-6">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3">
        <span className="text-[22px]">🏆</span>
        <h1 className="text-[22px] font-bold text-[#e5e2e1]">Ranking Geral</h1>
      </div>

      {/* Painel de Estatísticas Máximas Dinâmicas */}
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
          <p className="text-[11px] text-[#8a9a8e] mb-1">Maior pontuação em uma rodada</p>
          <p className="text-[24px] font-black text-[#ffb95f]">
            {maxRoundPoints} <span className="text-[13px] font-normal text-[#8a9a8e]">pts</span>
          </p>
        </div>
      </div>

      {/* Seletores e Filtros Avançados */}
      <div className="flex flex-col gap-3">
        {/* Filtro por Fase / Rodada da Competição */}
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
              key={phase}
              onClick={() => setSelectedPhase(phase)}
              className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
              style={selectedPhase === phase
                ? { background: "rgba(78,222,163,0.2)", color: "#4edea3", border: "1px solid rgba(78,222,163,0.4)" }
                : { background: "#1a1a1a", color: "#8a9a8e", border: "1px solid rgba(255,255,255,0.06)" }
              }
            >
              {STAGE_MAP[phase] || phase}
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
          <span className="text-center text-[#b482ff]">3</span>
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

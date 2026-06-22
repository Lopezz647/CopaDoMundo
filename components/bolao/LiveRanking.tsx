"use client";

import React, { useMemo, useState } from "react";
import { traduzirTime } from "@/lib/utils";

// ==========================================
// AVALIADOR DE PONTOS (Regras Oficiais)
// ==========================================
function getMatchPoints(officialHome: number, officialAway: number, predHome: number, predAway: number) {
  if (officialHome === predHome && officialAway === predAway) {
    return { pts: 10, text: "Placar exato" };
  }

  const isOfficialWinnerHome = officialHome > officialAway;
  const isOfficialWinnerAway = officialHome < officialAway;
  const isOfficialDraw = officialHome === officialAway;

  const isPredWinnerHome = predHome > predAway;
  const isPredWinnerAway = predHome < predAway;
  const isPredDraw = predHome === predAway;

  const isWinnerCorrect = 
    (isOfficialWinnerHome && isPredWinnerHome) || 
    (isOfficialWinnerAway && isPredWinnerAway);

  if (isWinnerCorrect && (officialHome === predHome || officialAway === predAway)) {
    return { pts: 7, text: "Vencedor + 1 placar" };
  }

  if (isWinnerCorrect || (isOfficialDraw && isPredDraw)) {
    return { pts: 5, text: "Apenas vencedor/empate" };
  }

  if (officialHome === predHome || officialAway === predAway) {
    return { pts: 2, text: "Acertou 1 placar" };
  }

  return { pts: 0, text: "Errou totalmente" };
}

// ==========================================
// COMPONENTE VISUAL: BADGE DE PONTOS
// ==========================================
function PointsBadge({ points }: { points: number }) {
  const colors: Record<number, { bg: string; color: string; border: string }> = {
    10: { bg: "rgba(78,222,163,0.18)", color: "#4edea3", border: "rgba(78,222,163,0.35)" },
    7:  { bg: "rgba(100,160,255,0.18)", color: "#64a0ff", border: "rgba(100,160,255,0.35)" },
    5:  { bg: "rgba(255,185,95,0.18)", color: "#ffb95f", border: "rgba(255,185,95,0.35)" },
    3:  { bg: "rgba(180,130,255,0.18)", color: "#b482ff", border: "rgba(180,130,255,0.35)" },
    0:  { bg: "rgba(255,100,100,0.12)", color: "#ff6464", border: "rgba(255,100,100,0.25)" },
  };
  const c = colors[points] || colors[0];
  return (
    <span
      className="text-[11px] font-black px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-sm flex items-center justify-center min-w-[48px]"
      style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}
    >
      {points !== null ? `${points} pts` : "—"}
    </span>
  );
}

// ==========================================
// TIPAGENS COMPARTILHADAS
// ==========================================
interface User {
  id: string;
  email?: string;
  name?: string;
  full_name?: string;
  avatar_url?: string;
  total_points?: number;
}

interface MatchTeam {
  name: string;
  crest?: string;
}

interface MatchScore {
  fullTime?: { home: number | null; away: number | null };
  regularTime?: { home: number | null; away: number | null };
}

interface Match {
  id: string | number;
  utcDate?: string;
  date?: string;
  match_date?: string;
  status?: string;
  score?: MatchScore;
  homeTeam?: MatchTeam;
  awayTeam?: MatchTeam;
  home_team?: string;
  away_team?: string;
  home_flag?: string;
  away_flag?: string;
}

interface Prediction {
  id?: string;
  user_id: string;
  match_id: string | number;
  home_score: number | null;
  away_score: number | null;
  points?: number;
}

// ==========================================
// COMPONENTE DO MODAL: DETALHES DO MEMBRO
// ==========================================
interface MemberDetailModalProps {
  member: User & { points?: number };
  matches: Match[];
  predictions: Prediction[];
  onClose: () => void;
  currentUser: User | null;
  selectedDate: Date; // 1. A DATA DO CALENDÁRIO CHEGA AQUI
}

interface MatchDetailItem {
  match: Match;
  pred: Prediction | undefined;
  scored: { pts: number; text: string } | null;
  hasOfficialScore: boolean;
  officialHome: number | null;
  officialAway: number | null;
  showPrediction: boolean;
}

function MemberDetailModal({ member, matches, predictions, onClose, currentUser, selectedDate }: MemberDetailModalProps) {
  const memberPredictions = predictions.filter((p) => p.user_id === member.id);
  const predMap: Record<string, Prediction> = {};
  memberPredictions.forEach((p) => { predMap[String(p.match_id)] = p; });

  const totals: Record<number, number> = { 10: 0, 7: 0, 5: 0, 3: 0, 0: 0 };
  let totalPoints = 0;

  // CORREÇÃO DO BUG DA MEIA-NOITE: Filtrar com base no calendário (selectedDate) e não no relógio do PC
  const selectedStr = selectedDate.toDateString();
  const dayMatches = matches.filter((m) => {
    const matchDate = m.utcDate || m.date || m.match_date;
    if (!matchDate) return false;
    return new Date(matchDate).toDateString() === selectedStr;
  });

  const matchDetails: MatchDetailItem[] = dayMatches.map((match) => {
    const pred = predMap[String(match.id)];
    let scored = null;
    
    const officialHome = match.score?.regularTime?.home ?? match.score?.fullTime?.home ?? null;
    const officialAway = match.score?.regularTime?.away ?? match.score?.fullTime?.away ?? null;
    const hasOfficialScore = officialHome != null && officialAway != null;
    
    if (hasOfficialScore && pred && pred.home_score != null && pred.away_score != null) {
      scored = getMatchPoints(officialHome, officialAway, pred.home_score, pred.away_score);
      totals[scored.pts] += 1;
      totalPoints += scored.pts;
    }

    const status = match.status?.toUpperCase() || "TIMED";
    const isMatchStarted = ["IN_PLAY", "PAUSED", "LIVE", "HT", "1H", "2H", "ET", "PEN", "FINISHED"].includes(status);
    const showPrediction = isMatchStarted || currentUser?.id === member.id;

    return { match, pred, scored, hasOfficialScore, officialHome, officialAway, showPrediction };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div
        className="relative w-full max-w-lg rounded-2xl border border-white/10 overflow-hidden z-10 shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200"
        style={{ background: "#181818" }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-bold overflow-hidden"
              style={{ background: "rgba(78,222,163,0.15)", color: "#4edea3", border: "1px solid rgba(78,222,163,0.25)" }}
            >
              {member.avatar_url ? (
                <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                member.name?.charAt(0).toUpperCase() || "?"
              )}
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#e5e2e1]">{member.name}</h3>
              <span className="text-[11px] text-[#8a9a8e] font-medium">
                Detalhes das partidas de {selectedDate.toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit' })}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-[#8a9a8e] bg-white/5 hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center transition-colors">
            <span className="material-symbols-rounded text-[20px]">close</span>
          </button>
        </div>

        <div className="flex items-center gap-3 px-5 py-3 border-b border-white/5 flex-wrap shrink-0" style={{ background: "#111" }}>
          <div className="flex items-center gap-2 mr-2">
            <span className="text-[24px] font-black text-[#4edea3] leading-none">{totalPoints}</span>
            <span className="text-[10px] text-[#8a9a8e] leading-tight font-bold uppercase tracking-wide">Pts<br/>Ganhos</span>
          </div>
          <div className="h-7 w-px bg-white/10" />
          <div className="flex flex-1 items-center justify-end gap-2 flex-wrap">
            {[10, 7, 5, 3, 0].map(p => (
              totals[p] > 0 ? (
                <div key={p} className="flex items-center gap-1 bg-white/5 rounded-full px-2 py-0.5 border border-white/5">
                  <span className="text-[11px] font-black" style={{ color: ({ 10: "#4edea3", 7: "#64a0ff", 5: "#ffb95f", 3: "#b482ff", 0: "#ff6464" } as Record<number, string>)[p] }}>{p}pts</span>
                  <span className="text-[10px] text-[#8a9a8e] font-bold">×{totals[p]}</span>
                </div>
              ) : null
            ))}
          </div>
        </div>

       <div className="overflow-y-auto divide-y divide-white/5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20 transition-colors">
          {matchDetails.length === 0 ? (
            <div className="py-12 text-center text-[#8a9a8e] text-[13px]">Nenhum jogo disponível para esta data.</div>
          ) : (
            matchDetails.map((item: MatchDetailItem, idx: number) => {
              const { match, pred, scored, hasOfficialScore, officialHome, officialAway, showPrediction } = item;
              
              return (
                <div key={idx} className="px-5 py-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-[13px] font-semibold text-[#e5e2e1] flex-1">
                      <span className="text-[18px]">{match.home_flag?.startsWith("http") ? <img src={match.home_flag} className="w-5 h-5 object-contain" /> : (match.home_flag || "🏳️")}</span>
                      <span className="truncate">{traduzirTime(match.homeTeam?.name || match.home_team || "Mandante")}</span>
                    </div>
                    
                    <div className="flex items-center justify-center min-w-[70px] bg-black/40 px-3 py-1 rounded-lg border border-white/5">
                      {hasOfficialScore ? (
                        <span className="text-[15px] font-black text-white">
                          {officialHome} <span className="text-[#8a9a8e] text-[12px] font-medium mx-1">x</span> {officialAway}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-[#8a9a8e] uppercase tracking-wider">Aguardando</span>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-2 text-[13px] font-semibold text-[#e5e2e1] flex-1">
                      <span className="truncate text-right">{traduzirTime(match.awayTeam?.name || match.away_team || "Visitante")}</span>
                      <span className="text-[18px]">{match.away_flag?.startsWith("http") ? <img src={match.away_flag} className="w-5 h-5 object-contain" /> : (match.away_flag || "🏳️")}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 bg-black/20 p-2.5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#8a9a8e] uppercase tracking-wider">Palpite:</span>
                      {pred && pred.home_score != null && pred.away_score != null ? (
                        showPrediction ? (
                          <span className="text-[13px] font-bold text-[#e5e2e1] bg-[#111] px-2 py-0.5 rounded border border-white/10">
                            {pred.home_score} x {pred.away_score}
                          </span>
                        ) : (
                          <div className="flex items-center gap-1 bg-[#4edea3]/10 px-2 py-0.5 rounded border border-[#4edea3]/20">
                            <span className="material-symbols-rounded text-[12px] text-[#4edea3]">lock</span>
                            <span className="text-[10px] font-bold text-[#4edea3] uppercase tracking-wider">Oculto</span>
                          </div>
                        )
                      ) : (
                        <span className="text-[10px] font-semibold text-[#ff6464] bg-[#ff6464]/10 px-2 py-0.5 rounded border border-[#ff6464]/20">Sem palpite</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {scored ? (
                        <>
                          <span className="text-[10px] font-semibold text-[#8a9a8e] text-right leading-tight tracking-wide hidden sm:block truncate max-w-[150px]">
                            {scored.text}
                          </span>
                          <PointsBadge points={scored.pts} />
                        </>
                      ) : (
                        <span className="text-[11px] font-medium text-[#8a9a8e] italic">—</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENTE PRINCIPAL: RANKING AO VIVO
// ==========================================
interface LiveRankingProps {
  user: User;
  predictions: Prediction[];
  liveMatches: Match[];
  dbRanking: User[];
  selectedDate: Date; // 2. RECEBE A DATA DO PAI
}

export default function LiveRanking({ user, predictions, liveMatches, dbRanking, selectedDate }: LiveRankingProps) {
  const [selectedMember, setSelectedMember] = useState<(User & { points?: number }) | null>(null);

  const liveLeaderboard = useMemo(() => {
    if (!predictions || !liveMatches || !selectedDate) return [];

    const rankingMap: Record<string, User & { points: number }> = {};

    // 1. A SUA LÓGICA MANTIDA: Usa o DB como base confiável
    if (dbRanking) {
      dbRanking.forEach((u) => {
        rankingMap[u.id] = {
          id: u.id,
          name: u.full_name || u.name || "Competidor",
          avatar_url: u.avatar_url,
          points: u.total_points || 0,
        };
      });
    }

    const selDateMs = new Date(selectedDate.toDateString()).getTime();

    // 2. A MÁGICA: Ajuste Temporal (Viagem no tempo) + Cálculo Ao Vivo
    predictions.forEach((p) => {
      const match = liveMatches.find((m) => String(m.id) === String(p.match_id));
      if (!match) return;

      const matchDateStr = match.utcDate || match.date || match.match_date;
      if (!matchDateStr) return;

      const matchDateMs = new Date(new Date(matchDateStr).toDateString()).getTime();

      if (!rankingMap[p.user_id]) {
        rankingMap[p.user_id] = { id: p.user_id, name: "Competidor", avatar_url: "", points: 0 };
      }

      // REGRA DE VIAGEM NO TEMPO: 
      // Se o jogo aconteceu DEPOIS da data que você selecionou no calendário,
      // nós SUBTRAÍMOS os pontos dele do seu Total, para você ver o ranking como ele era no passado.
      if (matchDateMs > selDateMs) {
        const pointsAlreadySaved = p.points || 0;
        rankingMap[p.user_id].points -= pointsAlreadySaved;
      }
      // A SUA LÓGICA DE DELTA: 
      // Se o jogo pertence ao dia selecionado (ou antes) e está rolando, aplicamos o Delta do ao vivo.
      else if (match.status === "IN_PLAY" || match.status === "FINISHED" || match.status === "PAUSED") {
        const officialHome = match.score?.regularTime?.home ?? match.score?.fullTime?.home ?? null;
        const officialAway = match.score?.regularTime?.away ?? match.score?.fullTime?.away ?? null;

        let calculatedPoints = 0;
        if (officialHome != null && officialAway != null && p.home_score != null && p.away_score != null) {
          const scored = getMatchPoints(officialHome, officialAway, p.home_score, p.away_score);
          calculatedPoints = scored.pts;
        }

        const pointsAlreadySaved = p.points || 0;
        const pointsToAdd = calculatedPoints - pointsAlreadySaved;

        rankingMap[p.user_id].points += pointsToAdd;
      }
    });

    // 3. Ordena do 1º colocado ao último
    return Object.values(rankingMap).sort((a, b) => b.points - a.points);
  }, [dbRanking, predictions, liveMatches, selectedDate]);

  return (
    <>
      <div className="bg-[#181818] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-rounded text-[#4edea3]">leaderboard</span>
            <h3 className="font-bold text-[#e5e2e1] text-sm">Ranking Ao Vivo</h3>
          </div>
          <span className="text-[10px] text-[#8a9a8e] bg-white/5 px-2 py-0.5 rounded border border-white/5 hidden sm:block">Clique para detalhes</span>
        </div>
        
<div className="p-2 flex flex-col gap-1 max-h-[500px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20 transition-colors">          {liveLeaderboard.length === 0 ? (
            <p className="text-[#8a9a8e] text-xs text-center py-6">Nenhum ranking disponível.</p>
          ) : (
            liveLeaderboard.map((member, index) => (
              <div 
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors border border-transparent hover:bg-white/5 hover:border-white/5 group ${member.id === user.id ? 'bg-[#4edea3]/5 border-[#4edea3]/10' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[#8a9a8e] font-bold text-[13px] w-5 text-center group-hover:text-[#4edea3] transition-colors">{index + 1}º</span>
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {member.avatar_url ? (
                      <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[#4edea3] font-bold text-[12px]">{member.name?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[#e5e2e1] text-[13px] font-semibold truncate max-w-[120px]">{member.name}</span>
                    {member.id === user.id && <span className="text-[9px] text-[#4edea3] font-bold">VOCÊ</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#4edea3] font-black text-[15px]">{member.points}</span>
                  <span className="material-symbols-rounded text-[14px] text-white/20 group-hover:text-white/50 transition-colors">chevron_right</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedMember && (
        <MemberDetailModal 
          member={selectedMember} 
          currentUser={user}
          matches={liveMatches} 
          predictions={predictions} 
          onClose={() => setSelectedMember(null)} 
          selectedDate={selectedDate} // 3. A DATA SEGUE PARA O MODAL
        />
      )}
    </>
  );
}

"use client";

import React, { useMemo, useState } from "react";

// ==========================================
// AVALIADOR DE PONTOS (Regras Oficiais)
// ==========================================
function getMatchPoints(officialHome: number, officialAway: number, predHome: number, predAway: number) {
  // 1. Acertou Placar Exato (10 pts)
  if (officialHome === predHome && officialAway === predAway) {
    return { pts: 10, text: "Acertou placar exato" };
  }

  const offDiff = officialHome - officialAway;
  const pDiff = predHome - predAway;
  const offWin = offDiff > 0 ? "home" : offDiff < 0 ? "away" : "draw";
  const pWin = pDiff > 0 ? "home" : pDiff < 0 ? "away" : "draw";

  // Acertou a tendência (Vitória de um deles ou Empate)
  if (offWin === pWin) {
    if (offWin === "draw") {
      // 2. Acertou que era Empate, mas errou o placar (3 pts)
      return { pts: 3, text: "Acertou apenas empate" };
    } else if (offDiff === pDiff) {
      // 3. Acertou o Vencedor e a Diferença exata de gols (7 pts)
      return { pts: 7, text: "Acertou vencedor e diferença de gols" };
    } else {
      // 4. Acertou apenas o Vencedor (5 pts)
      return { pts: 5, text: "Acertou apenas vencedor" };
    }
  }

  // 5. Errou Totalmente (0 pts)
  return { pts: 0, text: "Errou totalmente" };
}

// ==========================================
// COMPONENTE VISUAL: BADGE DE PONTOS
// ==========================================
function PointsBadge({ points }: { points: number }) {
  const colors: Record<number, any> = {
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
// COMPONENTE DO MODAL: DETALHES DO MEMBRO
// ==========================================
function MemberDetailModal({ member, matches, predictions, onClose }: any) {
  const memberPredictions = predictions.filter((p: any) => p.user_id === member.id);
  const predMap: Record<string, any> = {};
  memberPredictions.forEach((p: any) => { predMap[p.match_id] = p; });

  const totals: Record<number, number> = { 10: 0, 7: 0, 5: 0, 3: 0, 0: 0 };
  let totalPoints = 0;

  // Processa todos os jogos do dia atual
  const matchDetails = matches.map((match: any) => {
    const pred = predMap[match.id];
    let scored = null;
    
    const officialHome = match.score?.fullTime?.home ?? match.score?.regularTime?.home;
    const officialAway = match.score?.fullTime?.away ?? match.score?.regularTime?.away;
    const hasOfficialScore = officialHome != null && officialAway != null;
    
    // Se o jogo tem placar e o usuário palpitou, calcula a regra!
    if (hasOfficialScore && pred && pred.home_score != null && pred.away_score != null) {
      scored = getMatchPoints(officialHome, officialAway, pred.home_score, pred.away_score);
      totals[scored.pts] += 1;
      totalPoints += scored.pts;
    }

    return { match, pred, scored, hasOfficialScore, officialHome, officialAway };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fundo Escuro Blur (Fecha ao clicar fora) */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div
        className="relative w-full max-w-lg rounded-2xl border border-white/10 overflow-hidden z-10 shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200"
        style={{ background: "#181818" }}
      >
        {/* Cabeçalho do Modal */}
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
              <span className="text-[11px] text-[#8a9a8e] font-medium">Detalhes das partidas do dia</span>
            </div>
          </div>
          <button onClick={onClose} className="text-[#8a9a8e] bg-white/5 hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center transition-colors">
            <span className="material-symbols-rounded text-[20px]">close</span>
          </button>
        </div>

        {/* Barra de Resumo (Totais) */}
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
                  <span className="text-[11px] font-black" style={{ color: { 10: "#4edea3", 7: "#64a0ff", 5: "#ffb95f", 3: "#b482ff", 0: "#ff6464" }[p] }}>{p}pts</span>
                  <span className="text-[10px] text-[#8a9a8e] font-bold">×{totals[p]}</span>
                </div>
              ) : null
            ))}
          </div>
        </div>

        {/* Lista de Partidas do Dia */}
        <div className="overflow-y-auto divide-y divide-white/5 custom-scrollbar">
          {matchDetails.length === 0 ? (
            <div className="py-12 text-center text-[#8a9a8e] text-[13px]">Nenhum jogo disponível nesta data.</div>
          ) : (
            matchDetails.map(({ match, pred, scored, hasOfficialScore, officialHome, officialAway }, idx) => (
              <div key={idx} className="px-5 py-4 hover:bg-white/5 transition-colors">
                
                {/* Linha dos Times vs Placar Oficial */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-[13px] font-semibold text-[#e5e2e1] flex-1">
                    <span className="text-[18px]">{match.home_flag?.startsWith("http") ? <img src={match.home_flag} className="w-5 h-5 object-contain" /> : (match.home_flag || "🏳️")}</span>
                    <span className="truncate">{match.homeTeam?.name || match.home_team || "Mandante"}</span>
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
                    <span className="truncate text-right">{match.awayTeam?.name || match.away_team || "Visitante"}</span>
                    <span className="text-[18px]">{match.away_flag?.startsWith("http") ? <img src={match.away_flag} className="w-5 h-5 object-contain" /> : (match.away_flag || "🏳️")}</span>
                  </div>
                </div>

                {/* Linha do Palpite e Avaliação */}
                <div className="flex items-center justify-between mt-2 bg-black/20 p-2.5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#8a9a8e] uppercase tracking-wider">Palpite:</span>
                    {pred && pred.home_score != null && pred.away_score != null ? (
                      <span className="text-[13px] font-bold text-[#e5e2e1] bg-[#111] px-2 py-0.5 rounded border border-white/10">
                        {pred.home_score} x {pred.away_score}
                      </span>
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENTE PRINCIPAL: RANKING AO VIVO
// ==========================================
export default function LiveRanking({ user, predictions, liveMatches, dbRanking }: any) {
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const liveLeaderboard = useMemo(() => {
    if (!predictions || !liveMatches) return [];

    const rankingMap: Record<string, any> = {};

    // 1. Preenche o ranking inicial com os dados consolidados do Supabase
    if (dbRanking) {
      dbRanking.forEach((u: any) => {
        rankingMap[u.id] = {
          id: u.id,
          name: u.full_name || u.name || "Competidor",
          avatar_url: u.avatar_url,
          points: u.total_points || 0,
        };
      });
    }

    // 2. Calcula pontos em tempo real dos jogos exibidos na tela
    predictions.forEach((p: any) => {
      const match = liveMatches.find((m: any) => String(m.id) === String(p.match_id));

      if (match && (match.status === "IN_PLAY" || match.status === "FINISHED" || match.status === "PAUSED")) {
        const officialHome = match.score?.fullTime?.home ?? match.score?.regularTime?.home;
        const officialAway = match.score?.fullTime?.away ?? match.score?.regularTime?.away;
        
        let calculatedPoints = 0;
        if (officialHome != null && officialAway != null && p.home_score != null && p.away_score != null) {
          const scored = getMatchPoints(officialHome, officialAway, p.home_score, p.away_score);
          calculatedPoints = scored.pts;
        }

        // Subtrai os pontos já processados pelo banco (se houver) para evitar soma dupla
        const pointsAlreadySaved = p.points || 0;
        const pointsToAdd = calculatedPoints - pointsAlreadySaved;

        if (!rankingMap[p.user_id]) {
          rankingMap[p.user_id] = { id: p.user_id, name: "Competidor", avatar_url: "", points: 0 };
        }

        rankingMap[p.user_id].points += pointsToAdd;
      }
    });

    // 3. Ordena do 1º colocado ao último
    return Object.values(rankingMap).sort((a: any, b: any) => b.points - a.points);
  }, [dbRanking, predictions, liveMatches]);

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
        
        <div className="p-2 flex flex-col gap-1 max-h-[500px] overflow-y-auto custom-scrollbar">
          {liveLeaderboard.length === 0 ? (
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

      {/* Renderiza o Modal se houver um membro selecionado */}
      {selectedMember && (
        <MemberDetailModal 
          member={selectedMember} 
          matches={liveMatches} 
          predictions={predictions} 
          onClose={() => setSelectedMember(null)} 
        />
      )}
    </>
  );
}

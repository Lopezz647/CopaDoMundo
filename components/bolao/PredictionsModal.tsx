import React, { useState, useEffect } from "react";
import { X, User, Clock, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function PredictionsModal({ isOpen, onClose, match }: any) {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState("palpites");
  const [loading, setLoading] = useState(true);
  
  const [allMembers, setAllMembers] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  // ==========================================
  // STATUS DA PARTIDA E PLACAR OFICIAL
  // ==========================================
  const status = match?.status?.toUpperCase() || "TIMED";
  const isMatchStarted = ["IN_PLAY", "PAUSED", "LIVE", "HT", "1H", "2H", "ET", "PEN", "FINISHED"].includes(status);
  
  const officialHome = match?.score?.fullTime?.home ?? match?.score?.regularTime?.home;
  const officialAway = match?.score?.fullTime?.away ?? match?.score?.regularTime?.away;
  const hasOfficialScore = officialHome != null && officialAway != null;

  useEffect(() => {
    if (!isOpen) return;

   async function fetchRealData() {
      setLoading(true);
      
      try {
        const { data: { user } } = await supabase.auth.getUser();

        // 1. Busca os palpites e junta com os dados de Perfil (Nome e Avatar)
        const { data: predictionsData } = await supabase
          .from("predictions")
          .select(`
            *,
            profiles ( name, avatar_url )
          `)
          .eq("match_id", match.id); 

        // 2. Busca o histórico de alterações (apenas do usuário logado)
        let historyData: any[] = [];
        if (user) {
          const { data: hist } = await supabase
            .from("prediction_history")
            .select("*")
            .eq("match_id", match.id)
            .eq("user_id", user.id)
            .order("changed_at", { ascending: false });
            
          if (hist) historyData = hist;
        }

       // 3. Formata os membros para exibição
        const membersList = (predictionsData || []).map(p => {
          const hScore = p.home_score ?? p.homeScore ?? p.score_home ?? p.home_goals;
          const aScore = p.away_score ?? p.awayScore ?? p.score_away ?? p.away_goals;

          const hasValidScore = hScore != null && hScore !== "" && aScore != null && aScore !== "";

          return {
            id: p.user_id,
            name: p.user_id === user?.id ? "Você" : (p.profiles?.name || "Usuário"),
            avatar: p.profiles?.avatar_url,
            isMe: p.user_id === user?.id,
            prediction: hasValidScore ? { home_score: hScore, away_score: aScore } : null
          };
        });

        // 4. Se o próprio usuário logado não estiver na lista de quem palpitou, adiciona ele
        if (user && !membersList.find(m => m.id === user.id)) {
          const { data: myProfile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
          
          membersList.unshift({
            id: user.id,
            name: "Você",
            avatar: myProfile?.avatar_url,
            isMe: true,
            prediction: null
          });
        }

        // Move "Você" sempre para o topo
        membersList.sort((a, b) => (a.isMe ? -1 : b.isMe ? 1 : 0));

        setAllMembers(membersList);
        setHistory(historyData);
      } catch (error) {
        console.error("Erro ao carregar dados do modal:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRealData();
  }, [isOpen, match.id]);

  if (!isOpen) return null;

  const totalPalpites = allMembers.filter(m => m.prediction !== null).length;
  const membros = allMembers.length;

  const renderFlag = (flag: string) => {
    return flag?.startsWith("http") ? (
      <img src={flag} alt="flag" className="h-8 object-contain" />
    ) : (
      <span className="text-3xl">{flag || "🏳️"}</span>
    );
  };

  const renderUserCard = (user: any) => {
    const hasPredicted = user.prediction !== null;
    
    // REGRA DE VISIBILIDADE: Mostra se for você OU se o jogo já começou
    const showPrediction = user.isMe || isMatchStarted;

    return (
      <div 
        key={user.id} 
        className="flex items-center justify-between p-3 rounded-xl border"
        style={{ 
          background: "#121212", 
          borderColor: user.isMe ? "rgba(78,222,163,0.3)" : "rgba(255,255,255,0.05)" 
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1e1e1e] flex items-center justify-center border border-white/5 relative overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-[#8a9a8e]" />
            )}
            
            {user.isMe && (
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#ffb95f] rounded-full border-2 border-[#121212] flex items-center justify-center z-10">
                <span className="material-symbols-rounded text-[8px] text-black" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#e5e2e1] text-[14px]">{user.name}</span>
              {user.isMe && (
                <span className="text-[10px] font-bold text-[#121212] bg-[#4edea3] px-1.5 py-0.5 rounded-sm">
                  Você
                </span>
              )}
            </div>
            <span className="text-[12px] font-medium" style={{ color: hasPredicted ? "#4edea3" : "#ffb95f" }}>
              {hasPredicted ? "Já palpitou" : "Não palpitou"}
            </span>
          </div>
        </div>

        <div 
          className="px-3 py-1.5 flex items-center gap-1.5 rounded-full text-[12px] font-bold border"
          style={{
            background: hasPredicted ? "rgba(78,222,163,0.1)" : "rgba(255,185,95,0.05)",
            color: hasPredicted ? "#4edea3" : "#ffb95f",
            borderColor: hasPredicted ? "rgba(78,222,163,0.2)" : "rgba(255,185,95,0.2)"
          }}
        >
          {hasPredicted ? (
            showPrediction ? (
              `${user.prediction.home_score} x ${user.prediction.away_score}`
            ) : (
              <>
                <span className="material-symbols-rounded text-[14px]">lock</span>
                Oculto
              </>
            )
          ) : (
            "Não palpitou"
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-lg bg-[#141414] rounded-2xl overflow-hidden flex flex-col max-h-[90vh] shadow-[0_0_40px_rgba(78,222,163,0.05)] border border-[#4edea3]/20">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-white/10 rounded-full"></div>

        <div className="flex items-center justify-between p-5 pb-2">
          <h2 className="text-xl font-bold text-white tracking-tight">Palpites da Partida</h2>
          <button onClick={onClose} className="p-1 text-[#8a9a8e] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CABEÇALHO DO JOGO COM PLACAR OFICIAL DINÂMICO */}
        <div className="px-6 py-4 flex items-center justify-center gap-6">
          <div className="flex flex-col items-center gap-2 w-[100px]">
            {renderFlag(match.home_flag)}
            <span className="text-[12px] font-semibold text-[#8a9a8e] text-center">{match.homeTeam?.name || match.home_team}</span>
          </div>
          
          <div className="flex items-center gap-3 text-2xl font-black text-white">
            {isMatchStarted && hasOfficialScore ? (
              <>
                <span className="text-[#4edea3] text-[28px]">{officialHome}</span>
                <span className="text-[#444] text-xl font-medium">×</span>
                <span className="text-[#4edea3] text-[28px]">{officialAway}</span>
              </>
            ) : (
              <>
                <span>-</span>
                <span className="text-[#444] text-xl font-medium">×</span>
                <span>-</span>
              </>
            )}
          </div>

          <div className="flex flex-col items-center gap-2 w-[100px]">
            {renderFlag(match.away_flag)}
            <span className="text-[12px] font-semibold text-[#8a9a8e] text-center">{match.awayTeam?.name || match.away_team}</span>
          </div>
        </div>

        {/* BARRA DE STATUS (Sem a Taxa) */}
        <div className="grid grid-cols-2 gap-px bg-white/5 border-y border-white/5">
          <div className="bg-[#141414] py-3 flex flex-col items-center justify-center">
            <span className="text-white font-bold text-[14px]">{totalPalpites} <span className="text-[#8a9a8e] font-medium text-[11px]">Palpites</span></span>
          </div>
          <div className="bg-[#141414] py-3 flex flex-col items-center justify-center">
            <span className="text-white font-bold text-[14px]">{membros} <span className="text-[#8a9a8e] font-medium text-[11px]">Membros</span></span>
          </div>
        </div>

        <div className="px-6 grid grid-cols-2 gap-1 p-1 bg-[#1a1a1a] mx-6 mt-4 rounded-xl border border-white/5">
          <button 
            onClick={() => setActiveTab("palpites")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-bold transition-all ${activeTab === "palpites" ? "bg-[#1f2e26] text-[#4edea3] shadow-sm" : "text-[#8a9a8e] hover:text-[#e5e2e1]"}`}
          >
            <User className="w-4 h-4" /> Palpites
          </button>
          <button 
            onClick={() => setActiveTab("historico")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-bold transition-all ${activeTab === "historico" ? "bg-[#252525] text-white shadow-sm" : "text-[#8a9a8e] hover:text-[#e5e2e1]"}`}
          >
            <Clock className="w-4 h-4" /> Histórico
          </button>
        </div>

        {/* CONTAINER COM SCROLL CONTROLADO INSERIDO AQUI */}
        <div className="flex-1 overflow-y-auto px-6 py-5 pb-8 custom-scrollbar min-h-[250px]">
          
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-[#4edea3]" />
            </div>
          ) : (
            <div className="min-h-full"> {/* Wrapper interno para garantir comportamento do flex */}
              {activeTab === "palpites" && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-bold text-[#8a9a8e] uppercase tracking-wider">Seu Palpite</span>
                    {allMembers.filter(m => m.isMe).map(member => renderUserCard(member))}
                  </div>

                  {allMembers.filter(m => !m.isMe).length > 0 && (
                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] font-bold text-[#8a9a8e] uppercase tracking-wider">Todos os Palpites ({membros - 1})</span>
                      <div className="flex flex-col gap-2">
                        {allMembers.filter(m => !m.isMe).map(member => renderUserCard(member))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "historico" && (
                <div className="flex flex-col gap-0 ml-2">
                  <span className="text-[11px] font-bold text-[#8a9a8e] uppercase tracking-wider mb-4 -ml-2">Linha do Tempo</span>
                  
                  {history.length === 0 ? (
                    <span className="text-[#8a9a8e] text-sm -ml-2">Nenhuma alteração registrada ainda.</span>
                  ) : (
                    <div className="relative border-l-2 border-[#2a2a2a] pl-6 flex flex-col gap-6">
                      {history.map((item, index) => {
                        const isLatest = index === 0;
                        const isFirst = index === history.length - 1;
                        
                        let statusText = "Alteração";
                        if (isLatest && history.length > 1) statusText = "Última alteração";
                        if (isFirst) statusText = "Primeira aposta";

                        const dateObj = new Date(item.changed_at);
                        const dataStr = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
                        const timeStr = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                        return (
                          <div key={item.id} className="relative">
                            <div className={`absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-[3px] border-[#141414] ${isLatest ? "bg-[#4edea3]" : "bg-[#444]"}`}></div>
                            
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2 text-[11px] font-semibold">
                                <span className={isLatest ? "text-[#4edea3]" : "text-white"}>{statusText}</span>
                                <span className="text-[#555]">•</span>
                                <span className="text-[#8a9a8e]">{dataStr} às {timeStr}</span>
                              </div>
                              <div className="flex items-center gap-2 bg-[#1a1a1a] border border-white/5 px-3 py-2 rounded-lg w-fit mt-1">
                                <span className="text-white font-bold">{match.homeTeam?.name || match.home_team}</span>
                                <span className="text-[#4edea3] font-black text-lg mx-1">{item.home_score}</span>
                                <span className="text-[#444] text-[12px]">x</span>
                                <span className="text-[#4edea3] font-black text-lg mx-1">{item.away_score}</span>
                                <span className="text-white font-bold">{match.awayTeam?.name || match.away_team}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
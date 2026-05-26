import React, { useState } from "react";
import { X, User, Clock } from "lucide-react";

export default function PredictionsModal({ isOpen, onClose, match, currentPrediction }) {
  const [activeTab, setActiveTab] = useState("palpites");

  if (!isOpen) return null;

  // Mocks para preencher a interface do design (futuramente virão do Supabase)
  const stats = { totalPalpites: 0, taxa: "0%", membros: 2 };
  
  const currentUser = { id: "1", name: "Aquila", isMe: true };
  const allMembers = [
    { id: "1", name: "Aquila", isMe: true, prediction: currentPrediction },
    { id: "2", name: "G Bolota", isMe: false, prediction: null } // Mock do design
  ];

  const mockHistory = [
    { id: 1, date: "20/05", time: "13:10", home: 2, away: 0, status: "Última alteração" },
    { id: 2, date: "20/05", time: "12:57", home: 1, away: 0, status: "Alteração" },
    { id: 3, date: "20/05", time: "12:00", home: 3, away: 0, status: "Primeira aposta" }
  ];

  const renderFlag = (flag) => {
    return flag?.startsWith("http") ? (
      <img src={flag} alt="flag" className="h-8 object-contain" />
    ) : (
      <span className="text-3xl">{flag || "🏳️"}</span>
    );
  };

  const renderUserCard = (user) => {
    const hasPredicted = user.prediction?.home_score !== undefined && user.prediction?.home_score !== null;

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
          <div className="w-10 h-10 rounded-full bg-[#1e1e1e] flex items-center justify-center border border-white/5 relative">
            <User className="w-5 h-5 text-[#8a9a8e]" />
            {user.isMe && (
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#ffb95f] rounded-full border-2 border-[#121212] flex items-center justify-center">
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

        {/* Status Badge */}
        <div 
          className="px-3 py-1.5 rounded-full text-[12px] font-bold border"
          style={{
            background: hasPredicted ? "rgba(78,222,163,0.1)" : "rgba(255,185,95,0.05)",
            color: hasPredicted ? "#4edea3" : "#ffb95f",
            borderColor: hasPredicted ? "rgba(78,222,163,0.2)" : "rgba(255,185,95,0.2)"
          }}
        >
          {hasPredicted ? `${user.prediction.home_score} x ${user.prediction.away_score}` : "Não palpitou"}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
      {/* Clique fora para fechar */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Box do Modal */}
      <div 
        className="relative w-full max-w-lg bg-[#141414] rounded-2xl overflow-hidden flex flex-col max-h-[90vh] shadow-[0_0_40px_rgba(78,222,163,0.05)] border border-[#4edea3]/20"
      >
        {/* Notchzinho superior */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-white/10 rounded-full"></div>

        {/* Header Superior */}
        <div className="flex items-center justify-between p-5 pb-2">
          <h2 className="text-xl font-bold text-white tracking-tight">Palpites da Partida</h2>
          <button onClick={onClose} className="p-1 text-[#8a9a8e] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Placar e Times */}
        <div className="px-6 py-4 flex items-center justify-center gap-6">
          <div className="flex flex-col items-center gap-2 w-[100px]">
            {renderFlag(match.home_flag)}
            <span className="text-[12px] font-semibold text-[#8a9a8e] text-center">{match.home_team}</span>
          </div>
          
          <div className="flex items-center gap-3 text-2xl font-black text-white">
            <span>-</span>
            <span className="text-[#444] text-xl">×</span>
            <span>-</span>
          </div>

          <div className="flex flex-col items-center gap-2 w-[100px]">
            {renderFlag(match.away_flag)}
            <span className="text-[12px] font-semibold text-[#8a9a8e] text-center">{match.away_team}</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-px bg-white/5 border-y border-white/5">
          <div className="bg-[#141414] py-3 flex flex-col items-center justify-center">
            <span className="text-white font-bold text-[14px]">{stats.totalPalpites} <span className="text-[#8a9a8e] font-medium text-[11px]">Palpites</span></span>
          </div>
          <div className="bg-[#141414] py-3 flex flex-col items-center justify-center">
            <span className="text-white font-bold text-[14px]">{stats.taxa} <span className="text-[#8a9a8e] font-medium text-[11px]">Taxa</span></span>
          </div>
          <div className="bg-[#141414] py-3 flex flex-col items-center justify-center">
            <span className="text-white font-bold text-[14px]">{stats.membros} <span className="text-[#8a9a8e] font-medium text-[11px]">Membros</span></span>
          </div>
        </div>

        {/* Multiplicador Banner */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[#ffb95f]/20 bg-[#ffb95f]/5 text-[#ffb95f] text-[13px] font-bold">
            <span className="material-symbols-rounded text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
            Rodada com multiplicador 2x
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 grid grid-cols-2 gap-1 p-1 bg-[#1a1a1a] mx-6 rounded-xl border border-white/5">
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

        {/* Content Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-5 pb-8 custom-scrollbar-dates">
          
          {activeTab === "palpites" && (
            <div className="flex flex-col gap-6">
              {/* Seu Palpite */}
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-bold text-[#8a9a8e] uppercase tracking-wider">Seu Palpite</span>
                {renderUserCard(allMembers.find(m => m.isMe))}
              </div>

              {/* Todos os Palpites */}
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-bold text-[#8a9a8e] uppercase tracking-wider">Todos os Palpites ({stats.membros})</span>
                <div className="flex flex-col gap-2">
                  {allMembers.map(member => renderUserCard(member))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "historico" && (
            <div className="flex flex-col gap-0 ml-2">
              <span className="text-[11px] font-bold text-[#8a9a8e] uppercase tracking-wider mb-4 -ml-2">Linha do Tempo</span>
              
              <div className="relative border-l-2 border-[#2a2a2a] pl-6 flex flex-col gap-6">
                {mockHistory.map((item, index) => {
                  const isLatest = index === 0;
                  return (
                    <div key={item.id} className="relative">
                      {/* Bolinha da timeline */}
                      <div className={`absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-[3px] border-[#141414] ${isLatest ? "bg-[#4edea3]" : "bg-[#444]"}`}></div>
                      
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-[11px] font-semibold">
                          <span className={isLatest ? "text-[#4edea3]" : "text-white"}>{item.status}</span>
                          <span className="text-[#555]">•</span>
                          <span className="text-[#8a9a8e]">{item.date} às {item.time}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-[#1a1a1a] border border-white/5 px-3 py-2 rounded-lg w-fit mt-1">
                          <span className="text-white font-bold">{match.home_team}</span>
                          <span className="text-[#4edea3] font-black text-lg mx-1">{item.home}</span>
                          <span className="text-[#444] text-[12px]">x</span>
                          <span className="text-[#4edea3] font-black text-lg mx-1">{item.away}</span>
                          <span className="text-white font-bold">{match.away_team}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

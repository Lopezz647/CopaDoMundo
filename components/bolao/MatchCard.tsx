import React, { useState, useEffect, useRef } from "react";
import PredictionsModal from "./PredictionsModal";

export default function MatchCard({ match, prediction, onPredictionChange }) {
  const [homeScore, setHomeScore] = useState<number | null>(prediction?.home_score ?? null);
  const [awayScore, setAwayScore] = useState<number | null>(prediction?.away_score ?? null);
  
  // Estados para o micro-feedback (animação do X)
  const [saveStatus, setSaveStatus] = useState<"idle" | "loading" | "success">("idle");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Estados para controle dinâmico do tempo
  const [timeLeftStr, setTimeLeftStr] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setHomeScore(prediction?.home_score ?? null);
    setAwayScore(prediction?.away_score ?? null);
  }, [prediction]);

  // Lógica de contagem regressiva dinâmica em tempo real
  useEffect(() => {
    const matchTime = new Date(match.match_date).getTime();
    const fifteenMinutesInMs = 15 * 60 * 1000;
    const lockTime = matchTime - fifteenMinutesInMs;

    const calculateCountdown = () => {
      const now = Date.now();
      const diff = lockTime - now;

      if (diff <= 0) {
        setIsLocked(true);
        setTimeLeftStr("Palpites encerrados");
        return;
      }

      setIsLocked(false);
      const oneDayInMs = 24 * 60 * 60 * 1000;

      if (diff > oneDayInMs) {
        const days = Math.ceil(diff / oneDayInMs);
        setTimeLeftStr(`Fecha em ${days} ${days === 1 ? "dia" : "dias"}`);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const pad = (num: number) => String(num).padStart(2, "0");
        setTimeLeftStr(`Fecha em ${hours}h ${pad(minutes)}m ${pad(seconds)}s`);
      }
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);

    return () => clearInterval(timer);
  }, [match.match_date]);

  const hasPrediction = homeScore !== null && awayScore !== null;

  // Lógica com salvamento Assíncrono para ativar a animação
  const handleChange = async (side: "home" | "away", delta: number) => {
    if (isLocked) return; 
    
    const currentHome = homeScore ?? 0;
    const currentAway = awayScore ?? 0;

    let nextHome = currentHome;
    let nextAway = currentAway;

    if (side === "home") {
      nextHome = Math.max(0, currentHome + delta);
      setHomeScore(nextHome);
      setAwayScore(currentAway);
    } else {
      nextAway = Math.max(0, currentAway + delta);
      setAwayScore(nextAway);
      setHomeScore(currentHome);
    }

    // Inicia a animação de "Carregando"
    setSaveStatus("loading");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    try {
      // Aguarda o banco de dados salvar
      await onPredictionChange?.(match.id, nextHome, nextAway);
      
      // Quando sucesso, muda para o check verde
      setSaveStatus("success");
      
      // Retorna para o "X" após 2 segundos
      timeoutRef.current = setTimeout(() => {
        setSaveStatus("idle");
      }, 2000);

    } catch (error) {
      // Em caso de falha de conexão, reseta imediatamente
      setSaveStatus("idle");
    }
  };

  return (
    <>
      <div
        className={`rounded-xl border overflow-hidden transition-all duration-300 ${isLocked ? "opacity-75" : ""}`}
        style={{ background: "#181818", borderColor: isLocked ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-black/10">
          <div className="flex items-center gap-2">
            
            {/* Oculta o selo quando já houver um palpite feito */}
            {!hasPrediction && (
              <div
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all bg-[#222] text-[#8a9a8e] border border-white/5"
              >
                <span className="material-symbols-rounded text-[12px]">help</span>
                Sem palpite
              </div>
            )}

            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                isLocked 
                  ? "bg-red-500/10 text-red-400 border-red-500/20" 
                  : "bg-[#4edea3]/5 text-[#4edea3] border-[#4edea3]/10"
              }`}
            >
              <span className="material-symbols-rounded text-[12px]">
                {isLocked ? "lock" : "hourglass_top"}
              </span>
              <span>{timeLeftStr}</span>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold text-[#4edea3] bg-[#4edea3]/5 border border-[#4edea3]/20 transition-all duration-300 shadow-[0_0_15px_rgba(78,222,163,0.08)] hover:shadow-[0_0_25px_rgba(78,222,163,0.3)] hover:border-[#4edea3] hover:bg-[#4edea3] hover:text-black active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-rounded text-[14px]">group</span>
            Quem palpitou
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="flex items-center justify-center gap-6">
            
            <div className="flex flex-col items-center gap-3 w-[120px]">
              <div className="w-14 h-10 flex items-center justify-center text-4xl leading-none">
                {match.home_flag?.startsWith("http") ? (
                  <img src={match.home_flag} alt={match.home_team} className="max-h-full max-w-full object-contain" />
                ) : (
                  match.home_flag || "🏳️"
                )}
              </div>
              <span className="text-[13px] font-semibold text-[#e5e2e1] text-center line-clamp-2 min-h-[32px] flex items-center justify-center leading-tight">
                {match.home_team}
              </span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleChange("home", -1)} 
                  disabled={isLocked} 
                  className="w-7 h-7 rounded bg-[#222] flex items-center justify-center hover:bg-[#2e2e2e] text-[#8a9a8e] hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="material-symbols-rounded text-[16px]">remove</span>
                </button>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[20px] font-bold bg-[#111] border border-white/5 text-[#e5e2e1]">
                  {homeScore ?? "-"}
                </div>
                <button 
                  onClick={() => handleChange("home", 1)} 
                  disabled={isLocked} 
                  className="w-7 h-7 rounded bg-[#222] flex items-center justify-center hover:bg-[#2e2e2e] text-[#8a9a8e] hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="material-symbols-rounded text-[16px]">add</span>
                </button>
              </div>
            </div>

            {/* Container Central (X animado) */}
            <div className="w-8 h-8 flex items-center justify-center relative">
              {saveStatus === "idle" && (
                <div className="text-[#333] font-bold text-xl select-none transition-all duration-300">×</div>
              )}
              {saveStatus === "loading" && (
                <div className="w-4 h-4 rounded-full border-2 border-[#4edea3]/30 border-t-[#4edea3] animate-spin transition-all duration-300"></div>
              )}
              {saveStatus === "success" && (
                <span className="material-symbols-rounded text-[#4edea3] text-[18px] transition-all duration-300 drop-shadow-[0_0_8px_rgba(78,222,163,0.5)]">check_circle</span>
              )}
            </div>

            <div className="flex flex-col items-center gap-3 w-[120px]">
              <div className="w-14 h-10 flex items-center justify-center text-4xl leading-none">
                {match.away_flag?.startsWith("http") ? (
                  <img src={match.away_flag} alt={match.away_team} className="max-h-full max-w-full object-contain" />
                ) : (
                  match.away_flag || "🏳️"
                )}
              </div>
              <span className="text-[13px] font-semibold text-[#e5e2e1] text-center line-clamp-2 min-h-[32px] flex items-center justify-center leading-tight">
                {match.away_team}
              </span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleChange("away", -1)} 
                  disabled={isLocked} 
                  className="w-7 h-7 rounded bg-[#222] flex items-center justify-center hover:bg-[#2e2e2e] text-[#8a9a8e] hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="material-symbols-rounded text-[16px]">remove</span>
                </button>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[20px] font-bold bg-[#111] border border-white/5 text-[#e5e2e1]">
                  {awayScore ?? "-"}
                </div>
                <button 
                  onClick={() => handleChange("away", 1)} 
                  disabled={isLocked} 
                  className="w-7 h-7 rounded bg-[#222] flex items-center justify-center hover:bg-[#2e2e2e] text-[#8a9a8e] hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="material-symbols-rounded text-[16px]">add</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <PredictionsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        match={match}
        currentPrediction={{ home_score: homeScore, away_score: awayScore }}
      />
    </>
  );
}

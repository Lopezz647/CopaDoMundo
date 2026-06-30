import React, { useState, useEffect, useRef } from "react";
import PredictionsModal from "./PredictionsModal";
import { validatePrediction } from '@/lib/validators';
import { isMatchTimeLocked, formatMatchTime } from '@/lib/timezone-utils';
import { getMatchState } from '@/lib/match-status';
import { traduzirTime } from "@/lib/utils";

// --- INTERFACES DE TIPAGEM ---
interface MatchScore {
  home: number | null;
  away: number | null;
}

interface Match {
  id: string;
  status?: string;
  utcDate?: string;
  match_date: string;
  home_team: string;
  away_team: string;
  home_flag?: string;
  away_flag?: string;
  score?: {
    fullTime?: MatchScore;
    regularTime?: MatchScore;
  };
}

interface Prediction {
  home_score: number | null;
  away_score: number | null;
}

interface MatchCardProps {
  match: Match;
  prediction?: Prediction | null;
  onPredictionChange?: (matchId: string, homeScore: number, awayScore: number) => Promise<void> | void;
}
// -----------------------------

export default function MatchCard({ match, prediction, onPredictionChange }: MatchCardProps) {
  const [homeScore, setHomeScore] = useState<number | null>(prediction?.home_score ?? null);
  const [awayScore, setAwayScore] = useState<number | null>(prediction?.away_score ?? null);
  
  // Estados para o micro-feedback (animação do X)
  const [saveStatus, setSaveStatus] = useState<"idle" | "loading" | "success">("idle");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Estados para controle dinâmico do tempo
  const [timeLeftStr, setTimeLeftStr] = useState("");
  const [isTimeLocked, setIsTimeLocked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. CORREÇÃO: Status e Horário extraídos no escopo principal do componente
    // 1. CORREÇÃO: Status e Horário extraídos no escopo principal do componente
  const status = match.status?.toUpperCase() || "TIMED";
  const dateObj = new Date(match.utcDate || match.match_date);
  const matchTimeMs = dateObj.getTime();
  
  // Pegamos a hora atual (como o seu setInterval roda a cada segundo, isso vai se manter atualizado!)
  const now = Date.now();

  const isFinished = ["FINISHED", "FT", "AET"].includes(status);
  const isApiLive = ["IN_PLAY", "PAUSED", "LIVE", "HT", "1H", "2H", "ET", "PEN"].includes(status);
  
  // A MÁGICA ACONTECE AQUI: Está ao vivo se a API disser que sim 
  // OU se o relógio já passou da hora do jogo E o jogo ainda não acabou
  const isLive = isApiLive || (now >= matchTimeMs && !isFinished);
  
  const isPending = !isFinished && !isLive;
  const showRealScore = isLive || isFinished;
  
  const timeStr = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });


  // O card bloqueia cliques se o tempo acabou, ou se o jogo começou/terminou
  const isLocked = isTimeLocked || isLive || isFinished;

  useEffect(() => {
    setHomeScore(prediction?.home_score ?? null);
    setAwayScore(prediction?.away_score ?? null);
  }, [prediction]);

  // Lógica de contagem regressiva dinâmica
  useEffect(() => {
    if (isLive || isFinished) {
      setIsTimeLocked(true);
      return;
    }

    const matchTime = new Date(match.match_date).getTime();
    const fifteenMinutesInMs = 15 * 60 * 1000;
    const lockTime = matchTime - fifteenMinutesInMs;

    const calculateCountdown = () => {
      const now = Date.now();
      const diff = lockTime - now;

      if (diff <= 0) {
        setIsTimeLocked(true);
        setTimeLeftStr("Palpites encerrados");
        return;
      }

      setIsTimeLocked(false);
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
  }, [match.match_date, isLive, isFinished]);

  const hasPrediction = homeScore !== null && awayScore !== null;

  const handleChange = async (side: "home" | "away", delta: number) => {
    if (isLocked) return;
    
    const currentHome = homeScore ?? 0;
    const currentAway = awayScore ?? 0;

    let nextHome = currentHome;
    let nextAway = currentAway;

    if (side === "home") {
      nextHome = Math.max(0, Math.min(20, currentHome + delta)); // Limita a 20
      setHomeScore(nextHome);
      setAwayScore(currentAway);
    } else {
      nextAway = Math.max(0, Math.min(20, currentAway + delta)); // Limita a 20
      setAwayScore(nextAway);
      setHomeScore(currentHome);
    }

    // Validar antes de salvar
const validation = validatePrediction(nextHome, nextAway);

// Checa se a propriedade 'errors' existe dentro do objeto retornado
if ('errors' in validation) {
  console.error('Erro de validação:', validation.errors);
  return;
}


    setSaveStatus("loading");
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    try {
      await onPredictionChange?.(match.id, nextHome, nextAway);
      setSaveStatus("success");
      timeoutRef.current = setTimeout(() => {
        setSaveStatus("idle");
      }, 2000);
    } catch (error) {
      setSaveStatus("idle");
    }
  };

  const realHomeScore = match.score?.regularTime?.home ?? match.score?.fullTime?.home;
  const realAwayScore = match.score?.regularTime?.away ?? match.score?.fullTime?.away;

  // 2. CORREÇÃO: Aplicação do NEON azul pulsante no status "isLive"
  let StatusBadge;
  if (isFinished) {
    StatusBadge = (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all bg-white/5 text-[#8a9a8e] uppercase tracking-wider">
        <span className="material-symbols-rounded text-[14px]">check_circle</span>
        Encerrado
      </div>
    );
  } else if (isLive) {
    StatusBadge = (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all bg-blue-500/10 text-blue-400 border border-blue-500/40 uppercase tracking-wider shadow-[0_0_12px_rgba(59,130,246,0.3)] animate-pulse">
        Partida em Andamento
      </div>
    );
  } else if (isTimeLocked) {
    StatusBadge = (
      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all bg-red-500/10 text-red-400 border-red-500/20 uppercase tracking-wider">
        <span className="material-symbols-rounded text-[12px]">lock</span>
        Palpites encerrados
      </div>
    );
  } else {
    StatusBadge = (
      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all bg-[#4edea3]/5 text-[#4edea3] border-[#4edea3]/10">
        <span className="material-symbols-rounded text-[12px]">hourglass_top</span>
        <span>{timeLeftStr}</span>
      </div>
    );
  }

  return (
    <>
      <div
        className={`rounded-xl border overflow-hidden transition-all duration-300 ${isLocked ? "opacity-75" : ""}`}
        style={{ background: "#181818", borderColor: isLocked ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-black/10">
          <div className="flex items-center gap-2">
            {!hasPrediction && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all bg-[#222] text-[#8a9a8e] border border-white/5">
                <span className="material-symbols-rounded text-[12px]">help</span>
                Sem palpite
              </div>
            )}
            {StatusBadge}
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
            
            {/* ====== TIME CASA ====== */}
            <div className="flex flex-col items-center gap-3 w-[120px]">
              <div className="w-14 h-10 flex items-center justify-center text-4xl leading-none">
                {match.home_flag?.startsWith("http") ? (
                  <img src={match.home_flag} alt={traduzirTime(match.home_team)} className="max-h-full max-w-full object-contain" />
                ) : (
                  match.home_flag || "🏳️"
                )}
              </div>
              <span className="text-[13px] font-semibold text-[#e5e2e1] text-center line-clamp-2 min-h-[32px] flex items-center justify-center leading-tight">
                {traduzirTime(match.home_team)}
              </span>
              
              {!showRealScore && (
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
              )}
            </div>

            {/* ====== CONTAINER CENTRAL (X ou Placar Real) ====== */}
            {showRealScore ? (
              <div className="flex flex-col items-center justify-center mx-2">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-4xl font-black text-white">{realHomeScore ?? 0}</span>
                  <span className={`text-xl font-bold ${isLive ? 'text-blue-400 animate-pulse drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'text-[#8a9a8e]'}`}>X</span>
                  <span className="text-4xl font-black text-white">{realAwayScore ?? 0}</span>
                </div>
                
                <div className="flex flex-col items-center bg-[#111] border border-white/5 rounded-xl px-4 py-2 min-w-[110px]">
                  <span className="text-[#8a9a8e] text-[9px] uppercase font-bold tracking-wider mb-1">Meu Palpite</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#e5e2e1] font-bold text-sm">{homeScore !== null ? homeScore : "-"}</span>
                    <span className="text-[#8a9a8e] text-xs">x</span>
                    <span className="text-[#e5e2e1] font-bold text-sm">{awayScore !== null ? awayScore : "-"}</span>
                  </div>
                </div>
              </div>
            ) : (
              // 3. CORREÇÃO: Horário inserido acima do "X" com ocultação automática 
              <div className="flex flex-col items-center justify-center min-w-[70px]">
                {isPending && (
                  <span className="text-[10px] font-medium text-[#8a9a8e] mb-1.5 tracking-wider">
                    {timeStr}
                  </span>
                )}
                <div className="w-8 h-8 flex items-center justify-center relative bg-white/5 rounded-md">
                  {saveStatus === "idle" && (
                    <div className="text-[#8a9a8e] font-bold text-[14px] select-none transition-all duration-300">X</div>
                  )}
                  {saveStatus === "loading" && (
                    <div className="w-4 h-4 rounded-full border-2 border-[#4edea3]/30 border-t-[#4edea3] animate-spin transition-all duration-300"></div>
                  )}
                  {saveStatus === "success" && (
                    <span className="material-symbols-rounded text-[#4edea3] text-[18px] transition-all duration-300 drop-shadow-[0_0_8px_rgba(78,222,163,0.5)]">check_circle</span>
                  )}
                </div>
              </div>
            )}

            {/* ====== TIME FORA ====== */}
            <div className="flex flex-col items-center gap-3 w-[120px]">
              <div className="w-14 h-10 flex items-center justify-center text-4xl leading-none">
                {match.away_flag?.startsWith("http") ? (
                  <img src={match.away_flag} alt={traduzirTime(match.away_team)} className="max-h-full max-w-full object-contain" />
                ) : (
                  match.away_flag || "🏳️"
                )}
              </div>
              <span className="text-[13px] font-semibold text-[#e5e2e1] text-center line-clamp-2 min-h-[32px] flex items-center justify-center leading-tight">
                {traduzirTime(match.away_team)}
              </span>
              
              {!showRealScore && (
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
              )}
            </div>

          </div>
        </div>
      </div>

      <PredictionsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        match={match as any} // Passado como any internamente caso o PredictionsModal tenha tipagem diferente
        currentPrediction={{ home_score: homeScore, away_score: awayScore }}
      />
    </>
  );
}

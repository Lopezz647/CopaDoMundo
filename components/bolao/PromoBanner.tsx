"use client";
import React, { useState, useEffect, useRef } from "react";
import { X, Loader2, CalendarClock } from "lucide-react";

// Dicionário de Tradução dos Times (Inglês -> Português)
const TIME_TRADUCOES: Record<string, string> = {
  "Argentina": "Argentina",
  "Brazil": "Brasil",
  "France": "França",
  "Germany": "Alemanha",
  "Spain": "Espanha",
  "England": "Inglaterra",
  "Portugal": "Portugal",
  "Netherlands": "Países Baixos",
  "Belgium": "Bélgica",
  "Croatia": "Croácia",
  "Uruguay": "Uruguai",
  "Mexico": "México",
  "Morocco": "Marrocos",
  "Japan": "Japão",
  "South Korea": "Coreia do Sul",
  "Switzerland": "Suíça",
  "USA": "EUA",
  "United States": "Estados Unidos",
  "Senegal": "Senegal",
  "Ecuador": "Equador",
  "Qatar": "Catar",
  "Saudi Arabia": "Arábia Saudita",
  "Iran": "Irã",
  "Australia": "Austrália",
  "Tunisia": "Tunísia",
  "Poland": "Polônia",
  "Denmark": "Dinamarca",
  "Canada": "Canadá",
  "Costa Rica": "Costa Rica",
  "Ghana": "Gana",
  "Cameroon": "Camarões",
  "Serbia": "Sérvia",
  "Wales": "País de Gales"
};

// Função auxiliar para traduzir ou manter o nome original
function traduzirTime(nomeTime: string | undefined): string {
  if (!nomeTime) return "A Definir";
  return TIME_TRADUCOES[nomeTime] || nomeTime;
}

// Fases com o "16 avos" incluído
const WORLD_CUP_PHASES = [
  { id: "ROUND_1", label: "Rodada 1" },
  { id: "ROUND_2", label: "Rodada 2" },
  { id: "ROUND_3", label: "Rodada 3" },
  { id: "LAST_32", label: "16 avos" },
  { id: "LAST_16", label: "Oitavas" },
  { id: "QUARTER_FINALS", label: "Quartas" },
  { id: "SEMI_FINALS", label: "Semifinal" },
  { id: "FINAL", label: "Final" }
];

export default function PromoBanner() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activePhase, setActivePhase] = useState("ROUND_1");

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Busca os jogos na API apenas quando o modal for aberto pela primeira vez
  useEffect(() => {
    if (isModalOpen && matches.length === 0) {
      fetchMatches();
    }
  }, [isModalOpen, matches.length]);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/futebol/competitions/WC/matches");
      const data = await res.json();
      setMatches(data.matches || []);
    } catch (error) {
      console.error("Erro ao buscar tabela:", error);
    } finally {
      setLoading(false);
    }
  };

  // Lógica do Auto-Scroll animado do menu
  useEffect(() => {
    if (scrollContainerRef.current && isModalOpen) {
      const container = scrollContainerRef.current;
      const selectedButton = container.querySelector(`[data-phase="${activePhase}"]`) as HTMLElement;
      
      if (selectedButton) {
        const containerWidth = container.offsetWidth;
        const buttonWidth = selectedButton.offsetWidth;
        const buttonLeft = selectedButton.offsetLeft;

        const scrollPosition = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);

        container.scrollTo({
          left: scrollPosition,
          behavior: "smooth"
        });
      }
    }
  }, [activePhase, isModalOpen]);

  // Filtra as partidas pela fase ativa
  const filteredMatches = matches.filter(m => {
    if (activePhase.startsWith("ROUND_")) {
      const roundNum = parseInt(activePhase.replace("ROUND_", ""));
      return m.matchday === roundNum || (m.stage === "GROUP_STAGE" && m.matchday === roundNum);
    }
    return m.stage === activePhase;
  });

  return (
    <>
      {/* BANNER PRINCIPAL */}
      <div
        className="rounded-xl overflow-hidden relative"
        style={{ background: "linear-gradient(135deg, #1a2e24 0%, #0f1f17 60%, #0a0a0a 100%)", border: "1px solid rgba(78,222,163,0.15)" }}
      >
        <div className="relative p-5 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-5 w-full md:w-auto">
            {/* FIFA-style trophy circle */}
            <div
              className="w-[72px] h-[72px] rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
              style={{
                background: "radial-gradient(circle, #1e3d2e 0%, #0d1f16 100%)",
                border: "2px solid rgba(78,222,163,0.25)",
                boxShadow: "0 0 20px rgba(78,222,163,0.1)"
              }}
            >
              <img
                src="/logo-copa.png"
                alt="Troféu Copa do Mundo"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <h1 className="text-[22px] font-bold text-[#e5e2e1] leading-none">Bolão DRH-1</h1>
              <div className="flex items-center gap-1.5 text-[12px] text-[#4edea3]">
                <span className="material-symbols-rounded text-[13px]">sync</span>
                <span>Atualizações em até 10 minutos.</span>
              </div>
              <div className="flex items-center gap-1.5 text-[12px] text-[#ff6b6b]">
                <span className="material-symbols-rounded text-[13px]">radio_button_checked</span>
                <span>Palpites até 15 min antes do jogo</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3 w-full md:w-auto mt-2 md:mt-0">
            <button className="border border-[#4edea3]/50 text-[#4edea3] text-[11px] font-bold px-4 py-1.5 rounded-full tracking-wider uppercase hover:bg-[#4edea3]/10 transition-colors hidden md:block">
              COPA DO MUNDO
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-[13px] font-semibold text-[#003824] transition-all w-full md:w-auto hover:bg-[#3ec490]"
              style={{ background: "#4edea3", boxShadow: "0 2px 10px rgba(78,222,163,0.35)" }}
            >
              <span className="material-symbols-rounded text-[18px]">table_chart</span>
              Ver Tabela
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DE TABELA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)}></div>

          <div className="relative w-full max-w-2xl bg-[#141414] rounded-2xl flex flex-col max-h-[85vh] shadow-[0_0_40px_rgba(78,222,163,0.1)] border border-[#4edea3]/20 overflow-hidden">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-white/10 rounded-full"></div>

            {/* HEADER DO MODAL */}
            <div className="flex items-center justify-between p-5 border-b border-white/5 bg-[#141414]">
              <div className="flex items-center gap-3">
                <span className="material-symbols-rounded text-[#4edea3] text-[26px] drop-shadow-[0_0_10px_rgba(78,222,163,0.3)]">emoji_events</span>
                <h2 className="text-xl font-bold text-white tracking-tight">Tabela Oficial da Copa</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-[#8a9a8e] hover:text-white transition-colors rounded-full hover:bg-white/5">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* NAVIGATOR (ESTILO DATE-NAVIGATOR) */}
            <div className="border-b border-white/5 bg-[#1a1a1a]">
              <div
                ref={scrollContainerRef}
                className="flex px-4 py-3 gap-2 w-full overflow-x-auto custom-scrollbar-dates snap-x"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {WORLD_CUP_PHASES.map((phase) => {
                  const isSelected = activePhase === phase.id;
                  return (
                    <button
                      key={phase.id}
                      data-phase={phase.id}
                      onClick={() => setActivePhase(phase.id)}
                      className={`flex items-center justify-center px-5 py-2 rounded-full text-[12px] font-bold whitespace-nowrap transition-all flex-shrink-0 snap-center border ${
                        isSelected
                          ? "bg-[#4edea3]/10 text-[#4edea3] border-[#4edea3]/30 shadow-[0_0_10px_rgba(78,222,163,0.1)]"
                          : "bg-transparent text-[#8a9a8e] border-white/5 hover:bg-white/5"
                      }`}
                    >
                      {phase.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* LISTA DE JOGOS (Com Scrollbar Elegante) */}
            <div className="flex-1 overflow-y-auto p-4 md:p-5 bg-[#0a0a0a] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20 transition-colors">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-[300px] gap-4">
                  <Loader2 className="w-10 h-10 animate-spin text-[#4edea3]" />
                  <span className="text-[13px] font-medium text-[#8a9a8e] animate-pulse">Carregando confrontos...</span>
                </div>
              ) : filteredMatches.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[300px] text-center">
                  <span className="material-symbols-rounded text-[60px] text-white/5 mb-4">sports_soccer</span>
                  <p className="text-[15px] text-[#8a9a8e] font-medium">Os jogos desta fase ainda não foram definidos.</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {filteredMatches.sort((a, b) => new Date(a.utcDate || a.match_date).getTime() - new Date(b.utcDate || b.match_date).getTime()).map((match) => {
                    
                    const dateObj = new Date(match.utcDate || match.match_date);
                    const timeStr = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                    const dateStr = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
                    
                    const isFinished = match.status === "FINISHED";
                    const isLive = ["IN_PLAY", "PAUSED", "LIVE", "HT"].includes(match.status);
                    
                    const homeScore = match.score?.fullTime?.home ?? match.score?.regularTime?.home;
                    const awayScore = match.score?.fullTime?.away ?? match.score?.regularTime?.away;

                    // Busca a bandeira tanto do objeto nativo da API quanto do Supabase
                    const homeCrest = match.homeTeam?.crest || match.home_team_crest;
                    const awayCrest = match.awayTeam?.crest || match.away_team_crest;

                    return (
                      <div key={match.id} className="flex flex-col bg-[#141414] rounded-xl border border-white/5 overflow-hidden shadow-sm hover:border-white/10 transition-colors">
                        
                        {/* Cabecalho da Partida */}
                        <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a1a] border-b border-white/5">
                          <div className="flex items-center gap-2 text-[11px] font-bold text-[#8a9a8e]">
                            <CalendarClock className="w-3.5 h-3.5" />
                            {dateStr} às {timeStr}
                          </div>
                          <div className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            isFinished ? "bg-white/5 text-[#8a9a8e]" : 
                            isLive ? "bg-[#ffb95f]/10 text-[#ffb95f] border border-[#ffb95f]/20 animate-pulse" : 
                            "bg-[#4edea3]/10 text-[#4edea3]"
                          }`}>
                            {isFinished ? "Encerrado" : isLive ? "Ao Vivo" : "Em Breve"}
                          </div>
                        </div>
                        
                        {/* Corpo da Partida (Times e Placar) */}
                        <div className="flex items-center justify-between p-4 gap-4">
                          
                          {/* Time da Casa (Direita) */}
                          <div className="flex items-center gap-3 flex-1 justify-end min-w-0">
                            <span className="font-bold text-[14px] md:text-[15px] text-[#e5e2e1] text-right truncate">
                              {traduzirTime(match.homeTeam?.name || match.home_team)}
                            </span>
                            {homeCrest ? (
                              <img src={homeCrest} alt="Bandeira Mandante" className="w-8 h-6 object-contain rounded-sm flex-shrink-0" />
                            ) : (
                              <span className="text-[24px]">🏳️</span>
                            )}
                          </div>
                          
                          {/* Placar ou VS */}
                          <div className="flex items-center justify-center min-w-[70px] flex-shrink-0">
                            {(isFinished || isLive) && homeScore != null && awayScore != null ? (
                              <div className="flex items-center gap-2 text-[22px] font-black text-[#4edea3] drop-shadow-[0_0_8px_rgba(78,222,163,0.3)]">
                                <span>{homeScore}</span>
                                <span className="text-[#444] text-[14px] font-bold">x</span>
                                <span>{awayScore}</span>
                              </div>
                            ) : (
                              <span className="text-[#444] font-bold text-[14px] px-2 py-1 bg-white/5 rounded-md">VS</span>
                            )}
                          </div>
                          
                          {/* Time Visitante (Esquerda) */}
                          <div className="flex items-center gap-3 flex-1 justify-start min-w-0">
                            {awayCrest ? (
                              <img src={awayCrest} alt="Bandeira Visitante" className="w-8 h-6 object-contain rounded-sm flex-shrink-0" />
                            ) : (
                              <span className="text-[24px]">🏳️</span>
                            )}
                            <span className="font-bold text-[14px] md:text-[15px] text-[#e5e2e1] text-left truncate">
                              {traduzirTime(match.awayTeam?.name || match.away_team)}
                            </span>
                          </div>
                          
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2 } from "lucide-react";

// Seus componentes já existentes
import UserHeader from "@/components/layout/UserHeader";
import PromoBanner from "@/components/bolao/PromoBanner";
import RoundNavigation from "@/components/bolao/RoundNavigation"; // Para as fases
import DateNavigator from "@/components/bolao/DateNavigator";     // Para os dias
import MatchCard from "@/components/bolao/MatchCard";             // O card de jogo

export default function PalpitesPage() {
  const [groupedData, setGroupedData] = useState<Record<string, Record<string, any[]>>>({});
  const [loading, setLoading] = useState(true);

  // Controles de navegação
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Buscar os dados organizados da API
  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await fetch("/api/jogos"); // Rota criada no Passo 1
        const data = await res.json();
        
        setGroupedData(data);
        
        // Define a primeira fase e a primeira data por padrão assim que carrega
        const phases = Object.keys(data);
        if (phases.length > 0) {
          const firstPhase = phases[0];
          setSelectedPhase(firstPhase);
          
          const datesInFirstPhase = Object.keys(data[firstPhase]).sort();
          if (datesInFirstPhase.length > 0) {
            setSelectedDate(datesInFirstPhase[0]);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar jogos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();
  }, []);

  // Toda vez que a fase muda, reseta a data para a primeira data disponível daquela fase
  const handlePhaseChange = (phase: string) => {
    setSelectedPhase(phase);
    const datesInPhase = Object.keys(groupedData[phase] || {}).sort();
    if (datesInPhase.length > 0) {
      setSelectedDate(datesInPhase[0]);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#4edea3]" />
      </div>
    );
  }

  // Pega as datas da fase selecionada
  const availableDates = selectedPhase ? Object.keys(groupedData[selectedPhase] || {}).sort() : [];
  
  // Pega os jogos da data selecionada
  const matchesToRender = (selectedPhase && selectedDate) 
    ? groupedData[selectedPhase][selectedDate] 
    : [];

  return (
    <div className="space-y-6">
      <UserHeader />
      <PromoBanner />

      {/* Navegação de Fases (Fase de Grupos - 1, etc) */}
      <RoundNavigation 
        rounds={Object.keys(groupedData)} 
        activeRound={selectedPhase} 
        onRoundSelect={handlePhaseChange} 
      />

      {/* Se houver uma fase selecionada, mostra as datas daquela fase */}
      {selectedPhase && availableDates.length > 0 && (
        <DateNavigator 
          dates={availableDates.map(d => ({
            id: d, 
            // Formata para algo como "12 Jun" ou "12 de Junho"
            label: format(parseISO(d), "dd MMM", { locale: ptBR }) 
          }))}
          activeDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      )}

      {/* Renderização dos Jogos do Dia */}
      <div className="mt-6 space-y-4">
        {matchesToRender.map((match) => (
          <MatchCard 
            key={match.fixture.id} 
            match={match}
            // Aqui você conectará a lógica de onChange e de palpites salvos no DB
            prediction={null} 
            onPredictionChange={(score) => console.log("Palpite:", score)} 
          />
        ))}

        {matchesToRender.length === 0 && (
          <p className="text-center text-gray-500">Nenhum jogo nesta data.</p>
        )}
      </div>
      
    </div>
  );
}

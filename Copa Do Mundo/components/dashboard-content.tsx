'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MatchCard } from '@/components/match-card'
import { Ranking } from '@/components/ranking'
import { StatsCards } from '@/components/stats-cards'
import { DashboardHero } from '@/components/dashboard-hero'
import { LatestResults } from '@/components/latest-results'
import { Match, Prediction, ProfileWithPoints } from '@/lib/types'
import { Calendar, Trophy, ListChecks } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface DashboardContentProps {
  userId: string
  matches: Match[]
  predictions: Prediction[]
  profiles: ProfileWithPoints[]
}

export function DashboardContent({ userId, matches, predictions, profiles }: DashboardContentProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('jogos')

  // Criar mapa de palpites por jogo
  const predictionsByMatch = predictions.reduce((acc, pred) => {
    acc[pred.match_id] = pred
    return acc
  }, {} as Record<string, Prediction>)

  // Calcular estatísticas do usuário
  const userProfile = profiles.find((p) => p.id === userId)
  const totalPoints = userProfile?.total_points || 0
  const totalPredictions = predictions.length
  const exactPredictions = predictions.filter((p) => p.points === 10).length

  // Calcular posição no ranking
  const sortedProfiles = [...profiles].sort((a, b) => b.total_points - a.total_points)
  const position = sortedProfiles.findIndex((p) => p.id === userId) + 1
  const leader = sortedProfiles.length > 0 ? sortedProfiles[0] : null

  // Calcular média de pontos
  const averagePoints = profiles.length > 0 
    ? profiles.reduce((sum, p) => sum + p.total_points, 0) / profiles.length 
    : 0

  // Determinar a rodada atual
  const upcomingMatches = matches.filter((m) => !m.is_finished && new Date(m.match_date) > new Date())
  const finishedMatches = matches.filter((m) => m.is_finished)
  
  // Pegar a fase do próximo jogo ou do último jogo finalizado
  const currentRound = upcomingMatches.length > 0 
    ? upcomingMatches[0].phase 
    : finishedMatches.length > 0 
      ? finishedMatches[finishedMatches.length - 1].phase 
      : 'Fase de Grupos'

  // Separar jogos por status
  const ongoingMatches = matches.filter(
    (m) => !m.is_finished && new Date(m.match_date) <= new Date()
  )

  const handlePredictionSaved = () => {
    router.refresh()
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 md:py-8">
      {/* Hero com informacoes principais */}
      <DashboardHero 
        currentRound={currentRound}
        averagePoints={averagePoints}
        leader={leader}
        totalParticipants={profiles.length}
      />

      {/* Estatísticas do Usuário */}
      <div className="mb-8">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Suas Estatísticas
        </h2>
        <StatsCards
          totalPoints={totalPoints}
          totalPredictions={totalPredictions}
          exactPredictions={exactPredictions}
          position={position}
          totalParticipants={profiles.length}
        />
      </div>

      {/* Layout em Grid para Desktop */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Coluna Principal */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-[300px]">
              <TabsTrigger value="jogos" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Jogos</span>
              </TabsTrigger>
              <TabsTrigger value="palpites" className="flex items-center gap-2">
                <ListChecks className="h-4 w-4" />
                <span>Meus Palpites</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Jogos */}
            <TabsContent value="jogos" className="space-y-6">
              {ongoingMatches.length > 0 && (
                <div>
                  <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                    </span>
                    Em Andamento
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {ongoingMatches.map((match) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        prediction={predictionsByMatch[match.id]}
                        userId={userId}
                        onPredictionSaved={handlePredictionSaved}
                      />
                    ))}
                  </div>
                </div>
              )}

              {upcomingMatches.length > 0 && (
                <div>
                  <h2 className="mb-4 text-lg font-semibold">Proximos Jogos</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {upcomingMatches.map((match) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        prediction={predictionsByMatch[match.id]}
                        userId={userId}
                        onPredictionSaved={handlePredictionSaved}
                      />
                    ))}
                  </div>
                </div>
              )}

              {matches.length === 0 && (
                <div className="rounded-2xl border border-dashed py-12 text-center">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground/30" />
                  <p className="mt-4 text-muted-foreground">Nenhum jogo cadastrado ainda</p>
                </div>
              )}
            </TabsContent>

            {/* Tab Meus Palpites */}
            <TabsContent value="palpites" className="space-y-6">
              <div>
                {predictions.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {matches
                      .filter((m) => predictionsByMatch[m.id])
                      .sort((a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime())
                      .map((match) => (
                        <MatchCard
                          key={match.id}
                          match={match}
                          prediction={predictionsByMatch[match.id]}
                          userId={userId}
                          onPredictionSaved={handlePredictionSaved}
                        />
                      ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed py-12 text-center">
                    <ListChecks className="mx-auto h-12 w-12 text-muted-foreground/30" />
                    <p className="mt-4 text-muted-foreground">
                      {"Voce ainda nao fez nenhum palpite"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Va para a aba Jogos e faca seus palpites!
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Coluna Lateral */}
        <div className="space-y-6">
          {/* Ranking */}
          <Ranking profiles={profiles} currentUserId={userId} compact />
          
          {/* Ultimos Resultados */}
          <LatestResults matches={matches} predictions={predictionsByMatch} />
        </div>
      </div>
    </main>
  )
}

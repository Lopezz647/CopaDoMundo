'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MatchCard } from '@/components/match-card'
import { Ranking } from '@/components/ranking'
import { StatsCards } from '@/components/stats-cards'
import { DashboardHero } from '@/components/dashboard-hero'
import { LatestResults } from '@/components/latest-results'
import { Match, Prediction, ProfileWithPoints } from '@/lib/types'
import { Calendar, ListChecks, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface DashboardContentProps {
  userId: string
  matches: Match[]
  predictions: Prediction[]
  profiles: ProfileWithPoints[]
}

const API_KEY = process.env.NEXT_PUBLIC_API_TOKEN;
const API_URL = "/api/futebol/competitions/BSA/matches";

export function DashboardContent({ userId, matches: initialMatches, predictions, profiles }: DashboardContentProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('jogos')
  
  const [matches, setMatches] = useState<Match[]>(initialMatches)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchLiveScores = async () => {
    if (!API_KEY) return;
    
    try {
      setIsRefreshing(true)
      const response = await fetch(API_URL, {
        headers: { "X-Auth-Token": API_KEY },
      })

      if (!response.ok) throw new Error("Falha ao buscar dados da API")
      
      const data = await response.json()

      const liveMatches = matches.map((dbMatch) => {
        const apiMatch = data.matches.find((m: any) => 
          (m.homeTeam.shortName.toLowerCase().includes(dbMatch.team_home.toLowerCase()) ||
          dbMatch.team_home.toLowerCase().includes(m.homeTeam.shortName.toLowerCase())) &&
          (m.awayTeam.shortName.toLowerCase().includes(dbMatch.team_away.toLowerCase()) ||
          dbMatch.team_away.toLowerCase().includes(m.awayTeam.shortName.toLowerCase()))
        )

        if (apiMatch) {
          return {
            ...dbMatch,
            score_home: apiMatch.score.fullTime.home !== null ? apiMatch.score.fullTime.home : dbMatch.score_home,
            score_away: apiMatch.score.fullTime.away !== null ? apiMatch.score.fullTime.away : dbMatch.score_away,
            is_finished: apiMatch.status === "FINISHED" || dbMatch.is_finished,
          }
        }
        return dbMatch
      })

      setMatches(liveMatches)
      setLastUpdate(new Date())
    } catch (error) {
      console.error("Erro ao sincronizar placares ao vivo:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchLiveScores()
    if (API_KEY) {
      const interval = setInterval(fetchLiveScores, 60000)
      return () => clearInterval(interval)
    }
  }, [])

  const predictionsByMatch = predictions.reduce((acc, pred) => {
    acc[pred.match_id] = pred
    return acc
  }, {} as Record<string, Prediction>)

  const userProfile = profiles.find((p) => p.id === userId)
  const totalPoints = userProfile?.total_points || 0
  const totalPredictions = predictions.length
  const exactPredictions = predictions.filter((p) => p.points === 10).length

  const sortedProfiles = [...profiles].sort((a, b) => b.total_points - a.total_points)
  const position = sortedProfiles.findIndex((p) => p.id === userId) + 1
  const leader = sortedProfiles.length > 0 ? sortedProfiles[0] : null

  const averagePoints = profiles.length > 0 
    ? profiles.reduce((sum, p) => sum + p.total_points, 0) / profiles.length 
    : 0

  const handlePredictionSaved = () => {
    router.refresh()
  }

  // FUNÇÕES AUXILIARES PARA EVITAR ERRO DE HIDRATAÇÃO
  const getOngoingMatches = () => {
    return matches.filter((m) => !m.is_finished && new Date(m.match_date).getTime() <= Date.now())
  }

  const getUpcomingMatches = () => {
    return matches.filter((m) => !m.is_finished && new Date(m.match_date).getTime() > Date.now())
  }
  
  const getFinishedMatches = () => {
    return matches.filter((m) => m.is_finished)
  }

  const getCurrentRound = () => {
    const upcoming = getUpcomingMatches()
    if (upcoming.length > 0) return upcoming[0].phase
    
    const finished = getFinishedMatches()
    if (finished.length > 0) return finished[finished.length - 1].phase
    
    return 'Fase de Grupos'
  }

  const ongoingMatches = getOngoingMatches()
  const upcomingMatches = getUpcomingMatches()
  const currentRound = getCurrentRound()

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 md:py-8">
      <DashboardHero 
        currentRound={currentRound}
        averagePoints={averagePoints}
        leader={leader}
        totalParticipants={profiles.length}
      />

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

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4">
         <span className="text-xs font-medium text-muted-foreground">
            {lastUpdate
              ? `Placares ao vivo atualizados às ${lastUpdate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
              : "Sincronizando com resultados reais..."}
          </span>
          <button
            onClick={fetchLiveScores}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-full hover:bg-primary/20 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Sincronizar
          </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
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
                  <h2 className="mb-4 text-lg font-semibold">Próximos Jogos</h2>
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
                    <p className="mt-4 text-muted-foreground">Você ainda não fez nenhum palpite</p>
                    <p className="text-sm text-muted-foreground">Vá para a aba Jogos e faça seus palpites!</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Ranking profiles={profiles} currentUserId={userId} compact />
          <LatestResults matches={matches} predictions={predictionsByMatch} />
        </div>
      </div>
    </main>
  )
}

'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Trophy, Users, TrendingUp, Crown } from 'lucide-react'
import { ProfileWithPoints } from '@/lib/types'

interface DashboardHeroProps {
  currentRound: string
  averagePoints: number
  leader: ProfileWithPoints | null
  totalParticipants: number
}

export function DashboardHero({ currentRound, averagePoints, leader, totalParticipants }: DashboardHeroProps) {
  return (
    <div className="mb-8">
      {/* Banner Principal */}
      <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-6 text-primary-foreground shadow-xl md:p-8">
        {/* Decorative elements */}
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-white/5" />
        <div className="absolute right-1/4 top-1/2 h-16 w-16 rounded-full bg-white/5" />
        
        <div className="relative">
          <div className="flex items-center gap-2 text-sm font-medium text-primary-foreground/80">
            <Trophy className="h-4 w-4" />
            <span>Copa do Mundo 2026</span>
          </div>
          
          <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
            {currentRound}
          </h1>
          
          <p className="mt-1 text-sm text-primary-foreground/70">
            {totalParticipants} participantes no bolão
          </p>
        </div>
      </div>

      {/* Cards de Estatísticas Rápidas */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {/* Líder */}
        <Card className="relative overflow-hidden border-2 border-accent/50 bg-gradient-to-br from-accent/10 to-accent/5">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Líder
                </p>
                <p className="mt-1 truncate text-lg font-bold text-accent-foreground">
                  {leader?.name || 'Nenhum'}
                </p>
                {leader && (
                  <p className="text-sm font-semibold text-accent">
                    {leader.total_points} pts
                  </p>
                )}
              </div>
              <div className="rounded-full bg-accent/20 p-2">
                <Crown className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Média de Pontos */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Média Geral
                </p>
                <p className="mt-1 text-lg font-bold">
                  {averagePoints.toFixed(1)}
                </p>
                <p className="text-sm text-muted-foreground">pontos</p>
              </div>
              <div className="rounded-full bg-primary/10 p-2">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Participantes */}
        <Card className="relative col-span-2 overflow-hidden md:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Participantes
                </p>
                <p className="mt-1 text-lg font-bold">
                  {totalParticipants}
                </p>
                <p className="text-sm text-muted-foreground">no bolão</p>
              </div>
              <div className="rounded-full bg-muted p-2">
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

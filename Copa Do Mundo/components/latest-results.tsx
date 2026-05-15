'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Clock, Minus } from 'lucide-react'
import { Match, Prediction } from '@/lib/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface LatestResultsProps {
  matches: Match[]
  predictions?: Record<string, Prediction>
}

export function LatestResults({ matches, predictions = {} }: LatestResultsProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  // Pegar os últimos 5 jogos finalizados, ordenados pela data mais recente
  const finishedMatches = matches
    .filter((m) => m.is_finished)
    .sort((a, b) => new Date(b.match_date).getTime() - new Date(a.match_date).getTime())
    .slice(0, 5)

  const getPointsBadge = (points: number) => {
    if (points === 10) {
      return (
        <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white">
          +10 Exato!
        </Badge>
      )
    }
    if (points === 5) {
      return (
        <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          +5 Diferenca
        </Badge>
      )
    }
    if (points === 3) {
      return (
        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          +3 Vencedor
        </Badge>
      )
    }
    return (
      <Badge variant="secondary" className="text-muted-foreground">
        0 pts
      </Badge>
    )
  }

  if (finishedMatches.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Ultimos Resultados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Clock className="h-10 w-10 text-muted-foreground/30" />
            <p className="mt-3 text-sm text-muted-foreground">
              Nenhum jogo finalizado ainda
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent pb-3">
        <CardTitle className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <span className="text-base font-bold">Ultimos Resultados</span>
            <p className="text-xs font-normal text-muted-foreground">
              Jogos finalizados recentemente
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {finishedMatches.map((match) => {
            const prediction = predictions[match.id]
            
            return (
              <div key={match.id} className="p-4 transition-colors hover:bg-muted/30">
                {/* Data e fase */}
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {mounted ? format(new Date(match.match_date), "dd MMM, HH:mm", { locale: ptBR }) : '--'}
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    {match.phase}
                  </Badge>
                </div>

                {/* Times e Placar */}
                <div className="flex items-center gap-3">
                  {/* Time da Casa */}
                  <div className="flex flex-1 items-center justify-end gap-2">
                    <span className="truncate text-sm font-medium">{match.team_home}</span>
                    <span className="text-lg">{match.flag_home}</span>
                  </div>

                  {/* Placar */}
                  <div className="flex min-w-[60px] items-center justify-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5">
                    <span className="text-lg font-bold text-primary">{match.score_home}</span>
                    <Minus className="h-3 w-3 text-primary/50" />
                    <span className="text-lg font-bold text-primary">{match.score_away}</span>
                  </div>

                  {/* Time Visitante */}
                  <div className="flex flex-1 items-center gap-2">
                    <span className="text-lg">{match.flag_away}</span>
                    <span className="truncate text-sm font-medium">{match.team_away}</span>
                  </div>
                </div>

                {/* Palpite do Usuario */}
                {prediction && (
                  <div className="mt-3 flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Seu palpite:</span>
                      <span className="font-mono text-sm font-semibold">
                        {prediction.score_home} x {prediction.score_away}
                      </span>
                    </div>
                    {getPointsBadge(prediction.points)}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

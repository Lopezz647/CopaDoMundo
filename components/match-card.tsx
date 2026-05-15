'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Match, Prediction } from '@/lib/types'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Check, Clock, Minus, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface MatchCardProps {
  match: Match
  prediction?: Prediction
  userId: string
  onPredictionSaved?: () => void
}

export function MatchCard({ match, prediction, userId, onPredictionSaved }: MatchCardProps) {
  const [scoreHome, setScoreHome] = useState<string>(prediction?.score_home?.toString() ?? '')
  const [scoreAway, setScoreAway] = useState<string>(prediction?.score_away?.toString() ?? '')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(!!prediction)
  const [mounted, setMounted] = useState(false)

  const matchDate = new Date(match.match_date)
  const isMatchStarted = new Date() >= matchDate
  const canEdit = !isMatchStarted && !match.is_finished

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (prediction) {
      setScoreHome(prediction.score_home.toString())
      setScoreAway(prediction.score_away.toString())
      setIsSaved(true)
    }
  }, [prediction])

  const handleSavePrediction = async () => {
    if (scoreHome === '' || scoreAway === '') return

    setIsLoading(true)
    const supabase = createClient()

    try {
      if (prediction) {
        await supabase
          .from('predictions')
          .update({
            score_home: parseInt(scoreHome),
            score_away: parseInt(scoreAway),
            updated_at: new Date().toISOString(),
          })
          .eq('id', prediction.id)
      } else {
        await supabase.from('predictions').insert({
          user_id: userId,
          match_id: match.id,
          score_home: parseInt(scoreHome),
          score_away: parseInt(scoreAway),
        })
      }
      setIsSaved(true)
      onPredictionSaved?.()
    } catch (error) {
      console.error('Erro ao salvar palpite:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPointsBadge = () => {
    if (!match.is_finished || !prediction) return null
    
    const points = prediction.points
    if (points === 10) {
      return (
        <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-sm">
          Placar Exato! +10
        </Badge>
      )
    } else if (points === 5) {
      return (
        <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm">
          Diferenca! +5
        </Badge>
      )
    } else if (points === 3) {
      return (
        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm">
          Vencedor! +3
        </Badge>
      )
    }
    return <Badge variant="secondary">0 pontos</Badge>
  }

  return (
    <Card className={`overflow-hidden transition-all duration-200 ${
      match.is_finished 
        ? 'border-muted bg-muted/30' 
        : 'border-border hover:border-primary/30 hover:shadow-lg'
    }`}>
      {/* Header com data e fase */}
      <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-primary/30 text-[10px] font-medium">
            {match.phase}
          </Badge>
          {match.group_stage && (
            <span className="text-[10px] text-muted-foreground">{match.group_stage}</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          {mounted ? format(matchDate, "dd MMM, HH:mm", { locale: ptBR }) : '--'}
        </div>
      </div>

      <CardContent className="p-4">
        {/* Times e Placar */}
        <div className="flex items-center gap-3">
          {/* Time da casa */}
          <div className="flex flex-1 flex-col items-center gap-1.5">
            <span className="text-3xl">{match.flag_home}</span>
            <span className="text-center text-xs font-medium leading-tight">{match.team_home}</span>
          </div>

          {/* Placar Central */}
          <div className="flex flex-col items-center gap-2">
            {match.is_finished ? (
              /* Placar Final */
              <div className="flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2">
                <span className="text-2xl font-bold text-primary">{match.score_home}</span>
                <Minus className="h-4 w-4 text-primary/40" />
                <span className="text-2xl font-bold text-primary">{match.score_away}</span>
              </div>
            ) : (
              /* Input de Palpite */
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Seu palpite
                </span>
                <div className="flex items-center gap-1.5">
                  <Input
                    type="number"
                    min="0"
                    max="99"
                    className="h-11 w-12 rounded-lg border-2 text-center text-lg font-bold transition-colors focus:border-primary"
                    value={scoreHome}
                    onChange={(e) => {
                      setScoreHome(e.target.value)
                      setIsSaved(false)
                    }}
                    disabled={!canEdit}
                  />
                  <span className="text-lg font-bold text-muted-foreground/50">:</span>
                  <Input
                    type="number"
                    min="0"
                    max="99"
                    className="h-11 w-12 rounded-lg border-2 text-center text-lg font-bold transition-colors focus:border-primary"
                    value={scoreAway}
                    onChange={(e) => {
                      setScoreAway(e.target.value)
                      setIsSaved(false)
                    }}
                    disabled={!canEdit}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Time visitante */}
          <div className="flex flex-1 flex-col items-center gap-1.5">
            <span className="text-3xl">{match.flag_away}</span>
            <span className="text-center text-xs font-medium leading-tight">{match.team_away}</span>
          </div>
        </div>

        {/* Footer: Botao ou Status */}
        <div className="mt-4 flex items-center justify-center">
          {match.is_finished ? (
            <div className="flex flex-col items-center gap-1.5">
              {prediction && (
                <span className="text-[10px] text-muted-foreground">
                  Seu palpite: {prediction.score_home} x {prediction.score_away}
                </span>
              )}
              {getPointsBadge()}
            </div>
          ) : canEdit ? (
            <Button
              onClick={handleSavePrediction}
              disabled={isLoading || scoreHome === '' || scoreAway === ''}
              size="sm"
              className={`w-full transition-all ${
                isSaved 
                  ? 'bg-primary/10 text-primary hover:bg-primary/20' 
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : isSaved ? (
                <>
                  <Check className="mr-1.5 h-4 w-4" />
                  Palpite Salvo
                </>
              ) : (
                'Confirmar Palpite'
              )}
            </Button>
          ) : (
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              <Clock className="mr-1.5 h-3 w-3" />
              Jogo ja iniciou
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

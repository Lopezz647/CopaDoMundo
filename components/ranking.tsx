'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Medal, Crown, ChevronRight } from 'lucide-react'
import { ProfileWithPoints } from '@/lib/types'

interface RankingProps {
  profiles: ProfileWithPoints[]
  currentUserId?: string
  compact?: boolean
}

export function Ranking({ profiles, currentUserId, compact = false }: RankingProps) {
  const sortedProfiles = [...profiles].sort((a, b) => b.total_points - a.total_points)
  const displayProfiles = compact ? sortedProfiles.slice(0, 5) : sortedProfiles

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 0:
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 shadow-lg shadow-amber-200/50">
            <Crown className="h-4 w-4 text-white" />
          </div>
        )
      case 1:
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gray-300 to-gray-400 shadow-lg shadow-gray-200/50">
            <Medal className="h-4 w-4 text-white" />
          </div>
        )
      case 2:
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 shadow-lg shadow-amber-200/50">
            <Medal className="h-4 w-4 text-white" />
          </div>
        )
      default:
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
            <span className="text-sm font-bold text-muted-foreground">{position + 1}</span>
          </div>
        )
    }
  }

  const getRowStyle = (position: number, isCurrentUser: boolean) => {
    let baseStyle = 'flex items-center gap-4 rounded-xl p-3 transition-all duration-200 '
    
    if (isCurrentUser) {
      baseStyle += 'ring-2 ring-primary ring-offset-2 '
    }
    
    switch (position) {
      case 0:
        return baseStyle + 'bg-gradient-to-r from-yellow-50 via-amber-50 to-yellow-50 border-2 border-amber-200/50'
      case 1:
        return baseStyle + 'bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200/50'
      case 2:
        return baseStyle + 'bg-gradient-to-r from-amber-50/50 to-orange-50/50 border border-orange-200/50'
      default:
        return baseStyle + 'bg-card hover:bg-muted/50 border border-transparent'
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Trophy className="h-5 w-5 text-primary" />
          </div>
          <div>
            <span className="text-lg font-bold">Ranking do Bolão</span>
            <p className="text-xs font-normal text-muted-foreground">
              Classificacao geral dos participantes
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {sortedProfiles.length === 0 ? (
          <div className="py-8 text-center">
            <Trophy className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <p className="mt-3 text-muted-foreground">Nenhum participante ainda</p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayProfiles.map((profile, index) => {
              const isCurrentUser = profile.id === currentUserId
              return (
                <div
                  key={profile.id}
                  className={getRowStyle(index, isCurrentUser)}
                >
                  {/* Posicao */}
                  {getMedalIcon(index)}
                  
                  {/* Info do Jogador */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`truncate font-semibold ${isCurrentUser ? 'text-primary' : ''}`}>
                        {profile.name}
                      </p>
                      {isCurrentUser && (
                        <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                          Voce
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{profile.department}</p>
                  </div>
                  
                  {/* Pontos */}
                  <div className="text-right">
                    <p className={`text-xl font-bold ${index === 0 ? 'text-amber-600' : index === 1 ? 'text-gray-500' : index === 2 ? 'text-amber-700' : 'text-foreground'}`}>
                      {profile.total_points}
                    </p>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      pontos
                    </p>
                  </div>
                </div>
              )
            })}
            
            {compact && sortedProfiles.length > 5 && (
              <button className="flex w-full items-center justify-center gap-1 rounded-lg py-2 text-sm font-medium text-primary hover:bg-primary/5">
                Ver todos os {sortedProfiles.length} participantes
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

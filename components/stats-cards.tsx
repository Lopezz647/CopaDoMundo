'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Target, Trophy, Calendar, TrendingUp } from 'lucide-react'

interface StatsCardsProps {
  totalPoints: number
  totalPredictions: number
  exactPredictions: number
  position: number
  totalParticipants?: number
}

export function StatsCards({ 
  totalPoints, 
  totalPredictions, 
  exactPredictions, 
  position,
  totalParticipants = 0
}: StatsCardsProps) {
  const stats = [
    {
      label: 'Seus Pontos',
      value: totalPoints,
      icon: Trophy,
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50',
      textColor: 'text-amber-600',
    },
    {
      label: 'Sua Posicao',
      value: position > 0 ? `${position}º` : '-',
      subValue: totalParticipants > 0 ? `de ${totalParticipants}` : undefined,
      icon: TrendingUp,
      gradient: 'from-primary to-emerald-600',
      bgGradient: 'from-emerald-50 to-green-50',
      textColor: 'text-primary',
    },
    {
      label: 'Palpites',
      value: totalPredictions,
      icon: Calendar,
      gradient: 'from-blue-500 to-indigo-500',
      bgGradient: 'from-blue-50 to-indigo-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Placares Exatos',
      value: exactPredictions,
      icon: Target,
      gradient: 'from-pink-500 to-rose-500',
      bgGradient: 'from-pink-50 to-rose-50',
      textColor: 'text-pink-600',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      {stats.map((stat) => (
        <Card 
          key={stat.label} 
          className={`relative overflow-hidden border-0 bg-gradient-to-br ${stat.bgGradient} shadow-sm`}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {stat.label}
                </p>
                <div className="mt-1 flex items-baseline gap-1">
                  <p className={`text-2xl font-bold ${stat.textColor}`}>
                    {stat.value}
                  </p>
                  {stat.subValue && (
                    <span className="text-xs text-muted-foreground">{stat.subValue}</span>
                  )}
                </div>
              </div>
              <div className={`shrink-0 rounded-lg bg-gradient-to-br ${stat.gradient} p-2 shadow-lg`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

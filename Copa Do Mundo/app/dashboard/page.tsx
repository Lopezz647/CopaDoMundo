import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { DashboardContent } from '@/components/dashboard-content'
import { Match, Prediction, Profile } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Buscar perfil do usuário
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Buscar todos os jogos
  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .order('match_date', { ascending: true })

  // Buscar palpites do usuário
  const { data: predictions } = await supabase
    .from('predictions')
    .select('*')
    .eq('user_id', user.id)

  // Buscar todos os perfis com pontos
  const { data: allProfiles } = await supabase
    .from('profiles')
    .select('*')

  // Buscar todas as predições para calcular pontos
  const { data: allPredictions } = await supabase
    .from('predictions')
    .select('*')

  // Calcular pontos totais por usuário
  const profilesWithPoints = (allProfiles || []).map((p: Profile) => {
    const userPredictions = (allPredictions || []).filter(
      (pred: Prediction) => pred.user_id === p.id
    )
    const totalPoints = userPredictions.reduce(
      (sum: number, pred: Prediction) => sum + (pred.points || 0),
      0
    )
    return { ...p, total_points: totalPoints }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
      <Header userName={profile?.name || user.email} />
      <DashboardContent
        userId={user.id}
        matches={(matches as Match[]) || []}
        predictions={(predictions as Prediction[]) || []}
        profiles={profilesWithPoints}
      />
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Trophy, Target, Users, Award, ChevronRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Trophy className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold">{"Bolao DRH-1"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/auth/login">Entrar</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/auth/sign-up">Criar conta</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm shadow-sm">
              <Sparkles className="h-4 w-4 text-accent" />
              <span>Copa do Mundo 2026</span>
            </div>

            {/* Trophy Icon */}
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent/80 shadow-xl shadow-accent/30 md:h-24 md:w-24">
              <Trophy className="h-10 w-10 text-accent-foreground md:h-12 md:w-12" />
            </div>
            
            <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight md:text-6xl">
              {"Bolao Copa"} <span className="text-primary">DRH-1</span>
            </h1>
            
            <p className="mx-auto mb-8 max-w-xl text-pretty text-lg text-muted-foreground md:text-xl">
              Participe do bolao do setor! Faca seus palpites, acompanhe o ranking e dispute com seus colegas quem acerta mais resultados.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="gap-2 text-base shadow-lg shadow-primary/25">
                <Link href="/auth/sign-up">
                  Participar do Bolao
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link href="/auth/login">Ja tenho conta</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/30 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-2xl font-bold md:text-3xl">Como funciona</h2>
            <p className="text-muted-foreground">Simples, rapido e divertido</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-0 bg-card shadow-lg">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Faca seus palpites</h3>
                <p className="text-sm text-muted-foreground">
                  De seus palpites para cada jogo da Copa antes do inicio das partidas.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card shadow-lg">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Ganhe pontos</h3>
                <p className="text-sm text-muted-foreground">
                  Placar exato: 10 pts | Diferenca: 5 pts | Vencedor: 3 pts
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card shadow-lg">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Acompanhe o ranking</h3>
                <p className="text-sm text-muted-foreground">
                  Veja sua posicao e compare seus resultados com os colegas do DRH-1.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary to-primary/80 shadow-2xl">
            <CardContent className="flex flex-col items-center gap-6 p-8 text-center text-primary-foreground md:p-12">
              <Trophy className="h-12 w-12" />
              <div>
                <h2 className="mb-2 text-2xl font-bold md:text-3xl">Pronto para participar?</h2>
                <p className="text-primary-foreground/80">
                  Crie sua conta agora e comece a fazer seus palpites
                </p>
              </div>
              <Button asChild size="lg" variant="secondary" className="gap-2 text-base">
                <Link href="/auth/sign-up">
                  Comecar agora
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-center md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
              <Trophy className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium">{"Bolao Copa DRH-1"}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/regras" 
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Ver regras
            </Link>
            <span className="text-sm text-muted-foreground">
              Copa do Mundo 2026
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}

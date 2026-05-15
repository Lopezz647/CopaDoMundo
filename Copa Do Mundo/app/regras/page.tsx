import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trophy, Target, Award, Users, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function RegrasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 py-12">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-8">
          <Button
            asChild
            variant="ghost"
            className="mb-4 text-emerald-200 hover:bg-emerald-700 hover:text-white"
          >
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>

          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Regras do Bolão</h1>
              <p className="text-emerald-200">{"Bolão Copa DRH-1"} - Copa 2026</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Sistema de Pontuação */}
          <Card className="border-emerald-700 bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <Award className="h-5 w-5" />
                Sistema de Pontuação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white font-bold">
                    10
                  </div>
                  <div>
                    <p className="font-semibold text-amber-800">Placar Exato</p>
                    <p className="text-sm text-amber-600">Acertar o placar exato do jogo</p>
                    <p className="text-xs text-amber-500">{"Ex: Palpite 2x1, Resultado 2x1"}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white font-bold">
                    5
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-800">Resultado Certo</p>
                    <p className="text-sm text-emerald-600">Acertar vitória/empate com diferença de gols correta</p>
                    <p className="text-xs text-emerald-500">{"Ex: Palpite 3x1, Resultado 2x0 (ambos vitória por 2)"}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-blue-800">Vencedor Certo</p>
                    <p className="text-sm text-blue-600">Acertar apenas o vencedor do jogo</p>
                    <p className="text-xs text-blue-500">{"Ex: Palpite 3x0, Resultado 1x0 (ambos vitória do mandante)"}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400 text-white font-bold">
                    0
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Nenhum Acerto</p>
                    <p className="text-sm text-gray-600">{"Não acertou nenhum dos critérios acima"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Como Participar */}
          <Card className="border-emerald-700 bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <Target className="h-5 w-5" />
                Como Participar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  'Crie sua conta com e-mail e senha',
                  'Confirme seu e-mail clicando no link enviado',
                  'Acesse o dashboard e veja os jogos disponíveis',
                  'Faça seus palpites antes do início de cada jogo',
                  'Acompanhe seus pontos e posição no ranking',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Regras Gerais */}
          <Card className="border-emerald-700 bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <Users className="h-5 w-5" />
                Regras Gerais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600">1.</span>
                  Os palpites devem ser feitos antes do início de cada jogo
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600">2.</span>
                  Após o início do jogo, o palpite fica bloqueado
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600">3.</span>
                  É permitido alterar palpites enquanto o jogo não começou
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600">4.</span>
                  O ranking é atualizado após cada jogo
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600">5.</span>
                  Em caso de empate no ranking, o critério de desempate é o número de placares exatos
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button
            asChild
            size="lg"
            className="bg-amber-500 font-semibold hover:bg-amber-600"
          >
            <Link href="/auth/sign-up">Participar Agora</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

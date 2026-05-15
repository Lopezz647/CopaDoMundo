import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trophy, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">{"Bolão Copa DRH-1"}</h1>
          </div>
          <Card className="border-emerald-700 bg-white/95 backdrop-blur">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl text-emerald-900">Erro na autenticação</CardTitle>
              <CardDescription>
                Ocorreu um erro durante a autenticação. Por favor, tente novamente.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/auth/login">Voltar para o login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

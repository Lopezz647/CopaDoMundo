import { NextResponse } from 'next/server'

export async function GET() {
  const API_KEY = process.env.NEXT_PUBLIC_API_TOKEN

  if (!API_KEY) {
    return NextResponse.json({ error: 'Chave da API não configurada' }, { status: 401 })
  }

  try {
    const res = await fetch('https://api.football-data.org/v4/competitions/BSA/matches', {
      headers: { 'X-Auth-Token': API_KEY },
      next: { revalidate: 60 }
    })

    if (!res.ok) throw new Error('Falha no football-data')

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao buscar placares' }, { status: 500 })
  }
}

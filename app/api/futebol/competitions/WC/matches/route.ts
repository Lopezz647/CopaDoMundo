// app/api/futebol/competitions/WC/matches/route.ts
import { NextResponse } from 'next/server';


// Adicione esta linha para impedir que o Next.js congele a sua API para sempre
export const dynamic = 'force-dynamic';

export async function GET() {
  const API_KEY = process.env.NEXT_PUBLIC_API_TOKEN

  if (!API_KEY) {
    return NextResponse.json(
      { error: 'Token não configurado' },
      { status: 500 }
    )
  }

  try {
    const res = await fetch(
      'https://api.football-data.org/v4/competitions/WC/matches',
      {
        headers: {
          'X-Auth-Token': API_KEY,
        },
        next: { revalidate: 900 }, // ISR: revalidate a cada 60 segundos
      }
    )

    if (!res.ok) {
      const errorText = await res.text()
      console.error(`❌ ERRO FOOTBALL-DATA (Status ${res.status}):`, errorText)
      throw new Error(`Falha na API: Status ${res.status}`)
    }

    const data = await res.json()
    console.log(`✅ Sucesso! Foram encontrados ${data.matches?.length || 0} jogos.`)
    
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("❌ ERRO NO BACKEND:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

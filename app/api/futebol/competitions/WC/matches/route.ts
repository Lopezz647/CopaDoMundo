// app/api/futebol/competitions/WC/matches/route.ts
import { NextResponse } from 'next/server';

// Força a rota a ser dinâmica e fura o cache definitivo do Next.js
export const dynamic = 'force-dynamic';

export async function GET() {
  const API_KEY = process.env.FOOTBALL_API_KEY;

  if (!API_KEY) {
    return NextResponse.json(
      { error: 'Token não configurado' },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      'https://api.football-data.org/v4/competitions/WC/matches',
      {
        headers: {
          'X-Auth-Token': API_KEY,
        },
        next: { revalidate: 900 }, // Fallback de segurança para 15 minutos
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ ERRO FOOTBALL-DATA (Status ${res.status}):`, errorText);
      throw new Error(`Falha na API: Status ${res.status}`);
    }

    const data = await res.json();
    console.log(`✅ Sucesso! Foram encontrados ${data.matches?.length || 0} jogos.`);
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("❌ ERRO NO BACKEND:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Força a rota a ser sempre renderizada no servidor
export const dynamic = 'force-dynamic';
// Força o Next.js a nunca fazer cache de nenhum fetch neste arquivo
export const fetchCache = 'force-no-store';

import { NextResponse } from 'next/server';

export async function GET() {
  const API_KEY = process.env.FOOTBALL_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: 'Token não configurado' }, { status: 500 });
  }

  try {
    const res = await fetch(
      'https://api.football-data.org/v4/competitions/WC/matches',
      {
        headers: {
          'X-Auth-Token': API_KEY,
          // Os 3 cabeçalhos abaixo obrigam qualquer CDN (Cloudflare, Vercel, etc.) a ir buscar o dado original
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        cache: 'no-store'
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ ERRO FOOTBALL-DATA (Status ${res.status}):`, errorText);
      throw new Error(`Falha na API: Status ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error("❌ ERRO NO BACKEND:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

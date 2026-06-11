// Camada 1: Desliga o cache da rota na Vercel
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function GET() {
  const API_KEY = process.env.FOOTBALL_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: 'Token não configurado' }, { status: 500 });
  }

  try {
    // Camada 2: ?nocache= força a API externa a responder dado novo
    const res = await fetch(
      `https://api.football-data.org/v4/competitions/WC/matches?nocache=${Date.now()}`,
      {
        headers: {
          'X-Auth-Token': API_KEY,
        },
        // Camada 3: Desliga o "Data Cache" interno do Next.js para este fetch específico
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

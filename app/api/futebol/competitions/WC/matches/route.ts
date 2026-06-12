export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  // 1. INICIALIZAÇÃO MOVIDA PARA DENTRO DA FUNÇÃO
  // O Next.js não vai tentar ler isto durante o 'npm run build'
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
     return NextResponse.json({ error: 'Configuração do Supabase ausente no servidor' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

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
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        cache: 'no-store'
      }
    );

    if (!res.ok) {
      throw new Error(`Falha na API: Status ${res.status}`);
    }

    const data = await res.json();

    if (data.matches && Array.isArray(data.matches)) {
      const matchesToUpsert = data.matches.map((match: any) => ({
        id: match.id,
        competition_id: match.competition?.id ? String(match.competition.id) : 'WC',
        competition_name: match.competition?.name || 'FIFA World Cup',
        home_team: match.homeTeam?.name || 'A definir',
        away_team: match.awayTeam?.name || 'A definir',
        home_team_crest: match.homeTeam?.crest || null,
        away_team_crest: match.awayTeam?.crest || null,
        match_date: match.utcDate,
        status: match.status,
        score_home: match.score?.fullTime?.home ?? match.score?.regularTime?.home ?? null,
        score_away: match.score?.fullTime?.away ?? match.score?.regularTime?.away ?? null,
        stage: match.stage || null,
        matchday: match.matchday || null,
        last_updated: new Date().toISOString()
      }));

      const { error: dbError } = await supabase
        .from('matches')
        .upsert(matchesToUpsert, { onConflict: 'id' });

      if (dbError) {
        console.error("❌ ERRO AO ATUALIZAR SUPABASE:", dbError.message);
      }
    }

    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error("❌ ERRO NO BACKEND:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

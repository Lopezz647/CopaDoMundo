export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inicializa o Supabase com a Chave de Serviço para ter poderes de gravação (ignora RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export async function GET() {
  const API_KEY = process.env.FOOTBALL_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: 'Token não configurado' }, { status: 500 });
  }

  try {
    // 1. Busca os dados reais da API de Futebol
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

        // 2. A MÁGICA DA SINCRONIZAÇÃO: Envia para a tabela 'matches' no Supabase
    if (data.matches && Array.isArray(data.matches)) {
      // Formata os dados EXATAMENTE como a sua tabela SQL exige
      const matchesToUpsert = data.matches.map((match: any) => ({
        id: match.id, // bigint
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
        last_updated: new Date().toISOString() // Força a atualização do horário no índice
      }));

      // Upsert: Atualiza os dados no banco
      const { error: dbError } = await supabase
        .from('matches')
        .upsert(matchesToUpsert, { onConflict: 'id' });

      if (dbError) {
        console.error("❌ ERRO AO ATUALIZAR SUPABASE:", dbError.message);
      } else {
        console.log(`✅ [SYNC] ${matchesToUpsert.length} partidas sincronizadas com a tabela matches.`);
      }
    }


    // 3. Devolve os dados para o Front-end normalmente
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error("❌ ERRO NO BACKEND:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

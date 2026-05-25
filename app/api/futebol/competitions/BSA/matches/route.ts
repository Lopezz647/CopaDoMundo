import { NextResponse } from 'next/server';

export async function GET() {
  const API_KEY = process.env.NEXT_PUBLIC_API_TOKEN;
  // O ID da Copa do Mundo na API-Football (verifique na doc qual o ID exato de 2026, geralmente é 1)
  const LEAGUE_ID = 1; 
  const SEASON = 2026;

  try {
    const response = await fetch(
      `https://v3.football.api-sports.io/fixtures?league=${LEAGUE_ID}&season=${SEASON}`,
      {
        headers: {
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': 'v3.football.api-sports.io',
        },
        // Adicione revalidação para a API não bater toda hora (Cache de 1 hora)
        next: { revalidate: 3600 } 
      }
    );

    const data = await response.json();
    const matches = data.response;

    // Organizar os dados: Fase -> Data -> Jogos
    const groupedMatches = matches.reduce((acc: any, match: any) => {
      // 1. Pega a fase da API (Ex: "Group Stage - 1")
      // Podemos traduzir ou usar direto. Ex: "Fase de Grupos - 1"
      let phase = match.league.round.replace("Group Stage", "Fase de Grupos"); 
      
      // 2. Extrai apenas a data no formato YYYY-MM-DD
      const date = match.fixture.date.split('T')[0];

      // Inicializa a fase se não existir
      if (!acc[phase]) {
        acc[phase] = {};
      }

      // Inicializa a data dentro da fase se não existir
      if (!acc[phase][date]) {
        acc[phase][date] = [];
      }

      // Adiciona o jogo à lista daquele dia
      acc[phase][date].push(match);

      return acc;
    }, {});

    return NextResponse.json(groupedMatches);

  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar jogos' }, { status: 500 });
  }
}

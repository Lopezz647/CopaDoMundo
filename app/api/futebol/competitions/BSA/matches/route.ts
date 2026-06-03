import { NextResponse } from 'next/server'



export async function GET() {
  const API_KEY = process.env.NEXT_PUBLIC_API_TOKEN

  if (!API_KEY) {
    console.error("❌ ERRO: O Token da API não foi encontrado nas variáveis de ambiente.")
    return NextResponse.json({ error: 'Chave da API não configurada' }, { status: 401 })
  }

  try {
    const res = await fetch('https://api.football-data.org/v4/competitions/WC/matches', {
      headers: { 'X-Auth-Token': API_KEY },
      next: { revalidate: 60 }
    })

    if (!res.ok) {
      // Aqui vamos capturar o erro exato que a API externa retornou (ex: 403 Forbidden, 429 Too Many Requests)
      const errorText = await res.text();
      console.error(`❌ ERRO FOOTBALL-DATA (Status ${res.status}):`, errorText);
      throw new Error(`Falha na API: Status ${res.status}`);
    }

    const data = await res.json()
    // --- INÍCIO DO MOCK (MÁQUINA DO TEMPO) ---
    const minutosAdicionais = 25; 

    const jogoFalso = {
      id: 999991,
      competition: { id: "WC", name: "FIFA World Cup" },
      homeTeam: { name: "Brasil", shortName: "BRA", crest: "https://crests.football-data.org/764.svg" },
      awayTeam: { name: "Argentina", shortName: "ARG", crest: "https://crests.football-data.org/762.png" },
      utcDate: new Date(Date.now() + minutosAdicionais * 60000).toISOString(), 
      status: "FINISHED",
      score: {
        fullTime: {home: 3, away: 1}
      }
    };

    // Garante que o array existe e injeta o jogo falso no topo
    if (data.matches) {
      data.matches.unshift(jogoFalso);
    }
    // --- FIM DO MOCK ---
    
    // Log para confirmar que os dados chegaram no servidor
    console.log(`✅ Sucesso! Foram encontrados ${data.matches?.length || 0} jogos na API.`);
    
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("❌ ERRO NO BACKEND:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

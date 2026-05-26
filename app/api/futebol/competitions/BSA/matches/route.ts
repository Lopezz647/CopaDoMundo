import { NextResponse } from 'next/server'

export async function GET() {
  const API_KEY = process.env.NEXT_PUBLIC_API_TOKEN

  if (!API_KEY) {
    console.error("❌ ERRO: O Token da API não foi encontrado nas variáveis de ambiente.")
    return NextResponse.json({ error: 'Chave da API não configurada' }, { status: 401 })
  }

  try {
    const res = await fetch('https://api.football-data.org/v4/competitions/BSA/matches', {
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
    
    // Log para confirmar que os dados chegaram no servidor
    console.log(`✅ Sucesso! Foram encontrados ${data.matches?.length || 0} jogos na API.`);
    
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("❌ ERRO NO BACKEND:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
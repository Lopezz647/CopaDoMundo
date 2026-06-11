export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import https from 'https';

// Adicionamos a tipagem de retorno aqui
export async function GET(): Promise<NextResponse> {
  const API_KEY = process.env.FOOTBALL_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: 'Token não configurado' }, { status: 500 });
  }

  // E tipamos a Promise aqui
  return new Promise<NextResponse>((resolve) => {
    const req = https.get(
      'https://api.football-data.org/v4/competitions/WC/matches',
      {
        headers: {
          'X-Auth-Token': API_KEY,
          'Cache-Control': 'no-cache'
        }
      },
      (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const parsedData = JSON.parse(data);
            resolve(NextResponse.json(parsedData));
          } catch (e) {
            resolve(NextResponse.json({ error: 'Erro ao processar dados da API' }, { status: 500 }));
          }
        });
      }
    );

    req.on('error', (error) => {
      console.error("❌ ERRO NATIVO NO BACKEND:", error.message);
      resolve(NextResponse.json({ error: error.message }, { status: 500 }));
    });
  });
}

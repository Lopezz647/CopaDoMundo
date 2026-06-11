export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import https from 'https'; // Módulo nativo do Node.js, não precisa instalar nada

export async function GET() {
  const API_KEY = process.env.FOOTBALL_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: 'Token não configurado' }, { status: 500 });
  }

  return new Promise((resolve) => {
    // Fazemos a requisição diretamente pela base do servidor, ignorando o Next.js
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

        // Recebe os pacotes de dados
        res.on('data', (chunk) => {
          data += chunk;
        });

        // Quando terminar de receber, monta o JSON e devolve para o site
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

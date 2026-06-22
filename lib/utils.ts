import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// === DICIONÁRIO DE TRADUÇÃO GLOBAL ===
export const TIME_TRADUCOES: Record<string, string> = {
  "Argentina": "Argentina",
  "Brazil": "Brasil",
  "France": "França",
  "Germany": "Alemanha",
  "Spain": "Espanha",
  "England": "Inglaterra",
  "Portugal": "Portugal",
  "Netherlands": "Países Baixos",
  "Belgium": "Bélgica",
  "Croatia": "Croácia",
  "Uruguay": "Uruguai",
  "Mexico": "México",
  "Morocco": "Marrocos",
  "Japan": "Japão",
  "South Korea": "Coreia do Sul",
  "Switzerland": "Suíça",
  "USA": "EUA",
  "United States": "Estados Unidos",
  "Senegal": "Senegal",
  "Ecuador": "Equador",
  "Qatar": "Catar",
  "Saudi Arabia": "Arábia Saudita",
  "Iran": "Irã",
  "Australia": "Austrália",
  "Tunisia": "Tunísia",
  "Poland": "Polônia",
  "Denmark": "Dinamarca",
  "Canada": "Canadá",
  "Costa Rica": "Costa Rica",
  "Ghana": "Gana",
  "Cameroon": "Camarões",
  "Serbia": "Sérvia",
  "Wales": "País de Gales"
};

export function traduzirTime(nomeTime: string | undefined): string {
  if (!nomeTime) return "A Definir";
  return TIME_TRADUCOES[nomeTime] || nomeTime;
}

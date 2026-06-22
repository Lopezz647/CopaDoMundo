import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// === DICIONÁRIO DE TRADUÇÃO GLOBAL ===
export const TIME_TRADUCOES: Record<string, string> = {
  // América do Sul (CONMEBOL)
  "Argentina": "Argentina",
  "Brazil": "Brasil",
  "Uruguay": "Uruguai",
  "Colombia": "Colômbia",
  "Chile": "Chile",
  "Peru": "Peru",
  "Ecuador": "Equador",
  "Paraguay": "Paraguai",
  "Venezuela": "Venezuela",
  "Bolivia": "Bolívia",

  // Europa (UEFA)
  "France": "França",
  "Germany": "Alemanha",
  "Spain": "Espanha",
  "England": "Inglaterra",
  "Portugal": "Portugal",
  "Netherlands": "Países Baixos",
  "Belgium": "Bélgica",
  "Croatia": "Croácia",
  "Italy": "Itália",
  "Switzerland": "Suíça",
  "Denmark": "Dinamarca",
  "Serbia": "Sérvia",
  "Poland": "Polônia",
  "Wales": "País de Gales",
  "Sweden": "Suécia",
  "Norway": "Noruega",
  "Scotland": "Escócia",
  "Ukraine": "Ucrânia",
  "Austria": "Áustria",
  "Czechia": "Chéquia",
  "Czech Republic": "República Tcheca",
  "Hungary": "Hungria",
  "Turkey": "Turquia",
  "Türkiye": "Turquia",
  "Slovakia": "Eslováquia",
  "Romania": "Romênia",
  "Greece": "Grécia",
  "Republic of Ireland": "Irlanda",

  // América do Norte, Central e Caribe (CONCACAF)
  "USA": "Estados Unidos",
  "United States": "Estados Unidos",
  "Mexico": "México",
  "Canada": "Canadá",
  "Costa Rica": "Costa Rica",
  "Panama": "Panamá",
  "Jamaica": "Jamaica",
  "Honduras": "Honduras",
  "El Salvador": "El Salvador",
  "Haiti": "Haiti",
  "Trinidad and Tobago": "Trinidad e Tobago",

  // África (CAF)
  "Morocco": "Marrocos",
  "Senegal": "Senegal",
  "Cameroon": "Camarões",
  "Ghana": "Gana",
  "Tunisia": "Tunísia",
  "Nigeria": "Nigéria",
  "Egypt": "Egito",
  "Algeria": "Argélia",
  "Ivory Coast": "Costa do Marfim",
  "Côte d'Ivoire": "Costa do Marfim",
  "Mali": "Mali",
  "South Africa": "África do Sul",
  "Burkina Faso": "Burkina Faso",
  "DR Congo": "RD Congo",

  // Ásia (AFC)
  "Japan": "Japão",
  "South Korea": "Coreia do Sul",
  "Korea Republic": "Coreia do Sul",
  "Saudi Arabia": "Arábia Saudita",
  "Iran": "Irã",
  "Australia": "Austrália", // Joga as eliminatórias pela Ásia
  "Qatar": "Catar",
  "United Arab Emirates": "Emirados Árabes Unidos",
  "UAE": "Emirados Árabes Unidos",
  "Iraq": "Iraque",
  "Uzbekistan": "Uzbequistão",
  "China PR": "China",
  "Oman": "Omã",
  "Syria": "Síria",

  // Oceania (OFC)
  "New Zealand": "Nova Zelândia"
};

export function traduzirTime(nomeTime: string | undefined): string {
  if (!nomeTime) return "A Definir";
  return TIME_TRADUCOES[nomeTime] || nomeTime;
}

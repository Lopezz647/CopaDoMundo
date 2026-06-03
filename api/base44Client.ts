import { createClient } from '@supabase/supabase-js';

// Pegamos as variáveis de ambiente que o Next.js carrega do .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Variáveis de ambiente do Supabase não encontradas!");
}

// O createClient oficial espera exatamente 2 argumentos: URL e KEY
export const base44 = createClient(supabaseUrl, supabaseAnonKey);

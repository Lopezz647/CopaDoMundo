"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client'; // Ajuste o caminho se a sua configuração do Supabase estiver em outro lugar

// Definindo o formato do contexto para Typescript (ajuste conforme necessário)
const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // 1. Busca a sessão inicial logo que a página carrega
    const checkActiveSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session?.user && !error) {
        setUser(session.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoadingAuth(false);
    };

    checkActiveSession();

    // 2. Fica escutando qualquer mudança de login/logout em tempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setIsAuthenticated(!!session?.user);
      setIsLoadingAuth(false);
    });

    // Limpeza do listener quando o componente for desmontado
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    setIsLoadingAuth(true);
    await supabase.auth.signOut();
    window.location.href = '/login'; // Força o recarregamento total da página limpando o estado
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

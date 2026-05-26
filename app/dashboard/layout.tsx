"use client"; // Precisamos transformar o layout em client component para ler o contexto

import React, { useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/path/to/your/AuthContext"; // Ajuste o caminho do import correto do seu contexto
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoadingAuth, authChecked, navigateToLogin } = useAuth();

  useEffect(() => {
    // Se a verificação já terminou e o usuário NÃO está autenticado, chuta pro login
    if (authChecked && !isAuthenticated) {
      navigateToLogin(); 
      // ou window.location.href = "/login" se o navigateToLogin do base44 falhar
    }
  }, [isAuthenticated, authChecked, navigateToLogin]);

  // Enquanto estiver checando se a pessoa é válida, mostra uma tela de carregamento (Evita o "piscar" do dashboard falso)
  if (isLoadingAuth || !authChecked) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
         <Loader2 className="w-10 h-10 animate-spin text-[#4edea3]" />
      </div>
    );
  }

  // Se o código chegou até aqui, é porque a pessoa não apenas passou da checagem, como está autenticada
  return (
    <div className="dashboard-theme flex h-screen w-full bg-background text-foreground overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

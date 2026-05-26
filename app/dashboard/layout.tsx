"use client";

import React, { useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/lib/AuthContext";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import GhostGuard from "@/components/layout/GhostGuard";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <GhostGuard>
      {/* Tudo que já estava dentro do seu layout fica aqui dentro */}
      <div className="flex h-screen bg-black text-white">
         <Sidebar /> 
         <main className="flex-1 overflow-y-auto">
            {children}
         </main>
      </div>
    </GhostGuard>
  );
}
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Se a checagem terminou e a pessoa NÃO está logada, redireciona para o login
    if (!isLoadingAuth && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoadingAuth, router]);

  // Enquanto o Supabase pensa, mostra a tela de carregamento
  if (isLoadingAuth) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
         <Loader2 className="w-10 h-10 animate-spin text-[#4edea3]" />
      </div>
    );
  }

  // Evita que a tela do dashboard "pisque" antes de jogar o intruso pro login
  if (!isAuthenticated) {
    return null; 
  }

  // Se tudo deu certo e o Supabase confirmou, renderiza o sistema:
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

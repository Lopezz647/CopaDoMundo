"use client";

import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import GhostGuard from "@/components/layout/GhostGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 1. O GhostGuard valida se a conta existe de verdade no banco de dados public.profiles
    <GhostGuard>
      {/* 2. Mantemos a estilização oficial com as classes e o fundo do 'dashboard-theme' */}
      <div className="dashboard-theme flex h-screen w-full bg-background text-foreground overflow-hidden">
        
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
        
      </div>
    </GhostGuard>
  );
}
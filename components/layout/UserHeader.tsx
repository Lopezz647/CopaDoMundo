"use client";
import React from "react";

export default function UserHeader() {
  // TODO: Substituir pela chamada real da sessão do Supabase no futuro
  const user = { full_name: "Usuário", email: "usuario@email.com" };

  return (
    <header className="flex items-center gap-4 mb-6 relative">
      {/* Avatar com a bolinha online */}
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-[#1e4d35] flex items-center justify-center border-2 border-[#0d0d0d]">
          <span className="text-[#4edea3] font-bold text-sm">
            {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
          </span>
        </div>
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#eebb4d] rounded-full border-2 border-[#0d0d0d]"></div>
      </div>

      {/* Saudação */}
      <div className="flex flex-col">
        <span className="text-[13px] text-[#8a9a8e] font-medium">Bem-vindo(a) de volta,</span>
        <h2 className="text-[15px] font-bold text-[#e5e2e1]">
          {user?.full_name || "Membro"}
        </h2>
      </div>
    </header>
  );
}

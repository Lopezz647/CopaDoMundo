import React from "react";
import { useAuth } from "@/lib/AuthContext";

export default function UserHeader() {
  const { user } = useAuth();

  return (
    <header className="flex items-center gap-4 mb-6 relative">
      {/* Avatar with yellow online dot */}
      <div className="relative flex-shrink-0">
        <div className="w-11 h-11 rounded-full bg-[#2a4a38] border-2 border-[#4edea3]/50 flex items-center justify-center overflow-hidden">
          <span className="material-symbols-outlined text-[#4edea3] text-[22px]">person</span>
        </div>
        {/* Yellow dot */}
        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#ffb95f] border-2 border-[#0d0d0d]" />
      </div>

      <div className="flex flex-col">
        <span className="text-[15px] font-bold text-[#e5e2e1] leading-tight">{user?.full_name || "Aquila"}</span>
        <span className="text-[12px] text-[#8a9a8e]">{user?.email || "+55 31 98863-5537"}</span>
      </div>

      {/* "Insira sua foto" green badge */}
      <div className="absolute left-0 -bottom-7">
        <div className="bg-[#4edea3] text-[#003824] text-[11px] font-bold px-3 py-1 rounded-md cursor-pointer hover:bg-[#3dc990] transition-colors">
          Insira sua foto
        </div>
      </div>
    </header>
  );
}

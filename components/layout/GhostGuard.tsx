"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function GhostGuard({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [isSafe, setIsSafe] = useState(false);

  useEffect(() => {
    async function verifyProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        window.location.href = "/auth/login";
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!profile) {
        console.warn("Usuário Fantasma Detectado! Expulsando...");
        await supabase.auth.signOut();
        window.location.href = "/auth/login";
        return;
      }

      setIsSafe(true);
    }

    verifyProfile();
  }, [supabase]);

  if (!isSafe) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0d0d0d]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#4edea3]" />
          <p className="text-[#8a9a8e] text-sm font-medium">Validando segurança da conta...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
"use client";

import React, { useEffect, useState } from "react";
import { Users, User, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";

export default function Membros() {
  const supabase = createClient();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMembers() {
      // Busca a lista real de usuários com suas fotos organizados em ordem alfabética
      const { data } = await supabase
        .from("profiles")
        .select("id, name, avatar_url")
        .order("name", { ascending: true });

      if (data) setMembers(data);
      setLoading(false);
    }
    fetchMembers();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Users className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Membros do Bolão</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {members.map((member, idx) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-card rounded-xl border border-border p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors"
          >
            {/* Exibição da foto com alinhamento focado na face */}
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-white/5 flex-shrink-0">
              {member.avatar_url ? (
                <img 
                  src={member.avatar_url} 
                  alt={member.name} 
                  className="w-full h-full object-cover object-[center_25%]" 
                />
              ) : (
                <User className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{member.name || "Competidor"}</p>
              <p className="text-xs text-muted-foreground">Participante ativo</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

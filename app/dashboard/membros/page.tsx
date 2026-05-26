"use client";
import React, { useEffect, useState } from "react";
import { Users, User, Trophy, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui-dashboard/badge";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

export default function Membros() {
  const supabase = createClient();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMembers() {
      try {
        // Busca todos os perfis cadastrados no Supabase e ordena por nome
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .order("name", { ascending: true });

        if (error) throw error;
        
        if (data) {
          setMembers(data);
        }
      } catch (error) {
        console.error("Erro ao buscar membros:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMembers();
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Membros</h1>
        </div>
        <Badge variant="outline" className="text-muted-foreground border-white/10">
          {loading ? (
            <Loader2 className="w-3 h-3 animate-spin inline mr-1" />
          ) : (
            members.length
          )}{" "}
          participantes
        </Badge>
      </div>

      <div className="grid gap-3">
        {loading ? (
          // Efeito de carregamento enquanto busca os dados
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
            <p className="text-sm">Carregando membros do grupo...</p>
          </div>
        ) : members.length === 0 ? (
          // Caso não tenha ninguém (o que é raro, pois você estará lá)
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <p className="text-muted-foreground">Nenhum membro encontrado.</p>
          </div>
        ) : (
          // Lista real de membros
          members.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.05, 0.5) }} // Limita o delay para listas muito grandes
              className="bg-card rounded-xl border border-border p-4 flex items-center justify-between hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                {/* Avatar Dinâmico */}
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center border border-white/5 overflow-hidden">
                  {member.avatar_url ? (
                    <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                
                <div>
                  <p className="text-base font-semibold text-foreground flex items-center gap-2">
                    {member.name || "Usuário sem nome"}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs font-medium flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-accent/10 text-accent border border-accent/20">
                      <Trophy className="w-3 h-3" />
                      {member.total_points || 0} pontos
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

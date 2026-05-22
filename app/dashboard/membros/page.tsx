import React from "react";
import { Users, User, Mail, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const MOCK_MEMBERS = [
  { name: "Carlos Silva", email: "carlos@email.com", joined: "2026-05-01", role: "admin" },
  { name: "Maria Santos", email: "maria@email.com", joined: "2026-05-02", role: "user" },
  { name: "João Oliveira", email: "joao@email.com", joined: "2026-05-03", role: "user" },
  { name: "Ana Costa", email: "ana@email.com", joined: "2026-05-04", role: "user" },
  { name: "Aquila", email: "aquila@email.com", joined: "2026-05-05", role: "user" },
  { name: "Pedro Lima", email: "pedro@email.com", joined: "2026-05-06", role: "user" },
];

export default function Membros() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Membros</h1>
        </div>
        <Badge variant="outline" className="text-muted-foreground">
          {MOCK_MEMBERS.length} participantes
        </Badge>
      </div>

      <div className="grid gap-3">
        {MOCK_MEMBERS.map((member, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-card rounded-xl border border-border p-4 flex items-center justify-between hover:border-primary/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                  {member.name}
                  {member.role === "admin" && (
                    <Badge className="bg-accent/15 text-accent border-0 text-[10px]">Admin</Badge>
                  )}
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {member.email}
                  </span>
                </div>
              </div>
            </div>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(member.joined).toLocaleDateString("pt-BR")}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

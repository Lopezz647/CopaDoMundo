"use client";

import React, { useState } from "react";
import { Settings, User, Bell, Shield, LogOut } from "lucide-react";

import { Button } from "@/components/ui-dashboard/button";
import { Input } from "@/components/ui-dashboard/input";
import { Label } from "@/components/ui-dashboard/label";
import { Switch } from "@/components/ui-dashboard/switch";
import { Separator } from "@/components/ui-dashboard/separator";

import { motion } from "framer-motion"

export default function Configuracoes() {
  // TODO: Substituir pela chamada real do Supabase quando for integrar a Auth
  // Exemplo: 
  // const supabase = createClient();
  // const { data: { user } } = await supabase.auth.getUser();
  const user = {
    full_name: "Usuário",
    email: "usuario@email.com",
  };

  const [notifications, setNotifications] = useState(true);
  const [reminderBefore, setReminderBefore] = useState(true);

  const handleLogout = async () => {
    // TODO: Implementar logout do Supabase aqui
    // Exemplo:
    // const supabase = createClient();
    // await supabase.auth.signOut();
    // window.location.href = '/auth/login';
    console.log("Botão de logout clicado!");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
      </div>

      {/* Profile */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl border border-border p-6 space-y-4"
      >
        <div className="flex items-center gap-3 mb-2">
          <User className="w-5 h-5 text-primary" />
          <h2 className="text-base font-bold text-foreground">Perfil</h2>
        </div>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">Nome</Label>
            <Input
              value={user?.full_name || ""}
              disabled
              className="mt-1 bg-muted border-border text-foreground"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Email</Label>
            <Input
              value={user?.email || ""}
              disabled
              className="mt-1 bg-muted border-border text-foreground"
            />
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl border border-border p-6 space-y-4"
      >
        <div className="flex items-center gap-3 mb-2">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="text-base font-bold text-foreground">Notificações</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Ativar notificações</p>
            <p className="text-xs text-muted-foreground">Receba avisos sobre novos jogos</p>
          </div>
          <Switch checked={notifications} onCheckedChange={setNotifications} />
        </div>
        <Separator className="bg-border" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Lembrete antes do jogo</p>
            <p className="text-xs text-muted-foreground">Lembrar 30min antes de fechar palpites</p>
          </div>
          <Switch checked={reminderBefore} onCheckedChange={setReminderBefore} />
        </div>
      </motion.div>

      {/* Account */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="text-base font-bold text-foreground">Conta</h2>
        </div>
        <Button
          variant="outline"
          className="border-destructive/50 text-destructive hover:bg-destructive/10 gap-2"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Sair da conta
        </Button>
      </motion.div>
    </div>
  );
}


"use client";

import React, { useEffect, useState } from "react";
import { Settings, User, Bell, Shield, LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui-dashboard/button";
import { Input } from "@/components/ui-dashboard/input";
import { Label } from "@/components/ui-dashboard/label";
import { Switch } from "@/components/ui-dashboard/switch";
import { Separator } from "@/components/ui-dashboard/separator";

import { motion } from "framer-motion";

export default function Configuracoes() {
  const supabase = createClient();
  const router = useRouter();

  // Estados para carregar os dados reais da sessão
  const [profile, setProfile] = useState<any>(null);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const [notifications, setNotifications] = useState(true);
  const [reminderBefore, setReminderBefore] = useState(true);

  useEffect(() => {
    async function getUserData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUserEmail(user.email || "");
          
          const { data: profileData } = await supabase
            .from("profiles")
            .select("name")
            .eq("id", user.id)
            .single();
            
          setProfile(profileData);
        }
      } catch (error) {
        console.error("Erro ao carregar dados de configuração:", error);
      } finally {
        setLoading(false);
      }
    }
    getUserData();
  }, [supabase]);

    // Função responsável por encerrar a sessão e redirecionar de forma limpa
  const handleLogout = async () => {
    try {
      // 1. Encerra de fato a sessão no Supabase Auth
      await supabase.auth.signOut();
      
      // 2. Força um reload completo limpando o cache e indo para a página inicial
      window.location.href = "/";
    } catch (error) {
      console.error("Erro ao tentar deslogar:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
      </div>

      {/* Perfil */}
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
              value={profile?.name || "Membro"}
              disabled
              className="mt-1 bg-muted border-border text-foreground"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Email</Label>
            <Input
              value={userEmail}
              disabled
              className="mt-1 bg-muted border-border text-foreground"
            />
          </div>
        </div>
      </motion.div>

      {/* Notificações */}
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

      {/* Conta */}
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
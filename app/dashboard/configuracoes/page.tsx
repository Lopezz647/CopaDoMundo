"use client";

import React, { useEffect, useState, useRef } from "react";
import { Settings, User, Bell, Shield, LogOut, Loader2, Camera } from "lucide-react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<any>(null);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

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
            .select("id, name, avatar_url")
            .eq("id", user.id)
            .single();
          setProfile(profileData);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }
    getUserData();
  }, [supabase]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Erro ao tentar deslogar:", error);
    }
  };

  // Função para lidar com o envio da imagem
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingAvatar(true);
      if (!event.target.files || event.target.files.length === 0) return;
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${profile.id}-${Math.random()}.${fileExt}`;

      // 1. Faz o upload para o bucket 'avatars'
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // 2. Pega a URL pública da imagem recém-upada
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // 3. Salva a URL no perfil do usuário na tabela profiles
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      // Atualiza a tela instantaneamente
      setProfile({ ...profile, avatar_url: publicUrl });

    } catch (error) {
      console.error("Erro no upload da imagem:", error);
      alert("Erro ao enviar imagem. Verifique se o bucket 'avatars' está público no Supabase.");
    } finally {
      setUploadingAvatar(false);
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

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl border border-border p-6 space-y-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <User className="w-5 h-5 text-primary" />
          <h2 className="text-base font-bold text-foreground">Perfil</h2>
        </div>

        {/* Seção do Avatar Clicável */}
        <div className="flex items-center gap-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="relative w-24 h-24 rounded-full border-2 border-border bg-muted flex items-center justify-center overflow-hidden cursor-pointer group hover:border-primary transition-colors"
          >
            {uploadingAvatar ? (
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            ) : profile?.avatar_url ? (
              <>
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover object-center" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </>
            ) : (
              <div className="text-center">
                <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-1 group-hover:text-primary transition-colors" />
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Mudar</span>
              </div>
            )}
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Nome</Label>
              <Input value={profile?.name || "Membro"} disabled className="mt-1 bg-muted border-border text-foreground" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Email</Label>
              <Input value={userEmail} disabled className="mt-1 bg-muted border-border text-foreground" />
            </div>
          </div>
          
          {/* Input de arquivo oculto */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleAvatarUpload} 
            accept="image/png, image/jpeg, image/webp" 
            className="hidden" 
          />
        </div>
      </motion.div>

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

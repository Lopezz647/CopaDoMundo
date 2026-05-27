"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function UserHeader() {
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("name, avatar_url")
          .eq("id", user.id)
          .single();
        setProfile(profileData);
      }
      setLoading(false);
    }
    loadUserData();
  }, [supabase]);

  if (loading) {
    return <div className="h-12 w-48 animate-pulse bg-white/5 rounded-lg mb-6" />;
  }

  if (!profile) return null;

  return (
    <header className="flex items-center gap-4 mb-6 relative">
      {/* Avatar real com enquadramento inteligente de rosto */}
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-[#1e4d35] flex items-center justify-center border-2 border-[#0d0d0d] overflow-hidden">
          {profile.avatar_url ? (
            <img 
              src={profile.avatar_url} 
              alt={profile.name} 
              className="w-full h-full object-cover object-[center_25%]" 
            />
          ) : (
            <span className="text-[#4edea3] font-bold text-sm">
              {profile.name?.charAt(0)?.toUpperCase() || "U"}
            </span>
          )}
        </div>
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#eebb4d] rounded-full border-2 border-[#0d0d0d]"></div>
      </div>

      {/* Saudação real */}
      <div className="flex flex-col">
        <span className="text-[13px] text-[#8a9a8e] font-medium">Bem-vindo(a) de volta,</span>
        <h2 className="text-[15px] font-bold text-[#e5e2e1]">
          {profile.name || "Membro"}
        </h2>
      </div>
    </header>
  );
}

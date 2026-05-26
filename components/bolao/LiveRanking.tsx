import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LiveRanking({ user }) {
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(user);
  const [predictionsCount, setPredictionsCount] = useState(0);

  useEffect(() => {
    async function fetchStats() {
      if (!user?.id) return;

      // Busca os pontos atualizados e palpites feitos
      const { data: p } = await supabase
        .from("profiles")
        .select("total_points")
        .eq("id", user.id)
        .single();

      const { count } = await supabase
        .from("predictions")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user.id);

      if (p) setProfile((prev: any) => ({ ...prev, total_points: p.total_points }));
      if (count !== null) setPredictionsCount(count);
    }

    fetchStats();
  }, [user]);

  return (
    <div
      className="rounded-xl border border-white/5 p-5 sticky top-6"
      style={{ background: "#181818" }}
    >
      {/* Title */}
      <div className="flex items-center gap-2 mb-5">
        <span className="text-[18px]">🏆</span>
        <h2 className="text-[16px] font-bold text-[#e5e2e1]">Ranking ao Vivo</h2>
      </div>

      {/* User row */}
      <div
        className="flex items-center justify-between px-3 py-3 rounded-xl relative overflow-hidden"
        style={{ background: "#111", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl" style={{ background: "#4edea3" }} />

        <div className="flex items-center gap-3 ml-2">
          {/* Avatar real do usuário */}
          <div className="w-8 h-8 rounded-full overflow-hidden border border-[#4edea3]/20">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#1e1e1e]">
                <span className="material-symbols-rounded text-[#4edea3] text-[16px]">person</span>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-[#e5e2e1]">{profile?.name || "Usuário"}</span>
            <span className="text-[10px] text-[#8a9a8e]">{predictionsCount} palpites</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Pontuação Real */}
          <span className="text-[20px] font-bold text-[#e5e2e1]">{profile?.total_points || 0}</span>
          <div
            className="text-[10px] font-bold text-[#4edea3] px-2 py-0.5 rounded uppercase tracking-wider"
            style={{ background: "rgba(78,222,163,0.15)", border: "1px solid rgba(78,222,163,0.25)" }}
          >
            Você
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Início", icon: "home", path: "/dashboard" },
  { label: "Palpites", icon: "sports_soccer", path: "/dashboard/palpites" },
  { label: "Ranking", icon: "emoji_events", path: "/dashboard/ranking" },
  { label: "Membros", icon: "group", path: "/dashboard/membros" },
  { label: "Regras", icon: "menu_book", path: "/regras" },
  { label: "Configurações", icon: "settings", path: "/dashboard/configuracoes" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.nav
      animate={{ width: collapsed ? 64 : 180 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      // Agora o Sidebar faz parte do Flexbox e empurra o conteúdo!
      className="relative h-screen bg-[#0d0d0d] z-20 flex flex-col flex-shrink-0 border-r border-white/5"
    >
      {/* Container para esconder o conteúdo que passa da largura (sem cortar o botão) */}
      <div className="flex flex-col h-full overflow-hidden w-full">
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-[#1a2e24] flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-rounded text-[#4edea3] text-[16px]">
              sports_soccer
            </span>
          </div>

          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[15px] font-bold text-[#e5e2e1] whitespace-nowrap"
              >
                Bolão DRH-1
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav Items */}
        <div className="flex flex-col gap-0.5 flex-1 px-2 mt-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
                  isActive
                    ? "bg-[#1e4d35] text-[#4edea3]"
                    : "text-[#8a9a8e] hover:text-[#c8d8cc] hover:bg-[#1a1a1a]"
                }`}
              >
                <span
                  className="material-symbols-rounded text-[20px] flex-shrink-0"
                  style={{
                    fontVariationSettings: "'FILL' 0, 'wght' 400",
                  }}
                >
                  {item.icon}
                </span>

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-[14px] font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#1a1a1a] rounded-full border border-white/10 flex items-center justify-center text-[#8a9a8e] hover:text-[#4edea3] transition-colors z-30"
      >
        <span className="material-symbols-rounded text-[13px]">
          {collapsed ? "chevron_right" : "chevron_left"}
        </span>
      </button>
    </motion.nav>
  );
}

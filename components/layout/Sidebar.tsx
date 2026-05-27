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
      className="relative h-screen bg-[#0d0d0d] z-20 flex flex-col flex-shrink-0 border-r border-white/5"
    >
      {/* Logo Unificada */}
      <div className="flex items-center justify-start px-4 py-5 flex-shrink-0 h-[80px]">
        <AnimatePresence mode="wait">
          {collapsed ? (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-8 h-8 flex items-center justify-center"
            >
              <img 
                src="/logo-esquerda.png" 
                alt="Bolão DRH-1" 
                // Definimos uma altura menor (h-8) para caber no menu colapsado
                className="w-auto h-8 object-contain" 
              />
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center"
            >
              <img 
                src="/logo-esquerda.png" 
                alt="Bolão DRH-1" 
                className="w-auto h-12 md:h-14 object-contain" 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Items */}
      <div className="flex flex-col gap-0.5 flex-1 px-2 mt-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;

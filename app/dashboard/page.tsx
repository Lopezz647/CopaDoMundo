"use client";
import React from "react";
import Link from "next/link";
import { Trophy, Target, Users, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const quickLinks = [
  {
    label: "Palpites",
    desc: "Faça seus palpites nos jogos",
    icon: Target,
    path: "/dashboard/palpites",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Ranking",
    desc: "Veja sua posição no ranking",
    icon: Trophy,
    path: "/dashboard/ranking",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    label: "Membros",
    desc: "Conheça os participantes",
    icon: Users,
    path: "/dashboard/membros",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    label: "Regras",
    desc: "Entenda como funciona",
    icon: BookOpen,
    path: "/regras",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
];

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl border border-border p-8"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center text-3xl">
            ⚽
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Bem-vindo ao SIGATRAN</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Copa do Mundo 2026 • Faça seus palpites e dispute com seus amigos!
            </p>
          </div>
        </div>
        <Link href="/dashboard/palpites">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 mt-2">
            Começar a palpitar
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </motion.div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickLinks.map((item, idx) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link
              href={item.path}
              className="bg-card rounded-xl border border-border p-5 flex items-center gap-4 hover:border-primary/30 transition-colors group block"
            >
              <div className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {item.label}
                </p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

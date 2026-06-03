"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle, AlertTriangle, Trophy, Target, Zap } from "lucide-react";
import { motion } from "framer-motion";

const rules = [
  {
    icon: Target,
    title: "Como funciona",
    description: "Cada participante faz palpites sobre o placar dos jogos da Copa do Mundo 2026. Os palpites devem ser feitos até 15 minutos antes do início de cada jogo.",
  },
  {
    icon: Trophy,
    title: "Pontuação",
    items: [
      "Placar exato: 10 pontos",
      "Acertar o vencedor + diferença de gols: 7 pontos",
      "Acertar o vencedor: 5 pontos",
      "Acertar tendência (ex: empate sem placar exato): 2 pontos",
      "Errou tudo: 0 pontos",
    ],
  },
  {
    icon: Zap,
    title: "Multiplicadores",
    description: "Algumas rodadas possuem multiplicadores especiais (2x, 3x). Nessas rodadas, a pontuação é multiplicada automaticamente. Fique atento ao badge de multiplicador!",
  },
  {
    icon: AlertTriangle,
    title: "Regras Importantes",
    items: [
      "Palpites não podem ser alterados após o início do jogo",
      "Cada jogador pode fazer apenas um palpite por jogo",
      "Em caso de empate no ranking, o critério de desempate é número de placares exatos (10 pts)",
      "Jogos adiados serão reagendados automaticamente",
    ],
  },
];

export default function Regras() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 mt-6">
      
      {/* HEADER COM BOTÃO VOLTAR */}
      <div className="flex items-center gap-4 px-2 mb-8">
        <Link 
          href="/dashboard"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/5 text-[#8a9a8e] hover:text-[#4edea3] hover:border-[#4edea3]/30 hover:bg-[#4edea3]/10 transition-all shadow-sm"
          title="Voltar ao início"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <BookOpen className="w-7 h-7 text-[#4edea3]" />
          <h1 className="text-2xl font-bold text-[#e5e2e1]">Regras do Bolão</h1>
        </div>
      </div>

      {/* CARDS DAS REGRAS */}
      <div className="space-y-4">
        {rules.map((rule, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-[#141414] rounded-xl border border-white/5 p-6 hover:border-[#4edea3]/20 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#4edea3]/10 border border-[#4edea3]/20 flex items-center justify-center shadow-[0_0_10px_rgba(78,222,163,0.1)]">
                <rule.icon className="w-5 h-5 text-[#4edea3]" />
              </div>
              <h2 className="text-lg font-bold text-[#e5e2e1]">{rule.title}</h2>
            </div>
            {rule.description && <p className="text-[14px] text-[#8a9a8e] leading-relaxed">{rule.description}</p>}
            {rule.items && (
              <ul className="space-y-3 mt-2">
                {rule.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-[#4edea3] mt-0.5 flex-shrink-0" />
                    <span className="text-[14px] text-[#8a9a8e] font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

"use client"; // <-- Obrigatório para o useState e animações funcionarem na Vercel

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  { q: "Como criar um bolão da Copa do Mundo?", a: "Com o Bolão AI você cria seu bolão da Copa do Mundo em 2 minutos: escolha o campeonato, convide seus amigos pelo WhatsApp e pronto! A IA cuida de tudo automaticamente." },
  { q: "O bolão acompanha todas as fases da Copa do Mundo?", a: "Sim! O Bolão AI acompanha desde a fase de grupos até a grande final. Você pode palpitar em todos os jogos e disputar com os amigos durante todo o mundial." },
  { q: "Quantas seleções participam da Copa 2026?", a: "A Copa do Mundo 2026 terá 48 seleções - aumento de 32 para 48 times. Serão 12 grupos de 4 times, com os 2 melhores de cada grupo + 8 melhores terceiros avançando ao mata-mata." },
  { q: "Onde será a Copa do Mundo 2026?", a: "A Copa 2026 será sediada por 3 países: Estados Unidos (11 cidades), México (3 cidades) e Canadá (2 cidades). A final será no MetLife Stadium, em Nova York." },
  { q: "Quantos jogos terá a Copa do Mundo 2026?", a: "Com o novo formato de 48 times, a Copa 2026 terá 104 jogos no total - um aumento significativo em relação aos 64 jogos das edições anteriores." },
  { q: "Quanto custa o bolão da Copa do Mundo?", a: "Oferecemos uma versão gratuita para criar e participar de bolões com amigos. Para empresas que desejam engajar equipes, temos planos corporativos personalizados." }
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(-1);

  return (
    <section id="faq" className="py-24 relative z-10 bg-background">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Título da Seção */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4">
            Dúvidas <span className="text-primary">Frequentes</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Tudo o que você precisa saber sobre o Bolão DRH-1
          </p>
        </div>

        {/* Lista de Perguntas (Acordeão) */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="border border-border bg-card/50 rounded-2xl overflow-hidden backdrop-blur-sm transition-all hover:border-primary/50"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className="text-lg font-bold text-foreground pr-4">
                  {faq.q}
                </span>
                <motion.div
                  animate={{ rotate: openIdx === idx ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-6 h-6 text-primary" />
                </motion.div>
              </button>
              
              {/* Resposta com animação de abrir/fechar */}
              <AnimatePresence>
                {openIdx === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}

import { Trophy } from "lucide-react";
import { motion } from "framer-motion";

export default function WhyJoin() {
  return (
    <section className="relative py-20 bg-background overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-black text-foreground mb-8 text-center">
          Por que participar do bolão da Copa do Mundo 2026?
        </motion.h2>

        <div className="bg-gradient-to-br from-emerald-600/20 to-blue-900/20 border-2 border-primary/50 rounded-3xl p-8 md:p-12 backdrop-blur-sm shadow-2xl shadow-emerald-400/10">
          <div className="space-y-6 text-foreground/80">
            <p className="text-lg leading-relaxed">
              A <strong className="text-foreground">Copa do Mundo FIFA 2026</strong> será histórica: pela primeira vez,
              <strong className="text-foreground"> 48 seleções</strong> disputarão o título em três países —
              <strong className="text-primary"> Estados Unidos, México e Canadá</strong>.
            </p>

            <p className="text-lg leading-relaxed">
              No <strong className="text-primary">Bolão AI</strong>, você e seus amigos acompanham todas as fases do mundial:
            </p>

            <ul className="space-y-3 pl-4">
              {[
                { bold: "Fase de Grupos:", text: " 48 seleções divididas em 12 grupos" },
                { bold: "Mata-mata:", text: " Oitavas, quartas, semifinais e final" },
                { bold: null, text: "Rankings automáticos atualizados em tempo real" },
                { bold: null, text: "Lembretes pelo WhatsApp para nunca esquecer de palpitar" },
                { bold: null, text: "Painel inteligente com estatísticas e desempenho" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-primary text-xl">•</span>
                  <span className="text-lg">
                    {item.bold && <strong className="text-foreground">{item.bold}</strong>}
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>

            <p className="text-lg leading-relaxed">
              <strong className="text-foreground">Brasil, Argentina, França, Alemanha, Inglaterra</strong> e todas as grandes seleções — cada jogo vale ponto, cada fase pode virar o jogo no seu bolão.
            </p>

            <p className="text-lg leading-relaxed">
              Transforme a Copa do Mundo em disputa entre você e seus amigos. Crie seu bolão agora e veja quem realmente entende de futebol!
            </p>
          </div>

          <div className="mt-10 text-center">
            <a href="#planos" className="inline-flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-black font-black rounded-full px-12 py-5 text-lg transition-all shadow-xl shadow-emerald-400/30 hover:shadow-emerald-400/50 hover:scale-105">
              <Trophy className="h-6 w-6" />
              Criar Meu Bolão Agora
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

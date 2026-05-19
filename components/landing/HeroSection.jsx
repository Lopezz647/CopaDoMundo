import { Trophy, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection({ bgUrl }) {
  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0" style={{ backgroundImage: `url(${bgUrl})`, backgroundSize: "cover", backgroundPosition: "center", filter: "blur(2px)" }} />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/80 via-emerald-900/60 to-black/90" />
      <div className="absolute inset-0 z-10" style={{ boxShadow: "inset 0 0 200px 100px rgba(0,0,0,0.8)" }} />

      <div className="max-w-5xl mx-auto px-4 relative z-30 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500 rounded-full px-5 py-2 backdrop-blur-sm">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              <span className="text-white font-semibold text-sm">A Copa começa em junho — Crie seu bolão agora!</span>
            </span>
            <span className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500 rounded-full px-5 py-2 backdrop-blur-sm">
              <span className="text-2xl">🌍</span>
              <span className="text-white font-semibold text-sm">FIFA World Cup 2026</span>
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
            Bolão da{" "}
            <span className="text-emerald-400" style={{ textShadow: "0 0 30px rgba(52,211,153,0.5), 0 0 60px rgba(52,211,153,0.3)" }}>
              Copa do Mundo 2026
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
            O maior evento do futebol mundial merece o melhor bolão! Crie em 2 minutos e acompanhe tudo pelo WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-8">
            <a href="#planos" className="group inline-flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-black font-black rounded-full px-10 py-5 text-lg transition-all shadow-2xl shadow-emerald-400/30 hover:shadow-emerald-400/50 hover:scale-105">Cadastrar


            </a>
            <a href="#como-funciona" className="inline-flex items-center justify-center gap-3 border-2 border-emerald-400 text-emerald-400 hover:bg-emerald-500/10 rounded-full px-10 py-5 text-lg font-bold transition-all backdrop-blur-sm">
              Como Funciona
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>

          <p className="text-white/50 text-sm font-medium">⚡ • Ranking automático • </p>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20" />
    </section>);

}

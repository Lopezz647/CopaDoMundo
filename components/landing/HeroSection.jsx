import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* IMAGEM DE FUNDO: Se você tiver uma imagem de fundo, coloque em public/trofeu-fundo.png */}
      <div className="absolute inset-0 z-0" style={{ backgroundImage: `url('/trofeu-fundo.png')`, backgroundSize: "cover", backgroundPosition: "center", filter: "blur(2px)" }} />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#0A0F24]/90 via-[#0A0F24]/70 to-[#0A0F24]" />
      <div className="absolute inset-0 z-10" style={{ boxShadow: "inset 0 0 200px 100px rgba(0,0,0,0.8)" }} />

      <div className="max-w-5xl mx-auto px-4 relative z-30 text-center flex flex-col md:flex-row items-center gap-10">
        
        <motion.div className="flex-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-8">
            <span className="inline-flex items-center gap-2 bg-primary/20 border border-primary rounded-full px-5 py-2 backdrop-blur-sm">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              <span className="text-white font-semibold text-sm">O maior evento de apostas da seção</span>
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight text-center md:text-left">
            Bolão da <br/>
            <span className="text-primary" style={{ textShadow: "0 0 30px rgba(52,211,153,0.5)" }}>
              Copa do Mundo
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-10 max-w-2xl text-center md:text-left leading-relaxed font-light">
            Dê seu palpite nos jogos e vamos descobrir quem será o pior apostador da DRH-1. O sistema faz tudo automático!
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start mb-8">
            {/* BOTAO DE LOGIN APONTANDO PARA A ROTA CORRETA */}
            <a href="/auth/login" className="group inline-flex items-center justify-center gap-3 bg-primary hover:bg-primary/80 text-primary-foreground font-black rounded-full px-10 py-5 text-lg transition-all shadow-2xl shadow-primary/30 hover:scale-105">
              Fazer Login e Palpitar
            </a>
            <a href="#como-funciona" className="inline-flex items-center justify-center gap-3 border-2 border-primary/50 text-white hover:bg-primary/10 rounded-full px-10 py-5 text-lg font-bold transition-all backdrop-blur-sm">
              Ver Regras
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </motion.div>

        {/* LOGO PRINCIPAL GRANDE À DIREITA */}
        <motion.div className="flex-1 hidden md:flex justify-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <img src="/logo-principal.png" alt="Logo Principal Bolão" className="w-[400px] h-auto object-contain drop-shadow-[0_0_30px_rgba(212,175,55,0.2)]" />
        </motion.div>

      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20" />
    </section>
  );
}

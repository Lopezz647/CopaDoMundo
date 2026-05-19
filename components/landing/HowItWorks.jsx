import { motion } from "framer-motion";

const steps = [
{ num: "01", title: "Login via SMS", desc: "Digite seu telefone e receba um código de verificação no WhatsApp" },
{ num: "02", title: "Criar novo bolão", desc: "Configure seu bolão em segundos" },
{ num: "03", title: "Escolher pontuação", desc: "Selecione o sistema de pontuação ideal para seu grupo" },
{ num: "04", title: "Multiplicador por fase", desc: "Rodadas decisivas valem mais pontos com multiplicadores customizáveis" },
{ num: "05", title: "Robô no WhatsApp", desc: "Lembretes, resultados e ranking automáticos direto no grupo" },
{ num: "06", title: "Convidar amigos", desc: "Compartilhe o link e comece a jogar com seus amigos" }];


export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-16 md:py-24 bg-background scroll-mt-20 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-teal-500/[0.03] rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-14 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Como funciona o <span className="text-primary">Bolão DRH-1</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground font-light max-w-2xl mx-auto">
            Veja como é fácil criar seu bolão da Copa do Mundo em poucos passos
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) =>
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="relative group">
            
              <div className="bg-card border border-border/30 rounded-2xl p-6 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
                <span className="text-6xl font-black text-foreground/[0.05] group-hover:text-primary/10 transition-colors absolute top-4 right-4 select-none">
                  {step.num}
                </span>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                    <span className="text-primary font-black text-lg">{step.num}</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}

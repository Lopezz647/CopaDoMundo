import { Trophy, Users, MapPin, ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const cards = [
  {
    icon: Trophy,
    title: "História da Copa do Mundo",
    text: "A Copa do Mundo FIFA é o maior evento esportivo do planeta, realizado a cada 4 anos desde 1930. O Brasil é o maior campeão com 5 títulos (1958, 1962, 1970, 1994 e 2002). A competição reúne as melhores seleções de todos os continentes. A edição de 2026 será a 23ª da história.",
  },
  {
    icon: Users,
    title: "Novo Formato 2026",
    text: "A Copa 2026 terá um formato inédito com 48 seleções divididas em 12 grupos de 4 times. Os 2 melhores de cada grupo (24 times) + os 8 melhores terceiros colocados avançam para o mata-mata de 32 times.",
  },
  {
    icon: MapPin,
    title: "Sedes e Estádios",
    text: "A Copa 2026 será realizada em 16 cidades de 3 países: Estados Unidos (11 cidades), México (3 cidades) e Canadá (2 cidades). A final será no MetLife Stadium, em Nova Jersey.",
  },
];

export default function WorldCupInfo() {
  const [open, setOpen] = useState(false);

  return (
    <section className="relative py-20 bg-gradient-to-b from-background via-card/30 to-background overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <button
          onClick={() => setOpen(!open)}
          className="w-full group bg-gradient-to-br from-emerald-600/20 to-blue-900/20 border-2 border-yellow-400/40 hover:border-yellow-400 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:shadow-yellow-400/10 transition-all duration-300"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-400/20 rounded-full p-3 group-hover:bg-yellow-400/30 transition-colors">
                <Trophy className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="text-left">
                <h2 className="text-xl md:text-2xl font-black text-foreground group-hover:text-yellow-400 transition-colors">
                  Tudo sobre a Copa do Mundo 2026
                </h2>
                <p className="text-muted-foreground text-sm mt-1">Clique para saber mais</p>
              </div>
            </div>
            <div className="flex-shrink-0 bg-yellow-400/20 rounded-full p-2">
              <ChevronDown className={`h-6 w-6 text-yellow-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
            </div>
          </div>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden"
            >
              <div className="space-y-6 mt-6">
                {cards.map((card) => (
                  <div key={card.title} className="bg-gradient-to-br from-emerald-600/10 to-blue-900/10 border border-yellow-400/30 rounded-xl p-6 md:p-8 backdrop-blur-sm hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/10 transition-all">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="bg-yellow-400/20 rounded-lg p-2">
                        <card.icon className="h-5 w-5 text-yellow-400" />
                      </div>
                      <h3 className="text-xl font-bold text-yellow-400">{card.title}</h3>
                    </div>
                    <p className="text-foreground/80 leading-relaxed">{card.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

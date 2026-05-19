import { useState } from "react";
import { Trophy, ChevronDown, Zap } from "lucide-react";

const modes = [
{
  id: "classico", emoji: "🏆", label: "Clássico", sub: "Mais usado",
  title: "Modo Clássico",
  desc: "O sistema mais completo. Quanto mais perto do placar exato, mais pontos você ganha.",
  scenarios: 6, maxPts: 10,
  tip: "Mesmo errando o vencedor, você pode pontuar se acertar o placar de um dos times.",
  rules: [
  { icon: "⚽", label: "Placar exato", pts: 10, color: "bg-emerald-500 text-emerald-950" },
  { icon: "🎯", label: "Vencedor + 1 placar", pts: 7, color: "bg-emerald-500 text-emerald-950" },
  { icon: "🏆", label: "Só o vencedor", pts: 5, color: "bg-yellow-400 text-yellow-950" },
  { icon: "🤝", label: "Empate (sem exato)", pts: 5, color: "bg-yellow-400 text-yellow-950" },
  { icon: "⚡", label: "Acertou 1 placar", pts: 2, color: "bg-blue-500 text-blue-950" },
  { icon: "❌", label: "Errou tudo", pts: 0, color: "bg-red-500/20 text-red-300 border border-red-500/30" }]

},
{
  id: "simples", emoji: "⚡", label: "Simples", sub: "Direto ao ponto",
  title: "Modo Simples",
  desc: "Acertou o placar exato ou o vencedor, ganhou pontos. Ideal pra quem quer simplicidade.",
  scenarios: 4, maxPts: 10,
  tip: "Menos regras, mais diversão. Perfeito pra bolões casuais com amigos ou família.",
  rules: [
  { icon: "⚽", label: "Placar exato", pts: 10, color: "bg-emerald-500 text-emerald-950" },
  { icon: "🏆", label: "Acertou o vencedor", pts: 7, color: "bg-emerald-500 text-emerald-950" },
  { icon: "🤝", label: "Empate (sem exato)", pts: 5, color: "bg-yellow-400 text-yellow-950" },
  { icon: "❌", label: "Errou ou não palpitou", pts: 0, color: "bg-red-500/20 text-red-300 border border-red-500/30" }]

},
{
  id: "personalizado", emoji: "🎨", label: "Personalizado", sub: "Você decide",
  title: "Modo Personalizado",
  desc: "Monte o sistema de pontuação do zero. Ative ou desative critérios, defina quantos pontos vale cada acerto.",
  scenarios: null, maxPts: null,
  tip: null,
  rules: [
  { icon: "⚽", label: "Placar exato", pts: 10, color: "text-green-400" },
  { icon: "🎯", label: "Vencedor + 1 placar correto", pts: 7, color: "text-blue-400" },
  { icon: "🏆", label: "Apenas o vencedor", pts: 5, color: "text-yellow-400" },
  { icon: "🤝", label: "Empate (sem exato)", pts: 5, color: "text-yellow-400" },
  { icon: "⚡", label: "1 placar certo", pts: 2, color: "text-orange-400" },
  { icon: "❌", label: "Errou ou não palpitou", pts: 0, color: "text-red-400" }]

}];


function ScoreCard({ mode }) {
  const [openIdx, setOpenIdx] = useState(0);
  const isCustom = mode.id === "personalizado";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      <div className="space-y-4">
        <div>
          
          
        </div>

        {!isCustom &&
        <div className="grid grid-cols-2 gap-3">
            <div className="bg-background rounded-xl p-3 border border-foreground/5">
              <p className="text-2xl font-black text-primary">{mode.scenarios}</p>
              <p className="text-[11px] text-muted-foreground">Cenários de pontuação</p>
            </div>
            <div className="bg-background rounded-xl p-3 border border-foreground/5">
              <p className="text-2xl font-black text-primary">{mode.maxPts}</p>
              <p className="text-[11px] text-muted-foreground">Pontuação máxima</p>
            </div>
          </div>
        }

        {isCustom &&
        <div className="space-y-2.5">
            {[
          { e: "🎯", t: "Escolha os critérios", d: "Ative apenas as faixas que fazem sentido" },
          { e: "🔢", t: "Defina os pontos", d: "De 0 a 100 pontos para cada critério" },
          { e: "📐", t: "Desempate inteligente", d: "Quem acertou no critério com mais pontos leva vantagem" }].
          map((f) =>
          <div key={f.t} className="flex items-start gap-3 bg-background rounded-xl p-3 border border-foreground/5">
                <span className="text-lg flex-shrink-0">{f.e}</span>
                <div>
                  <p className="text-[13px] font-semibold text-foreground">{f.t}</p>
                  <p className="text-[11px] text-muted-foreground">{f.d}</p>
                </div>
              </div>
          )}
          </div>
        }

        {mode.tip &&
        <div className="bg-emerald-500/[0.06] border border-emerald-500/15 rounded-xl p-3.5">
            <p className="text-xs text-emerald-300 font-medium mb-1">💡 Diferencial</p>
            <p className="text-[13px] text-muted-foreground leading-relaxed">{mode.tip}</p>
          </div>
        }
      </div>

      <div className="space-y-3">
        <div className="bg-card rounded-xl p-3 border border-emerald-900/20">
          <p className="text-[10px] font-semibold text-primary uppercase tracking-wider text-center mb-2">Resultado do jogo</p>
          <div className="flex items-center justify-center gap-5">
            <div className="text-center">
              <span className="text-2xl block">🇧🇷</span>
              <span className="text-[11px] text-muted-foreground font-medium">Brasil</span>
            </div>
            <div className="text-2xl font-black text-foreground bg-background px-4 py-1.5 rounded-xl border border-foreground/5">3 × 1</div>
            <div className="text-center">
              <span className="text-2xl block">🇦🇷</span>
              <span className="text-[11px] text-muted-foreground font-medium">Argentina</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-foreground/5 bg-card overflow-hidden">
          {!isCustom ?
          <div className="divide-y divide-foreground/5">
              {mode.rules.map((rule, idx) =>
            <div key={idx}>
                  <button
                onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
                className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left hover:bg-primary/5 transition-colors">
                
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xl flex-shrink-0 w-6 text-center">{rule.icon}</span>
                      <p className="text-sm font-semibold truncate text-foreground/90">{rule.label}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[11px] font-extrabold py-1 rounded-md text-center w-10 ${rule.color}`}>
                        {rule.pts > 0 ? `+${rule.pts}` : "0"}
                      </span>
                      <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${openIdx === idx ? "rotate-180" : ""}`} />
                    </div>
                  </button>
                  {openIdx === idx &&
              <div className="px-4 pb-3">
                      <p className="text-[11px] text-muted-foreground">
                        {rule.pts > 0 ?
                  `✔ Cenário que vale +${rule.pts} pontos` :
                  "Sem acerto de vencedor nem placares"}
                      </p>
                    </div>
              }
                </div>
            )}
            </div> :

          <div className="p-3 space-y-1.5">
              {mode.rules.map((rule, idx) =>
            <div key={idx} className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-card border border-foreground/5 hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center flex-shrink-0">
                      <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-[13px] text-foreground/80 truncate">{rule.label}</span>
                  </div>
                  <span className={`text-sm font-extrabold flex-shrink-0 ml-2 ${rule.color}`}>
                    {rule.pts > 0 ? `+${rule.pts}` : "0"}
                  </span>
                </div>
            )}
            </div>
          }
          <div className="px-4 py-2 bg-background border-t border-foreground/5 flex items-center gap-2">
            <span className="text-xs">⏱️</span>
            <p className="text-[10px] text-amber-100/70"><span className="font-semibold">Tempo:</span> normal + prorrogação. Pênaltis não contam.</p>
          </div>
        </div>
      </div>
    </div>);

}

export default function ScoringSystem() {
  const [active, setActive] = useState("classico");
  const mode = modes.find((m) => m.id === active);

  return (
    <section id="pontuacao" className="py-20 md:py-28 relative overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card to-background" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/[0.03] rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-primary text-xs font-semibold mb-5">
            <Trophy className="h-3.5 w-3.5" />
            Sistema de Pontuação
          </div>
          
          

          
        </div>

        <div className="bg-card rounded-2xl md:rounded-3xl border border-foreground/5 overflow-hidden shadow-2xl">
          















          

          <div className="p-4 md:p-6 lg:p-8">
            <ScoreCard mode={mode} />
          </div>

          <div className="border-t border-foreground/5 p-4 md:p-6 lg:p-8">
            <h3 className="text-xs text-foreground uppercase font-bold tracking-wider text-center mb-5">Recursos extras</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-foreground/5 bg-background p-4 flex items-center gap-3 hover:border-amber-500/20 transition-all">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Multiplicador de Pontos</h4>
                  <p className="text-[11px] text-muted-foreground">Rodadas finais valem 2x, 3x ou mais</p>
                </div>
              </div>
              <div className="rounded-xl border border-foreground/5 bg-background p-4 flex items-center gap-3 hover:border-primary/20 transition-all">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Palpites de Mata-Mata</h4>
                  <p className="text-[11px] text-muted-foreground">Bônus por acertar quem avança de fase</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-foreground/5 p-5 md:p-6 text-center bg-gradient-to-t from-emerald-500/[0.03] to-transparent">
            <a href="#planos" className="inline-flex items-center justify-center gap-3 px-10 py-4 md:py-5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-bold text-base md:text-lg transition-all hover:scale-[1.02] shadow-[0_20px_60px_rgba(16,185,129,0.3)]">
              Criar meu Bolão
              <ArrowRight className="w-5 h-5" />
            </a>
            
          </div>
        </div>
      </div>
    </section>);

}

function ArrowRight(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>);

}

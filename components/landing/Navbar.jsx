import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Como Funciona", href: "#como-funciona" },
    { label: "Pontuação", href: "#pontuacao" },
    { label: "FAQ", href: "#faq" }
  ];

  return (
    <nav className="border-b border-primary/30 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
        <div className="flex justify-between items-center">
          <a href="#" className="flex items-center gap-3">
            {logo-esquerda.png}
            <img src="/logo-esquerda.png" alt="Bolão DRH-1" className="w-12 h-12 md:w-14 md:h-14 object-contain" />
            <span className="text-lg md:text-xl font-black text-foreground tracking-wide">BOLÃO DRH-1</span>
          </a>

          {/* Links Desktop Ocultados no original, mantendo a estrutura limpa */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <a key={l.label} href={l.href} className="text-foreground/80 hover:text-primary font-medium transition-colors">
                {l.label}
              </a>
            ))}
            <a href="/auth/login" className="bg-primary text-primary-foreground font-bold rounded-full px-6 py-2.5 transition-transform hover:scale-105">
              Fazer Login
            </a>
          </div>

          <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-primary/30 mt-3 pt-3 pb-4">
            <div className="flex flex-col gap-3">
              {links.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-foreground/80 hover:text-primary text-sm font-medium py-2 transition-colors">
                  {l.label}
                </a>
              ))}
              <a href="/auth/login" className="bg-primary text-primary-foreground font-bold rounded-full px-6 py-3 text-sm text-center mt-2">
                Fazer Login
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

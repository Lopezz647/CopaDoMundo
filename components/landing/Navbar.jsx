import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar({ logoUrl }) {
  const [open, setOpen] = useState(false);

  const links = [
  { label: "Como Funciona", href: "#como-funciona" },
  { label: "Pontuação", href: "#pontuacao" },
  { label: "", href: "#planos" },
  { label: "FAQ", href: "#faq" }];


  return (
    <nav className="border-b border-primary/30 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
        <div className="flex justify-between items-center">
          <a href="#" className="flex items-center gap-3">
            <img src="https://media.base44.com/images/public/6a0c82c9d61e67491048f779/0b7fe616f_Design_sem_nome__1_.png" alt="Bolão AI" className="w-12 h-12 md:w-14 md:h-14 rounded-xl" />
            <span className="text-lg md:text-xl font-black text-foreground tracking-wide">BOLÃO DRH-1</span>
          </a>

          








          

          <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open &&
        <div className="md:hidden border-t border-primary/30 mt-3 pt-3 pb-4">
            <div className="flex flex-col gap-3">
              {links.map((l) =>
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-foreground/80 hover:text-primary text-sm font-medium py-2 transition-colors">
                  {l.label}
                </a>
            )}
              <a href="#hero" className="bg-primary text-primary-foreground font-bold rounded-full px-6 py-3 text-sm text-center mt-2">
                Criar Bolão
              </a>
            </div>
          </div>
        }
      </div>
    </nav>);

}

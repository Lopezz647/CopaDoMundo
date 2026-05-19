export default function Footer({ logoUrl }) {
  return (
    <footer className="border-t border-primary/20 bg-background py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="https://media.base44.com/images/public/6a0c82c9d61e67491048f779/0b7fe616f_Design_sem_nome__1_.png" alt="Bolão AI" className="w-10 h-10 rounded-lg" />
            <span className="text-foreground font-bold">BOLÃO DRH-1</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <a href="#como-funciona" className="hover:text-primary transition-colors">Como Funciona</a>
            <a href="#pontuacao" className="hover:text-primary transition-colors">Pontuação</a>
            
            
          </div>
          
        </div>
      </div>
    </footer>);

}

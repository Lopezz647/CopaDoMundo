import Sidebar from "@/components/layout/Sidebar";
import UserHeader from "@/components/layout/UserHeader"; // Se o seu AppLayout usava isso

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Essa é a estrutura visual do seu antigo AppLayout.jsx
    // Garantindo o fundo preto e a cor do texto do novo design
    <div className="flex h-screen w-full bg-[#0d0d0d] text-[#e5e2e1] overflow-hidden">
      
      {/* O menu lateral entra aqui */}
      <Sidebar />
      
      {/* O conteúdo principal da página (Home, Palpites, Ranking) vai renderizar aqui dentro do children */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Se você tiver um header no topo do AppLayout antigo, coloque aqui */}
        {/* <UserHeader /> */} 
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
      
    </div>
  );
}

import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // A mágica acontece aqui: A classe "dashboard-theme" ativa o design escuro e verde APENAS no painel
    <div className="dashboard-theme flex h-screen w-full bg-background text-foreground overflow-hidden">
      
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
      
    </div>
  );
}

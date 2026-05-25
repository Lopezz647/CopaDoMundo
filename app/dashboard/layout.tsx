import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Adicionamos o 'dashboard-theme' de volta aqui para puxar o fundo preto e verde!
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

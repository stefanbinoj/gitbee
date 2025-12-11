import { Sidebar } from "@/components/sidebar";
import { DashboardHeader } from "@/app/components/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-neutral-900 text-neutral-200 font-sans selection:bg-yellow-500/30 bg-dark">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-auto bg-neutral-950 p-6 scrollbar-thin scrollbar-thumb-neutral-800">
          {children}
        </main>
      </div>
    </div>
  );
}

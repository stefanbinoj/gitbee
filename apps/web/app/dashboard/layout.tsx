import { Sidebar } from "../../components/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-[#0A0A0A] p-6">
        {children}
      </main>
    </div>
  )
}

  import { Bell, RefreshCw } from "lucide-react" 
  import { Sidebar } from "../../components/sidebar"
  import { Button } from "@/components/ui/button"
  
  export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="flex h-screen bg-neutral-900 text-neutral-200 font-sans selection:bg-yellow-500/30 bg-dark">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
             {/* Top Toolbar */}
            <div className="h-16 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between px-6 shrink-0 z-10">
              <div className="flex items-center gap-4">
                <div className="text-sm text-neutral-400 font-medium tracking-wide">
                  TACTICAL COMMAND / <span className="text-yellow-500 font-bold">OVERVIEW</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:block text-xs text-neutral-500 font-mono">LAST UPDATE: {new Date().toLocaleTimeString()} UTC</div>
                <div className="h-4 w-px bg-neutral-800 mx-2 hidden md:block" />
                <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-yellow-500 hover:bg-neutral-800">
                  <Bell className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-yellow-500 hover:bg-neutral-800">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <main className="flex-1 overflow-auto bg-neutral-950 p-6 scrollbar-thin scrollbar-thumb-neutral-800">
                {children}
            </main>
        </div>
      </div>
    )
  }

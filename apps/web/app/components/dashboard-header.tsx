"use client"

import { usePathname } from "next/navigation"
import { Bell, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

type PageConfig = {
  title: string
  breadcrumb: string
  description: string
}

const pageConfigs: Record<string, PageConfig> = {
  "/dashboard": {
    title: "COMMAND CENTER",
    breadcrumb: "OVERVIEW",
    description: "Overview of your GitBee activity",
  },
  "/dashboard/logs": {
    title: "ACTIVITY LOGS",
    breadcrumb: "LOGS",
    description: "Monitor GitBee's actions and system events",
  },
  "/dashboard/settings": {
    title: "SETTINGS",
    breadcrumb: "SETTINGS",
    description: "Configure GitBee and manage preferences",
  },
  "/dashboard/knowledgebase": {
    title: "KNOWLEDGE BASE",
    breadcrumb: "INTELLIGENCE",
    description: "Manage documentation sources",
  },
  "/dashboard/context": {
    title: "AI CONTEXT",
    breadcrumb: "CONTEXT",
    description: "Manage AI memory and context sources",
  },
  "/dashboard/integrations": {
    title: "INTEGRATIONS",
    breadcrumb: "INTEGRATIONS",
    description: "Connect with your favorite tools",
  },
  "/dashboard/billing": {
    title: "BILLING",
    breadcrumb: "BILLING",
    description: "Manage subscription and payments",
  },
  "/dashboard/api-keys": {
    title: "API KEYS",
    breadcrumb: "API KEYS",
    description: "Manage your API keys",
  },
}

export function DashboardHeader() {
  const pathname = usePathname()
  const config = pageConfigs[pathname] || pageConfigs["/dashboard"]

  return (
    <div className="h-16 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between px-6 shrink-0 z-10">
      <div className="flex items-center gap-4">
        <div className="text-sm text-neutral-400 font-medium tracking-wide">
          GITBEE / <span className="text-yellow-500 font-bold">{config.breadcrumb}</span>
        </div>
        <div className="hidden lg:block h-4 w-px bg-neutral-700" />
        <p className="hidden lg:block text-xs text-neutral-500">{config.description}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs text-neutral-500">All systems operational</span>
        </div>
        <div className="h-4 w-px bg-neutral-800 mx-2 hidden md:block" />
        <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-yellow-500 hover:bg-neutral-800">
          <Bell className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-yellow-500 hover:bg-neutral-800">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

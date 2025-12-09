"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChevronsLeft,
  ChevronsRight,
  Home,
  FileText,
  Settings,
  Book,
  Brain,
  Puzzle,
  CreditCard,
  Key,
  LogOut,
  User,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const NavItem = ({
  href,
  icon: Icon,
  label,
  collapsed,
  active,
  badge,
}: {
  href: string
  icon: any
  label: string
  collapsed: boolean
  active: boolean
  badge?: React.ReactNode
}) => {
  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-accent md:h-10 md:w-10",
              active ? "bg-[#111] text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="sr-only">{label}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-4">
          {label}
          {badge && <span className="ml-auto text-muted-foreground">{badge}</span>}
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
        active ? "bg-[#111] text-primary" : "text-muted-foreground"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
      {badge && <span className="ml-auto flex items-center gap-1">{badge}</span>}
    </Link>
  )
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = React.useState(false)
  const pathname = usePathname()

  const primaryNav = [
    {
      href: "/dashboard",
      icon: Home,
      label: "Home",
      badge: (
        <>
          <span className="rounded-full bg-green-500/10 px-1.5 py-0.5 text-xs text-green-500">
            +8%
          </span>
          <span className="text-xs text-muted-foreground">42</span>
        </>
      ),
    },
    { href: "/dashboard/logs", icon: FileText, label: "Logs" },
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
    { href: "/dashboard/knowledgebase", icon: Book, label: "Knowledgebase" },
    { href: "/dashboard/context", icon: Brain, label: "Context" },
  ]

  const secondaryNav = [
    { href: "/dashboard/integrations", icon: Puzzle, label: "Integrations" },
    { href: "/dashboard/billing", icon: CreditCard, label: "Billing" },
    { href: "/dashboard/api-keys", icon: Key, label: "API Keys" },
  ]

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-card transition-[width] duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Top Section */}
      <div className={cn("flex items-center h-16 px-4", collapsed ? "justify-center" : "justify-between")}>
        <div className="flex items-center gap-2 overflow-hidden">
             {!collapsed && (
                <div className="flex items-center gap-2">
                     <div className="flex bg-gradient-to-br from-primary to-purple-500 w-8 h-8 rounded-full items-center justify-center shrink-0">
                        <span className="font-bold text-white text-xs">G</span>
                     </div>
                     <span className="text-lg font-bold tracking-tight">GitBee</span>
                </div>
            )}
             {collapsed && (
                 <div className="flex bg-gradient-to-br from-primary to-purple-500 w-8 h-8 rounded-full items-center justify-center shrink-0">
                    <span className="font-bold text-white text-xs">G</span>
                 </div>
            )}
        </div>
         <Button
            variant="ghost"
            size="icon"
            className={cn("h-6 w-6 shrink-0", collapsed ? "hidden" : "flex")}
            onClick={() => setCollapsed(!collapsed)}
        >
             <ChevronsLeft className="h-4 w-4" />
        </Button>
      </div>
      
       {collapsed && (
           <div className="flex justify-center pb-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
           </div>
       )}

      <Separator />

      {/* Navigation */}
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {primaryNav.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              collapsed={collapsed}
              active={pathname === item.href}
            />
          ))}
        </nav>

        <div className="my-4 px-2">
           <Separator className="my-2" />
        </div>
        
        <nav className="grid gap-1 px-2">
          {secondaryNav.map((item) => (
             <NavItem
              key={item.href}
              {...item}
              collapsed={collapsed}
              active={pathname === item.href}
            />
          ))}
        </nav>
      </div>

       <div className="mt-auto p-4 border-t border-border">
            <div className={cn("flex items-center gap-3", collapsed ? "justify-center" : "")}>
                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                     <User className="h-5 w-5 text-muted-foreground" />
                </div>
                 {!collapsed && (
                     <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-medium">Stefan Binoj</p>
                        <p className="truncate text-xs text-muted-foreground">Admin</p>
                     </div>
                 )}
                  {!collapsed && (
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <LogOut className="h-4 w-4" />
                     </Button>
                  )}
            </div>
       </div>
    </div>
  )
}

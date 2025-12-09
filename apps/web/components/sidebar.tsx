"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  ChevronsLeft,
  ChevronsRight,
  Monitor,
  Settings,
  Shield,
  Target,
  Users,
  Brain,
  Puzzle,
  CreditCard,
  Key,
  LogOut,
  User,
  Activity,
  FileText
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
              "flex h-9 w-9 items-center justify-center rounded transition-colors hover:text-yellow-500 md:h-10 md:w-10",
              active ? "bg-yellow-500 text-neutral-900 font-bold" : "text-neutral-400"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="sr-only">{label}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-4 bg-neutral-900 border-neutral-700 text-yellow-500">
          {label}
          {badge && <span className="ml-auto text-neutral-400">{badge}</span>}
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 rounded p-3 text-sm font-medium transition-colors hover:text-yellow-500",
        active ? "bg-yellow-500 text-neutral-900 font-bold" : "text-neutral-400"
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="whitespace-nowrap">{label.toUpperCase()}</span>
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
      icon: Monitor,
      label: "Command Center",
      badge: (
        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
      ),
    },
    { href: "/dashboard/logs", icon: FileText, label: "Logs" },
    { href: "/dashboard/settings", icon: Settings, label: "Systems" },
    { href: "/dashboard/knowledgebase", icon: Shield, label: "Intelligence" },
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
        "flex flex-col border-r border-neutral-800 bg-neutral-900 transition-[width] duration-300 ease-in-out",
        collapsed ? "w-16" : "w-72",
        className
      )}
    >
      {/* Top Section */}
      <div className={cn("flex items-center h-20 px-4", collapsed ? "justify-center" : "justify-between")}>
        <div className={cn("overflow-hidden transition-all duration-300", collapsed ? "w-0 opacity-0" : "w-32 opacity-100")}>
            <div className="relative h-8 w-32 whitespace-nowrap">
               <Image 
                 src="/gitbee.png" 
                 alt="GitBee" 
                 fill
                 className="object-contain object-left"
                 priority
               />
            </div>
        </div>
         <Button
            variant="ghost"
            size="icon"
            className="text-neutral-400 hover:text-yellow-500 shrink-0"
            onClick={() => setCollapsed(!collapsed)}
        >
             {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        </Button>
      </div>

      <Separator className="bg-neutral-800" />

      {/* Navigation */}
      <div className="flex-1 overflow-auto py-4 scrollbar-thin scrollbar-thumb-neutral-800">
        <nav className="grid gap-1 px-4">
          {primaryNav.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              collapsed={collapsed}
              active={pathname === item.href}
            />
          ))}
        </nav>

        <div className="my-4 px-4">
           <div className="h-px bg-neutral-800" />
        </div>
        
        <nav className="grid gap-1 px-4">
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

       <div className="mt-auto p-4 border-t border-neutral-800">
            <div className={cn("flex items-center gap-3", collapsed ? "justify-center" : "")}>
                <div className="h-9 w-9 rounded-full bg-neutral-800 flex items-center justify-center shrink-0">
                     <User className="h-5 w-5 text-neutral-400" />
                </div>
                 <div className={cn("flex items-center gap-3 overflow-hidden transition-all duration-300", collapsed ? "w-0 opacity-0" : "flex-1 opacity-100")}>
                     <div className="flex-1 overflow-hidden whitespace-nowrap">
                        <p className="truncate text-sm font-medium text-neutral-200">Stefan Binoj</p>
                        <p className="truncate text-xs text-neutral-500">Admin</p>
                     </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-yellow-500 shrink-0">
                        <LogOut className="h-4 w-4" />
                     </Button>
                 </div>
            </div>
       </div>
    </div>
  )
}

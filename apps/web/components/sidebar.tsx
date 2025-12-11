"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChevronsLeft,
  ChevronsRight,
  Monitor,
  Settings,
  Puzzle,
  CreditCard,
  Key,
  LogOut,
  FileText,
  Brain,
  ShieldAlert,
  BookOpen,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/authClient";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const NavItem = ({
  href,
  icon: Icon,
  label,
  collapsed,
  active,
  badge,
}: {
  href: string;
  icon: any;
  label: string;
  collapsed: boolean;
  active: boolean;
  badge?: React.ReactNode;
}) => {
  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={cn(
              "cursor-pointer flex h-9 w-9 items-center justify-center rounded transition-colors md:h-10 md:w-10",
              active
                ? "bg-yellow-500 text-neutral-900 font-bold"
                : "text-neutral-400 hover:text-yellow-500"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="sr-only">{label}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className="flex items-center gap-4 bg-neutral-900 border-neutral-700 text-yellow-500"
        >
          {label}
          {badge && <span className="ml-auto text-neutral-400">{badge}</span>}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 rounded p-3 text-sm font-medium transition-colors",
        active
          ? "bg-yellow-500 text-neutral-900 font-bold"
          : "text-neutral-400 hover:text-yellow-500"
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="whitespace-nowrap">{label.toUpperCase()}</span>
      {badge && (
        <span className="ml-auto flex items-center gap-1">{badge}</span>
      )}
    </Link>
  );
};

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const pathname = usePathname();

  const primaryNav = [
    {
      href: "/dashboard",
      icon: Monitor,
      label: "Overview",
    },
    { href: "/dashboard/logs", icon: FileText, label: "Logs" },
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
    { href: "/dashboard/rules", icon: Brain, label: "Rules" },
    { href: "/dashboard/block", icon: ShieldAlert, label: "Blocked" },
    { href: "/dashboard/docs", icon: BookOpen, label: "Docs" },
  ];

  const secondaryNav = [
    { href: "/dashboard/integrations", icon: Puzzle, label: "Integrations" },
    { href: "/dashboard/billing", icon: CreditCard, label: "Billing" },
    { href: "/dashboard/api-keys", icon: Key, label: "API Keys" },
  ];

  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <div
      className={cn(
        "flex flex-col border-r border-neutral-800 bg-neutral-900 transition-[width] duration-300 ease-in-out",
        collapsed ? "w-16" : "w-72",
        className
      )}
    >
      {/* Top Section */}
      <div
        className={cn(
          "flex items-center h-14 px-4",
          collapsed ? "justify-center" : "justify-between"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2 overflow-hidden transition-all duration-300",
            collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          )}
        >
          <Image
            src="/gitbee.png"
            alt="GitBee"
            height={28}
            width={28}
            className="object-contain"
            priority
          />
          <span className="font-bold text-lg text-yellow-500">GitBee</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-neutral-400 hover:text-yellow-500 hover:bg-transparent shrink-0 cursor-pointer"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <ChevronsLeft className="h-4 w-4" />
          )}
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

      {/* User Controls */}
      {session?.user && (
        <>
          <Separator className="bg-neutral-700" />
          <div className="p-4 border-t border-neutral-700">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full flex items-center gap-3 h-auto py-2 px-2 hover:bg-neutral-800 rounded-lg group transition-all duration-200 outline-none ring-0",
                    collapsed ? "justify-center" : "justify-start"
                  )}
                >
                  <Avatar className="h-9 w-9 border border-neutral-600 transition-colors group-hover:border-yellow-500/50">
                    <AvatarImage
                      src={session.user.image || ""}
                      alt={session.user.name || "User"}
                    />
                    <AvatarFallback className="bg-neutral-800 text-neutral-400">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>

                  {!collapsed && (
                    <div className="flex flex-col items-start overflow-hidden">
                      <span className="text-sm font-medium text-neutral-200 truncate w-full group-hover:text-yellow-500 transition-colors">
                        {session.user.name}
                      </span>
                      <span className="text-xs text-neutral-500 truncate w-full">
                        {session.user.email}
                      </span>
                    </div>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                align="start"
                sideOffset={10}
                className="w-64 p-2 bg-neutral-900 border border-neutral-700 text-neutral-200 shadow-xl shadow-black/50 mb-2"
              >
                <div className="flex flex-col gap-1">
                  <div className="px-2 py-1.5 border-b border-neutral-800 mb-1">
                    <p className="text-sm font-medium text-white truncate">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-neutral-500 truncate">
                      {session.user.email}
                    </p>
                  </div>

                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-neutral-800 hover:text-yellow-500 transition-colors cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <div className="h-px bg-neutral-800 my-1" />
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors w-full text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </>
      )}
    </div>
  );
}

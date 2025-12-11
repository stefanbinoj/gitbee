"use client";

import { usePathname } from "next/navigation";

type PageConfig = {
  title: string;
  breadcrumb: string;
  description: string;
};

const pageConfigs: Record<string, PageConfig> = {
  "/dashboard": {
    title: "COMMAND CENTER",
    breadcrumb: "OVERVIEW",
    description: "Overview of your GitBee activity",
  },
  "/dashboard/logs": {
    title: "LOGS",
    breadcrumb: "LOGS",
    description: "View and manage logs",
  },
  "/dashboard/settings": {
    title: "SETTINGS",
    breadcrumb: "SETTINGS",
    description: "Configure GitBee and manage preferences",
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
  "/dashboard/rules": {
    title: "RULES",
    breadcrumb: "RULES",
    description: "Manage automated moderation rules",
  },
  "/dashboard/block": {
    title: "BLOCKED USERS",
    breadcrumb: "BLOCKED",
    description: "Manage blocked users and restrictions",
  },
  "/dashboard/docs": {
    title: "DOCUMENTATION",
    breadcrumb: "DOCS",
    description: "Guides and reference materials",
  },
  "/dashboard/profile": {
    title: "PROFILE",
    breadcrumb: "PROFILE",
    description: "Manage your account settings",
  },
};

export function DashboardHeader() {
  const pathname = usePathname();
  const config = pageConfigs[pathname] || pageConfigs["/dashboard"];
  return (
    <div className="h-16 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between px-6 shrink-0 z-10">
      <div className="flex items-center gap-4">
        <div className="text-sm text-neutral-400 font-medium tracking-wide">
          GITBEE /{" "}
          <span className="text-yellow-500 font-bold">{config.breadcrumb}</span>
        </div>
      </div>
    </div>
  );
}

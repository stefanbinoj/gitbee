"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Shield,
  AlertTriangle,
  UserX,
  MoreHorizontal,
} from "lucide-react";

type BlockedUser = {
  id: string;
  username: string;
  avatar: string;
  reason: string;
  repository: string;
  dateBlocked: string;
  status: "blocked" | "restricted" | "warning";
  riskLevel: "high" | "medium" | "low";
};

export default function BlockPage() {
  const [blockedUsers] = useState<BlockedUser[]>([
    {
      id: "1",
      username: "bad_actor_99",
      avatar: "https://github.com/shadcn.png",
      reason: "Excessive spam comments",
      repository: "gitbee/core",
      dateBlocked: "2024-03-10 14:30:00",
      status: "blocked",
      riskLevel: "high",
    },
    {
      id: "2",
      username: "script_kiddie",
      avatar: "https://github.com/shadcn.png",
      reason: "Suspicious PR patterns",
      repository: "gitbee/web",
      dateBlocked: "2024-03-09 09:15:00",
      status: "warning",
      riskLevel: "medium",
    },
    {
      id: "3",
      username: "bot_network_1",
      avatar: "https://github.com/shadcn.png",
      reason: "Automated engagement farming",
      repository: "all repositories",
      dateBlocked: "2024-03-08 18:45:00",
      status: "blocked",
      riskLevel: "high",
    },
    {
      id: "4",
      username: "unknown_user_x",
      avatar: "https://github.com/shadcn.png",
      reason: "Violation of code of conduct",
      repository: "gitbee/docs",
      dateBlocked: "2024-03-05 11:20:00",
      status: "restricted",
      riskLevel: "low",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "blocked":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      case "restricted":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "warning":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      default:
        return "text-neutral-400 bg-neutral-500/10 border-neutral-500/20";
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-red-400";
      case "medium":
        return "text-amber-400";
      case "low":
        return "text-neutral-400";
      default:
        return "text-neutral-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-yellow-500/10 rounded-full">
            <Shield className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-neutral-300 tracking-wider uppercase">
              Blocked Users
            </h2>
            <p className="text-sm text-neutral-400 mt-1">
              Manage users restricted from interacting with your repositories
            </p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <Input
              placeholder="Search users, reasons, or repositories"
              className="pl-9 bg-neutral-900 border-neutral-800 text-neutral-300 placeholder:text-neutral-600 focus-visible:ring-1 focus-visible:ring-neutral-700 h-9"
            />
          </div>
          <Button
            variant="outline"
            className="bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white h-9 gap-2 text-sm font-normal"
          >
            Status: All
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </Button>
        </div>

        {/* Table Section */}
        <div className="border border-neutral-800 rounded-md bg-neutral-900/50 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-neutral-800 bg-neutral-900 text-xs font-medium text-neutral-500 uppercase tracking-wider">
            <div className="col-span-3">User</div>
            <div className="col-span-3">Reason</div>
            <div className="col-span-2">Repository</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Date Blocked</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-neutral-800">
            {blockedUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
                <Shield className="w-12 h-12 mb-4 opacity-20" />
                <p>No blocked users found</p>
              </div>
            ) : (
              blockedUsers.map((user) => (
                <div
                  key={user.id}
                  className="grid grid-cols-12 gap-4 px-4 py-3 items-center text-sm hover:bg-neutral-800/30 transition-colors group"
                >
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden border border-neutral-700">
                      <UserX className="w-4 h-4 text-neutral-400" />
                    </div>
                    <div>
                      <div className="font-medium text-neutral-300 truncate">
                        {user.username}
                      </div>
                      <div
                        className={`text-xs ${getRiskColor(user.riskLevel)}`}
                      >
                        ID: {user.id} • {user.riskLevel.toUpperCase()} RISK
                      </div>
                    </div>
                  </div>
                  <div className="col-span-3 text-neutral-400 flex items-center gap-2 truncate">
                    <span className="truncate" title={user.reason}>
                      {user.reason}
                    </span>
                    {user.riskLevel === "high" && (
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                    )}
                  </div>
                  <div className="col-span-2 text-neutral-500 font-mono text-xs truncate">
                    {user.repository}
                  </div>
                  <div className="col-span-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-medium border ${getStatusColor(
                        user.status,
                      )}`}
                    >
                      {user.status}
                    </span>
                  </div>
                  <div className="col-span-2 text-right text-neutral-500 text-xs font-mono">
                    {new Date(user.dateBlocked).toLocaleDateString()}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between text-xs text-neutral-500 mt-6">
          <div className="flex items-center gap-2">
            <span>Items per page:</span>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800 text-xs font-mono"
            >
              10
              <ChevronDown className="w-3 h-3 ml-1.5 opacity-50" />
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <span>Page 1 of 1</span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-neutral-800 text-neutral-500 hover:text-neutral-300 disabled:opacity-30"
                disabled
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-neutral-800 text-neutral-500 hover:text-neutral-300 disabled:opacity-30"
                disabled
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

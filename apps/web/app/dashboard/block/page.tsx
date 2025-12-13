"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  Loader2,
  ExternalLink,
} from "lucide-react";
import { api } from "@/lib/api";
import { authClient, type Session } from "@/lib/authClient";

type WarningType = "warning" | "block";

type Warning = {
  id: number;
  installationId: number;
  repositoryId: number;
  repositoryFullName: string;
  userLogin: string;
  userId: number;
  type: WarningType;
  reason: string;
  url: string | null;
  createdAt: Date | string;
};

export default function BlockPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | WarningType>("all");

  const { data: session } = authClient.useSession() as {
    data: Session | null;
  };

  const githubAccountId = session?.session?.githubAccountId;

  const {
    data: warnings = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["warnings", githubAccountId],
    queryFn: async () => {
      if (!githubAccountId) return [];

      const response = await api.api.users
        .warnings({
          githubAccountId: String(githubAccountId),
        })
        .get();

      return (response.data?.warnings ?? []) as Warning[];
    },
    enabled: !!githubAccountId,
  });

  // Filter warnings based on search and status
  const filteredWarnings = warnings.filter((warning) => {
    const matchesSearch =
      searchQuery === "" ||
      warning.userLogin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warning.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warning.repositoryFullName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || warning.type === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: WarningType) => {
    switch (status) {
      case "block":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      case "warning":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      default:
        return "text-neutral-400 bg-neutral-500/10 border-neutral-500/20";
    }
  };

  const getStatusLabel = (status: WarningType) => {
    switch (status) {
      case "block":
        return "Blocked";
      case "warning":
        return "Warning";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Failed to load blocked users</p>
      </div>
    );
  }

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
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <Input
              placeholder="Search users, reasons, or repositories"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-neutral-900 border-neutral-800 text-neutral-300 placeholder:text-neutral-600 focus-visible:ring-1 focus-visible:ring-neutral-700 h-9"
            />
          </div>
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => {
                const next =
                  statusFilter === "all"
                    ? "block"
                    : statusFilter === "block"
                      ? "warning"
                      : "all";
                setStatusFilter(next);
              }}
              className="bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white h-9 gap-2 text-sm font-normal"
            >
              Status:{" "}
              {statusFilter === "all" ? "All" : getStatusLabel(statusFilter)}
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </Button>
          </div>
        </div>

        {/* Table Section */}
        <div className="border border-neutral-800 rounded-md bg-neutral-900/50 overflow-hidden">
          {/* Desktop Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 border-b border-neutral-800 bg-neutral-900 text-xs font-medium text-neutral-500 uppercase tracking-wider">
            <div className="col-span-2">User</div>
            <div className="col-span-3">Reason</div>
            <div className="col-span-2">Repository</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-1 text-center">URL</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-neutral-800">
            {filteredWarnings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
                <Shield className="w-12 h-12 mb-4 opacity-20" />
                <p>
                  {warnings.length === 0
                    ? "No blocked users found"
                    : "No users match your search"}
                </p>
              </div>
            ) : (
              filteredWarnings.map((warning) => (
                <div key={warning.id}>
                  {/* Mobile Card Layout */}
                  <div className="md:hidden p-4 space-y-3 border-b border-neutral-700">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden border border-neutral-700">
                          <UserX className="w-4 h-4 text-neutral-400" />
                        </div>
                        <div>
                          <div className="font-medium text-neutral-300">
                            {warning.userLogin}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-medium border ${getStatusColor(warning.type)}`}
                      >
                        {getStatusLabel(warning.type)}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-neutral-500 shrink-0">
                          Reason:
                        </span>
                        <span className="text-neutral-400 flex items-center gap-1">
                          {warning.reason}
                          {warning.type === "block" && (
                            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-500">Repository:</span>
                        <span className="text-neutral-400 font-mono text-xs">
                          {warning.repositoryFullName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-500">Date:</span>
                        <span className="text-neutral-400 font-mono text-xs">
                          {new Date(warning.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      {warning.url && (
                        <a
                          href={warning.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors text-sm flex items-center gap-1"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Desktop Row Layout */}
                  <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 items-center text-sm hover:bg-neutral-800/30 transition-colors group">
                    <div className="col-span-2 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden border border-neutral-700">
                        <UserX className="w-4 h-4 text-neutral-400" />
                      </div>
                      <div>
                        <div className="font-medium text-neutral-300 truncate">
                          {warning.userLogin}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-3 text-neutral-400 flex items-center gap-2 truncate">
                      <span className="truncate" title={warning.reason}>
                        {warning.reason}
                      </span>
                      {warning.type === "block" && (
                        <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                      )}
                    </div>
                    <div className="col-span-2 text-neutral-500 font-mono text-xs truncate">
                      {warning.repositoryFullName}
                    </div>
                    <div className="col-span-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-medium border ${getStatusColor(warning.type)}`}
                      >
                        {getStatusLabel(warning.type)}
                      </span>
                    </div>
                    <div className="col-span-2 text-neutral-500 text-xs font-mono">
                      {new Date(warning.createdAt).toLocaleDateString()}
                    </div>
                    <div className="col-span-1 flex justify-center">
                      {warning.url && (
                        <a
                          href={warning.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 mt-6">
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
            <span>
              {filteredWarnings.length} result
              {filteredWarnings.length !== 1 ? "s" : ""}
            </span>
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

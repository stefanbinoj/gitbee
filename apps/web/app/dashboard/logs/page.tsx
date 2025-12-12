"use client";

import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  GitBranch,
  AlertTriangle,
  Loader2,
  FileText,
  ExternalLink,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { authClient, type Session } from "@/lib/authClient";
import { api } from "@/lib/api";

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "text-green-500 bg-green-500/10 border-green-500/20";
    case "failed":
      return "text-red-500 bg-red-500/10 border-red-500/20";
    case "in_progress":
      return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    default:
      return "text-neutral-400 bg-neutral-500/10 border-neutral-500/20";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "completed":
      return "Success";
    case "failed":
      return "Failed";
    case "in_progress":
      return "In Progress";
    default:
      return status;
  }
};

const getReportTypeLabel = (type: string) => {
  switch (type) {
    case "ingestion":
      return "Ingestion";
    case "comment_analysis":
      return "Comment Analysis";
    case "pr_analysis":
      return "PR Analysis";
    default:
      return type;
  }
};

export default function LogsPage() {
  const { data: session } = authClient.useSession() as {
    data: Session | null;
  };

  const {
    data: reports = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reports", session?.session?.githubAccountId],
    queryFn: async () => {
      if (!session?.session?.githubAccountId) {
        return [];
      }

      const response = await api.api.users
        .reports({
          githubAccountId: session.session.githubAccountId.toString(),
        })
        .get();

      return response.data?.reports || [];
    },
    enabled: !!session?.session?.githubAccountId,
  });

  const logs = reports.map((report) => {
    const createdDate = new Date(report.createdAt);
    const month = createdDate.toLocaleString("default", { month: "short" });
    const day = createdDate.getDate();
    const hours = createdDate.getHours().toString().padStart(2, "0");
    const minutes = createdDate.getMinutes().toString().padStart(2, "0");

    return {
      id: report.id.toString(),
      title: getReportTypeLabel(report.reportType),
      type: report.reportType,
      repository: report.repositoryFullName || "Unknown",
      branch: "main",
      date: `${day} ${month} ${hours}:${minutes}`,
      url: report.url || null,
      status: report.status,
      statusLabel: getStatusLabel(report.status),
      timeTaken: report.completedAt
        ? new Date(report.completedAt).getTime() -
          new Date(report.createdAt).getTime()
        : null,
    };
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
        <span className="ml-2 text-neutral-400">Loading logs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400">Failed to fetch reports</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-yellow-500/10 rounded-full">
            <FileText className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-neutral-300 tracking-wider uppercase">
              Activity Logs
            </h2>
            <p className="text-sm text-neutral-400 mt-1">
              View all system activity, reports, and analysis history
            </p>
          </div>
        </div>

        {/* Table Section */}
        <div className="border border-neutral-800 rounded-md bg-neutral-900/50 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-neutral-800 bg-neutral-900 text-xs font-medium text-neutral-500 uppercase tracking-wider">
            <div className="col-span-1">#</div>
            <div className="col-span-3">Name</div>
            <div className="col-span-3">Repository</div>
            <div className="col-span-2">Branch</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1">Date</div>
            <div className="col-span-1 text-center">URL</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-neutral-800">
            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
                <p>No relevant logs found</p>
              </div>
            ) : (
              logs.map((log, idx) => (
                <div
                  key={log.id}
                  className="grid grid-cols-12 gap-4 px-4 py-3 items-center text-sm hover:bg-neutral-800/30 transition-colors"
                >
                  <div className="col-span-1 text-neutral-500 font-mono text-xs">
                    {idx + 1}
                  </div>
                  <div className="col-span-3 font-medium text-neutral-300 truncate">
                    {log.title}
                  </div>
                  <div className="col-span-3 text-neutral-400 flex items-center gap-2 truncate">
                    <span className="truncate">{log.repository}</span>
                  </div>
                  <div className="col-span-2 text-neutral-500 flex items-center gap-1.5 text-xs font-mono">
                    <GitBranch className="w-3 h-3" />
                    {log.branch}
                  </div>
                  <div className="col-span-1">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-medium border ${getStatusColor(
                        log.status,
                      )}`}
                    >
                      {log.statusLabel}
                    </span>
                  </div>
                  <div className="col-span-1 text-neutral-500 text-xs font-mono">
                    {log.date}
                  </div>
                  <div className="col-span-1 flex justify-center">
                    {log.url && (
                      <a
                        href={log.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
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

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  GitBranch,
  AlertTriangle,
  Loader2,
  FileText,
} from "lucide-react";
import { authClient, type Session } from "@/lib/authClient";
import { api } from "@/lib/api";

type Report = {
  repositoryFullName: string | null;
  id: number;
  installationId: number;
  repositoryId: number;
  targetId: number;
  reportType: "ingestion" | "comment_analysis" | "pr_analysis";
  status: "in_progress" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};

type LogEntry = {
  id: string;
  title: string;
  type: string;
  repository: string;
  branch: string;
  date: string;
  status: string;
  timeTaken: string | null;
};

export default function LogsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = authClient.useSession() as { data: Session | null };

  useEffect(() => {
    const fetchReports = async () => {
      if (!session?.session?.githubAccountId) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.api.users
          .reports({
            githubAccountId: session.session.githubAccountId.toString(),
          })
          .get();
        if (response.data && response.data.reports) {
          // Convert Date objects to strings for our Report type
          const formattedReports = response.data.reports.map((report: any) => ({
            ...report,
            createdAt: report.createdAt.toISOString(),
            updatedAt: report.updatedAt.toISOString(),
            completedAt: report.completedAt?.toISOString() || null,
          }));
          setReports(formattedReports);
        } else {
          setError("Failed to fetch reports");
        }
      } catch (err) {
        setError("Failed to fetch reports");
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [session]);

  const formatDuration = (start: string, end: string | null) => {
    if (!end) return null;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = endDate.getTime() - startDate.getTime();
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  const logs: LogEntry[] = reports.map((report: Report) => {
    const isIngestion = report.reportType === "ingestion";
    let title = `${report.reportType.replace("_", " ").toUpperCase()} #${report.id}`;
    if (isIngestion) title = "Ingestion";

    return {
      id: report.id.toString(),
      title,
      type: report.reportType,
      repository: report.repositoryFullName || "Unknown",
      branch: "main", // Placeholder as branch info is not available in Report
      date:
        new Date(report.createdAt).toLocaleDateString() +
        " " +
        new Date(report.createdAt).toLocaleTimeString(),
      status: report.status,
      timeTaken: formatDuration(report.createdAt, report.completedAt),
    };
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "success":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "failed":
      case "error":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      case "in_progress":
      case "warning":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      default:
        return "text-neutral-400 bg-neutral-500/10 border-neutral-500/20";
    }
  };

  if (loading) {
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
          <p className="text-red-400">{error}</p>
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

        {/* Search and Filter Bar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <Input
              placeholder="Search repository, title, or PR number"
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
            <div className="col-span-1">#</div>
            <div className="col-span-3">Name</div>
            <div className="col-span-3">Repository</div>
            <div className="col-span-2">Branch</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2 text-right">Last Updated</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-neutral-800">
            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
                <p>No relevant logs found</p>
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="grid grid-cols-12 gap-4 px-4 py-3 items-center text-sm hover:bg-neutral-800/30 transition-colors"
                >
                  <div className="col-span-1 text-neutral-500 font-mono text-xs">
                    {log.id}
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
                      {log.status === "completed" ? "success" : log.status}
                    </span>
                  </div>
                  <div className="col-span-2 text-right text-neutral-500 text-xs font-mono">
                    {log.date}
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

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  GitBranch,
  MessageSquare,
  GitPullRequest,
  Zap,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Key,
  BookOpen,
  ArrowRight,
  Clock,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { authClient, type Session } from "@/lib/authClient";
import { api } from "@/lib/api";
import { useState, useEffect } from "react";

type DashboardData = {
  isInstalled: boolean;
  stats: {
    reposConnected: number;
    reposChange: number;
    issuesHandled: number;
    issuesChange: number;
    prsReviewed: number;
    prsChange: number;
    warningsIssued: number;
    warningsChange: number;
  };
  weeklyData: Array<{
    day: string;
    date: string;
    issues: number;
    prs: number;
  }>;
  recentActivity: Array<{
    id: number;
    type: "issue" | "pr";
    title: string;
    repo: string;
    time: string;
    url: string | null;
  }>;
};

function formatChange(change: number): { text: string; isPositive: boolean } {
  if (change === 0) {
    return { text: "No change", isPositive: true };
  }
  const sign = change > 0 ? "+" : "";
  return {
    text: `${sign}${change}% vs last week`,
    isPositive: change >= 0,
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [showInstallDialog, setShowInstallDialog] = useState(false);

  const { data: session } = authClient.useSession() as {
    data: Session | null;
  };

  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboard", session?.session?.githubAccountId],
    queryFn: async () => {
      if (!session?.session?.githubAccountId) {
        return null;
      }

      const response = await api.api.users
        .dashboard({
          githubAccountId: session.session.githubAccountId.toString(),
        })
        .get();

      return response.data as DashboardData;
    },
    enabled: !!session?.session?.githubAccountId,
  });

  // Show install dialog if not installed
  useEffect(() => {
    if (dashboardData && !dashboardData.isInstalled) {
      setShowInstallDialog(true);
    }
  }, [dashboardData]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
        <span className="ml-2 text-neutral-400">Loading dashboard...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400">Failed to load dashboard</p>
          <p className="text-neutral-500 text-sm mt-2">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats ?? {
    reposConnected: 0,
    reposChange: 0,
    issuesHandled: 0,
    issuesChange: 0,
    prsReviewed: 0,
    prsChange: 0,
    warningsIssued: 0,
    warningsChange: 0,
  };

  const weeklyData = dashboardData?.weeklyData ?? [];
  const recentActivity = dashboardData?.recentActivity ?? [];

  const hasWeeklyData = weeklyData.some((d) => d.issues > 0 || d.prs > 0);
  const maxValue = hasWeeklyData
    ? Math.max(...weeklyData.map((d) => Math.max(d.issues, d.prs)))
    : 1;

  const reposChangeInfo = formatChange(stats.reposChange);
  const issuesChangeInfo = formatChange(stats.issuesChange);
  const prsChangeInfo = formatChange(stats.prsChange);
  const warningsChangeInfo = formatChange(stats.warningsChange);

  return (
    <>
      {/* Install Bot Dialog */}
      <Dialog open={showInstallDialog} onOpenChange={setShowInstallDialog}>
        <DialogContent className="bg-neutral-900 border-neutral-700">
          <DialogHeader>
            <DialogTitle className="text-white">Install GitBee Bot</DialogTitle>
            <DialogDescription className="text-neutral-400">
              To start using GitBee, you need to install the GitHub App on your
              repositories. This will allow GitBee to analyze your issues and
              pull requests.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4">
            <Button
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium cursor-pointer"
              onClick={() => {
                window.open(
                  "https://github.com/apps/gitbeeai",
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
            >
              <GitBranch className="w-4 h-4 mr-2" />
              Install GitHub App
            </Button>
            <Button
              variant="ghost"
              className="border-neutral-700 text-neutral-300 hover:bg-neutral-600 hover:text-red-500 hover:border-red-500 cursor-pointer"
              onClick={() => setShowInstallDialog(false)}
            >
              I'll do this later
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-neutral-900 border-neutral-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider">
                    REPOS CONNECTED
                  </p>
                  <p className="text-2xl font-bold text-white font-mono">
                    {stats.reposConnected}
                  </p>
                  <p
                    className={`text-xs mt-1 flex items-center gap-1 ${
                      reposChangeInfo.isPositive
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {reposChangeInfo.isPositive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {reposChangeInfo.text}
                  </p>
                </div>
                <GitBranch className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-neutral-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider">
                    ISSUES HANDLED
                  </p>
                  <p className="text-2xl font-bold text-white font-mono">
                    {stats.issuesHandled}
                  </p>
                  <p
                    className={`text-xs mt-1 flex items-center gap-1 ${
                      issuesChangeInfo.isPositive
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {issuesChangeInfo.isPositive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {issuesChangeInfo.text}
                  </p>
                </div>
                <MessageSquare className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-neutral-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider">
                    PRS REVIEWED
                  </p>
                  <p className="text-2xl font-bold text-white font-mono">
                    {stats.prsReviewed}
                  </p>
                  <p
                    className={`text-xs mt-1 flex items-center gap-1 ${
                      prsChangeInfo.isPositive
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {prsChangeInfo.isPositive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {prsChangeInfo.text}
                  </p>
                </div>
                <GitPullRequest className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-neutral-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider">
                    WARNINGS ISSUED
                  </p>
                  <p className="text-2xl font-bold text-white font-mono">
                    {stats.warningsIssued}
                  </p>
                  <p
                    className={`text-xs mt-1 flex items-center gap-1 ${
                      warningsChangeInfo.isPositive
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {warningsChangeInfo.isPositive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {warningsChangeInfo.text}
                  </p>
                </div>
                <Zap className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 grid-cols-1">
          {/* Weekly Activity Chart */}
          <Card className="bg-neutral-900 border-neutral-700">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
                  WEEKLY ACTIVITY
                </CardTitle>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-sm bg-yellow-500"></span>
                    <span className="text-neutral-400">Issues</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-sm bg-yellow-500/40"></span>
                    <span className="text-neutral-400">PRs</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!hasWeeklyData ? (
                <div className="h-64 flex items-center justify-center">
                  <p className="text-neutral-500">
                    No activity in the last 7 days
                  </p>
                </div>
              ) : (
                <div className="h-64 flex items-end justify-between gap-2">
                  {weeklyData.map((item) => (
                    <div
                      key={item.date}
                      className="flex-1 flex flex-col items-center gap-2"
                    >
                      <div className="w-full flex gap-1 items-end h-48">
                        {/* Issues bar */}
                        <div
                          className="flex-1 bg-yellow-500 rounded-t transition-all duration-300 hover:bg-yellow-400"
                          style={{
                            height: `${(item.issues / maxValue) * 100}%`,
                          }}
                          title={`${item.issues} issues`}
                        ></div>
                        {/* PRs bar */}
                        <div
                          className="flex-1 bg-yellow-500/40 rounded-t transition-all duration-300 hover:bg-yellow-500/60"
                          style={{ height: `${(item.prs / maxValue) * 100}%` }}
                          title={`${item.prs} PRs`}
                        ></div>
                      </div>
                      <span className="text-xs text-neutral-400">
                        {item.day}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {/* Recent Activity */}
          <Card className="bg-neutral-900 border-neutral-700 flex flex-col">
            <CardHeader className="border-b border-neutral-800 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/10 rounded-full">
                    <Clock className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider uppercase">
                      Recent Activity
                    </CardTitle>
                  </div>
                </div>
                <Link
                  className="text-neutral-400 hover:text-white hover:bg-neutral-800 h-7 text-xs cursor-pointer flex items-center"
                  href="/dashboard/logs"
                >
                  View All
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              {recentActivity.length === 0 ? (
                <div className="flex items-center justify-center h-48">
                  <p className="text-neutral-500">No activity yet</p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-800">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-4 p-4 hover:bg-neutral-800/30 transition-colors group cursor-default"
                    >
                      <div
                        className={`h-8 w-8 rounded flex items-center justify-center shrink-0 border ${
                          activity.type === "issue"
                            ? "bg-blue-500/10 border-blue-500/20 text-blue-500"
                            : "bg-purple-500/10 border-purple-500/20 text-purple-500"
                        }`}
                      >
                        {activity.type === "issue" ? (
                          <MessageSquare className="w-4 h-4" />
                        ) : (
                          <GitPullRequest className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-medium text-neutral-200 truncate group-hover:text-yellow-500 transition-colors">
                            {activity.title}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 font-mono flex items-center gap-2">
                          <span>{activity.repo}</span>
                          <span className="w-0.5 h-0.5 bg-neutral-600 rounded-full" />
                          <span>{activity.time}</span>
                        </p>
                      </div>
                      {activity.url && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-neutral-400 hover:text-white"
                            onClick={() =>
                              window.open(
                                activity.url!,
                                "_blank",
                                "noopener,noreferrer"
                              )
                            }
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-neutral-900 border-neutral-700 flex flex-col">
            <CardHeader className="border-b border-neutral-800 pb-4">
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
                QUICK ACTIONS
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-3 border-neutral-800 bg-neutral-900/50 text-neutral-300 hover:bg-neutral-800 hover:text-yellow-500 hover:border-yellow-500/30 transition-all duration-300 group cursor-pointer"
                  onClick={() => router.push("/dashboard/integrations")}
                >
                  <div className="p-3 rounded-full bg-neutral-800 group-hover:bg-yellow-500/10 transition-colors">
                    <GitBranch className="w-5 h-5 group-hover:text-yellow-500" />
                  </div>
                  <span className="text-xs font-medium tracking-wide uppercase">
                    Connect Repo
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-3 border-neutral-800 bg-neutral-900/50 text-neutral-300 hover:bg-neutral-800 hover:text-yellow-500 hover:border-yellow-500/30 transition-all duration-300 group cursor-pointer"
                  onClick={() => router.push("/dashboard/docs")}
                >
                  <div className="p-3 rounded-full bg-neutral-800 group-hover:bg-yellow-500/10 transition-colors">
                    <BookOpen className="w-5 h-5 group-hover:text-yellow-500" />
                  </div>
                  <span className="text-xs font-medium tracking-wide uppercase">
                    View Docs
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-3 border-neutral-800 bg-neutral-900/50 text-neutral-300 hover:bg-neutral-800 hover:text-yellow-500 hover:border-yellow-500/30 transition-all duration-300 group cursor-pointer"
                  onClick={() => router.push("/dashboard/api-keys")}
                >
                  <div className="p-3 rounded-full bg-neutral-800 group-hover:bg-yellow-500/10 transition-colors">
                    <Key className="w-5 h-5 group-hover:text-yellow-500" />
                  </div>
                  <span className="text-xs font-medium tracking-wide uppercase">
                    API Keys
                  </span>
                </Button>
                <Button
                  onClick={() =>
                    window.open(
                      "https://github.com/apps/gitbeeai",
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-3 border-neutral-800 bg-neutral-900/50 text-neutral-300 hover:bg-neutral-800 hover:text-yellow-500 hover:border-yellow-500/30 transition-all duration-300 group cursor-pointer"
                >
                  <div className="p-3 rounded-full bg-neutral-800 group-hover:bg-yellow-500/10 transition-colors">
                    <ExternalLink className="w-5 h-5 group-hover:text-yellow-500" />
                  </div>
                  <span className="text-xs font-medium tracking-wide uppercase">
                    GitHub App
                  </span>
                </Button>
              </div>

              {/* Pro Tip */}
              <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/10">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-yellow-500/10 rounded-md shrink-0">
                    <TrendingUp className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-yellow-500 mb-1">
                      Performance Tip
                    </p>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Add more documentation to your knowledge base to improve
                      GitBee's response accuracy by up to{" "}
                      <span className="text-white font-bold">40%</span>.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

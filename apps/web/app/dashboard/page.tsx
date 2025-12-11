"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/authClient";
import {
  GitBranch,
  MessageSquare,
  GitPullRequest,
  Zap,
  TrendingUp,
  Clock,
  ExternalLink,
  Key,
  BookOpen,
  ArrowRight,
} from "lucide-react";

// Simple bar chart data
const weeklyData = [
  { day: "Mon", issues: 12, prs: 8 },
  { day: "Tue", issues: 18, prs: 12 },
  { day: "Wed", issues: 15, prs: 10 },
  { day: "Thu", issues: 25, prs: 18 },
  { day: "Fri", issues: 32, prs: 22 },
  { day: "Sat", issues: 14, prs: 8 },
  { day: "Sun", issues: 8, prs: 5 },
];

const recentActivity = [
  {
    id: 1,
    type: "issue",
    title: "Responded to issue #142",
    repo: "acme/web-app",
    time: "2 min ago",
  },
  {
    id: 2,
    type: "pr",
    title: "Reviewed PR #89",
    repo: "acme/api-service",
    time: "15 min ago",
  },
  {
    id: 3,
    type: "issue",
    title: "Responded to issue #141",
    repo: "acme/web-app",
    time: "1 hour ago",
  },
  {
    id: 4,
    type: "pr",
    title: "Reviewed PR #88",
    repo: "acme/mobile-app",
    time: "2 hours ago",
  },
  {
    id: 5,
    type: "issue",
    title: "Responded to issue #140",
    repo: "acme/docs",
    time: "3 hours ago",
  },
];

export default function DashboardPage() {
  const session = authClient.useSession();
  console.log(session);
  const maxValue = Math.max(
    ...weeklyData.map((d) => Math.max(d.issues, d.prs))
  );

  return (
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
                <p className="text-2xl font-bold text-white font-mono">12</p>
                <p className="text-xs text-green-500 mt-1">+2 this week</p>
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
                <p className="text-2xl font-bold text-white font-mono">847</p>
                <p className="text-xs text-green-500 mt-1">+124 this month</p>
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
                <p className="text-2xl font-bold text-white font-mono">234</p>
                <p className="text-xs text-green-500 mt-1">+43 this month</p>
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
                  AVG RESPONSE
                </p>
                <p className="text-2xl font-bold text-white font-mono">2.3s</p>
                <p className="text-xs text-green-500 mt-1">
                  -0.5s from last week
                </p>
              </div>
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Weekly Activity Chart */}
        <Card className="col-span-4 bg-neutral-900 border-neutral-700">
          <CardHeader>
            <div className="flex items-center justify-between">
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
            <div className="h-64 flex items-end justify-between gap-2">
              {weeklyData.map((item) => (
                <div
                  key={item.day}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div className="w-full flex gap-1 items-end h-48">
                    {/* Issues bar */}
                    <div
                      className="flex-1 bg-yellow-500 rounded-t transition-all duration-300 hover:bg-yellow-400"
                      style={{ height: `${(item.issues / maxValue) * 100}%` }}
                      title={`${item.issues} issues`}
                    ></div>
                    {/* PRs bar */}
                    <div
                      className="flex-1 bg-yellow-500/40 rounded-t transition-all duration-300 hover:bg-yellow-500/60"
                      style={{ height: `${(item.prs / maxValue) * 100}%` }}
                      title={`${item.prs} PRs`}
                    ></div>
                  </div>
                  <span className="text-xs text-neutral-400">{item.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Response Rate Chart */}
        <Card className="col-span-3 bg-neutral-900 border-neutral-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
              RESPONSE RATE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Success Rate */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Successful Responses</span>
                  <span className="text-white font-mono">94.2%</span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: "94.2%" }}
                  ></div>
                </div>
              </div>

              {/* Issue Resolution */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Issues Resolved</span>
                  <span className="text-white font-mono">78.5%</span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-3">
                  <div
                    className="bg-yellow-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: "78.5%" }}
                  ></div>
                </div>
              </div>

              {/* PR Approval Rate */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">PR Review Accuracy</span>
                  <span className="text-white font-mono">91.8%</span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-3">
                  <div
                    className="bg-yellow-500/70 h-3 rounded-full transition-all duration-500"
                    style={{ width: "91.8%" }}
                  ></div>
                </div>
              </div>

              {/* Uptime */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">System Uptime</span>
                  <span className="text-white font-mono">99.9%</span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: "99.9%" }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Activity */}
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
                RECENT ACTIVITY
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-neutral-400 hover:text-yellow-500"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-800/50 transition-colors"
                >
                  <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center shrink-0">
                    {activity.type === "issue" ? (
                      <MessageSquare className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <GitPullRequest className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-neutral-400">{activity.repo}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-neutral-500 shrink-0">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
              QUICK ACTIONS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-yellow-500 hover:border-yellow-500/50 bg-transparent"
              >
                <GitBranch className="w-6 h-6" />
                <span className="text-sm">Connect Repo</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-yellow-500 hover:border-yellow-500/50 bg-transparent"
              >
                <BookOpen className="w-6 h-6" />
                <span className="text-sm">View Docs</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-yellow-500 hover:border-yellow-500/50 bg-transparent"
              >
                <Key className="w-6 h-6" />
                <span className="text-sm">API Keys</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-yellow-500 hover:border-yellow-500/50 bg-transparent"
              >
                <ExternalLink className="w-6 h-6" />
                <span className="text-sm">GitHub App</span>
              </Button>
            </div>

            {/* Pro Tip */}
            <div className="mt-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-500">
                    Performance Tip
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    Add more documentation to your knowledge base to improve
                    GitBee's response accuracy by up to 40%.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

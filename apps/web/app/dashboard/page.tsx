"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitBranch, MessageSquare, GitPullRequest, Zap, TrendingUp, ExternalLink, Key, BookOpen, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const maxValue = Math.max(...weeklyData.map((d) => Math.max(d.issues, d.prs)));
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">REPOS CONNECTED</p>
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
                <p className="text-xs text-neutral-400 tracking-wider">ISSUES HANDLED</p>
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
                <p className="text-xs text-neutral-400 tracking-wider">PRS REVIEWED</p>
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
                <p className="text-xs text-neutral-400 tracking-wider">COMMENTS ANALYZED</p>
                <p className="text-2xl font-bold text-white font-mono">124</p>
                <p className="text-xs text-green-500 mt-1">+124 this month</p>
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
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">WEEKLY ACTIVITY</CardTitle>
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
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
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
                  <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider uppercase">Recent Activity</CardTitle>
                </div>
              </div>
              <Link className="text-neutral-400 hover:text-white hover:bg-neutral-800 h-7 text-xs cursor-pointer flex" href="/dashboard/logs">
                View All
                <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <div className="divide-y divide-neutral-800">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-4 hover:bg-neutral-800/30 transition-colors group cursor-default">
                  <div
                    className={`h-8 w-8 rounded flex items-center justify-center shrink-0 border ${activity.type === "issue" ? "bg-blue-500/10 border-blue-500/20 text-blue-500" : "bg-purple-500/10 border-purple-500/20 text-purple-500"
                      }`}
                  >
                    {activity.type === "issue" ? <MessageSquare className="w-4 h-4" /> : <GitPullRequest className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-neutral-200 truncate group-hover:text-yellow-500 transition-colors">{activity.title}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700">
                        #{140 + activity.id}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 font-mono flex items-center gap-2">
                      <span>{activity.repo}</span>
                      <span className="w-0.5 h-0.5 bg-neutral-600 rounded-full" />
                      <span>{activity.time}</span>
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-neutral-400 hover:text-white">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-neutral-900 border-neutral-700 flex flex-col">
          <CardHeader className="border-b border-neutral-800 pb-4">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">QUICK ACTIONS</CardTitle>
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
                <span className="text-xs font-medium tracking-wide uppercase">Connect Repo</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-3 border-neutral-800 bg-neutral-900/50 text-neutral-300 hover:bg-neutral-800 hover:text-yellow-500 hover:border-yellow-500/30 transition-all duration-300 group cursor-pointer"
                onClick={() => router.push("/dashboard/docs")}
              >
                <div className="p-3 rounded-full bg-neutral-800 group-hover:bg-yellow-500/10 transition-colors">
                  <BookOpen className="w-5 h-5 group-hover:text-yellow-500" />
                </div>
                <span className="text-xs font-medium tracking-wide uppercase">View Docs</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-3 border-neutral-800 bg-neutral-900/50 text-neutral-300 hover:bg-neutral-800 hover:text-yellow-500 hover:border-yellow-500/30 transition-all duration-300 group cursor-pointer"
                onClick={() => router.push("/dashboard/api-keys")}
              >
                <div className="p-3 rounded-full bg-neutral-800 group-hover:bg-yellow-500/10 transition-colors">
                  <Key className="w-5 h-5 group-hover:text-yellow-500" />
                </div>
                <span className="text-xs font-medium tracking-wide uppercase">API Keys</span>
              </Button>
              <Button
                onClick={() => window.open("https://github.com/apps/gitbeeai", "_blank", "noopener,noreferrer")}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-3 border-neutral-800 bg-neutral-900/50 text-neutral-300 hover:bg-neutral-800 hover:text-yellow-500 hover:border-yellow-500/30 transition-all duration-300 group cursor-pointer"
              >
                <div className="p-3 rounded-full bg-neutral-800 group-hover:bg-yellow-500/10 transition-colors">
                  <ExternalLink className="w-5 h-5 group-hover:text-yellow-500" />
                </div>
                <span className="text-xs font-medium tracking-wide uppercase">GitHub App</span>
              </Button>
            </div>

            {/* Pro Tip */}
            <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/10">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-yellow-500/10 rounded-md shrink-0">
                  <TrendingUp className="w-4 h-4 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-yellow-500 mb-1">Performance Tip</p>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Add more documentation to your knowledge base to improve' GitBee's response accuracy by up to{" "}
                    <span className="text-white font-bold">40%</span>.
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

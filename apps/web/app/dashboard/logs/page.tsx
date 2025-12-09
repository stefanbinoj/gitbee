"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, Eye, Download, Filter, GitBranch, MessageSquare, AlertTriangle, Clock } from "lucide-react"

type LogEntry = {
  id: string
  title: string
  type: string
  repository: string
  branch: string
  date: string
  status: string
  level: string
  summary: string
  tags: string[]
}

export default function LogsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)

  const logs: LogEntry[] = [
    {
      id: "LOG-2025-001",
      title: "Issue #142 Response Generated",
      type: "issue_response",
      repository: "acme/web-app",
      branch: "main",
      date: "2025-06-17 14:32",
      status: "success",
      level: "info",
      summary: "Generated helpful response for bug report about login form validation",
      tags: ["issue", "bug", "automated"],
    },
    {
      id: "LOG-2025-002",
      title: "PR #89 Review Comment",
      type: "pr_review",
      repository: "acme/api-service",
      branch: "feature/auth",
      date: "2025-06-17 13:15",
      status: "success",
      level: "info",
      summary: "Provided code review suggestions for authentication middleware changes",
      tags: ["pr", "review", "code"],
    },
    {
      id: "LOG-2025-003",
      title: "Knowledge Sync Failed",
      type: "sync",
      repository: "acme/docs",
      branch: "main",
      date: "2025-06-17 12:00",
      status: "error",
      level: "error",
      summary: "Failed to sync CONTRIBUTING.md - file not found in repository",
      tags: ["sync", "error", "docs"],
    },
    {
      id: "LOG-2025-004",
      title: "Discussion Response Posted",
      type: "discussion",
      repository: "acme/web-app",
      branch: "main",
      date: "2025-06-17 10:45",
      status: "success",
      level: "info",
      summary: "Answered community question about deployment configuration",
      tags: ["discussion", "community", "help"],
    },
    {
      id: "LOG-2025-005",
      title: "Rate Limit Warning",
      type: "system",
      repository: "acme/api-service",
      branch: "-",
      date: "2025-06-17 09:30",
      status: "warning",
      level: "warning",
      summary: "Approaching API rate limit - 8,500/10,000 requests used this hour",
      tags: ["system", "rate-limit", "warning"],
    },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case "issue_response":
        return "bg-green-500/20 text-green-500"
      case "pr_review":
        return "bg-blue-500/20 text-blue-500"
      case "sync":
        return "bg-yellow-500/20 text-yellow-500"
      case "discussion":
        return "bg-purple-500/20 text-purple-500"
      case "system":
        return "bg-neutral-500/20 text-neutral-300"
      default:
        return "bg-neutral-500/20 text-neutral-300"
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "bg-red-500/20 text-red-500"
      case "warning":
        return "bg-yellow-500/20 text-yellow-500"
      case "info":
        return "bg-green-500/20 text-green-500"
      default:
        return "bg-neutral-500/20 text-neutral-300"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500/20 text-green-500"
      case "error":
        return "bg-red-500/20 text-red-500"
      case "warning":
        return "bg-yellow-500/20 text-yellow-500"
      default:
        return "bg-neutral-500/20 text-neutral-300"
    }
  }

  const filteredLogs = logs.filter(
    (log) =>
      log.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.repository.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-yellow-500 bg-transparent">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-yellow-500 bg-transparent">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Stats and Search */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-2 bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">TOTAL EVENTS</p>
                <p className="text-2xl font-bold text-white font-mono">1,247</p>
              </div>
              <FileText className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">ERRORS</p>
                <p className="text-2xl font-bold text-red-500 font-mono">3</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">AVG RESPONSE</p>
                <p className="text-2xl font-bold text-white font-mono">2.3s</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Logs */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">RECENT ACTIVITY</CardTitle>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs text-neutral-400">Live</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="border border-neutral-700 rounded-lg p-4 hover:border-yellow-500/50 transition-colors cursor-pointer"
                onClick={() => setSelectedLog(log)}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start gap-3">
                      {log.type === "issue_response" ? (
                        <MessageSquare className="w-5 h-5 text-neutral-400 mt-0.5" />
                      ) : log.type === "pr_review" ? (
                        <GitBranch className="w-5 h-5 text-neutral-400 mt-0.5" />
                      ) : (
                        <FileText className="w-5 h-5 text-neutral-400 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-white tracking-wider">{log.title}</h3>
                        <p className="text-xs text-neutral-400 font-mono">{log.id}</p>
                      </div>
                    </div>

                    <p className="text-sm text-neutral-300 ml-8">{log.summary}</p>

                    <div className="flex flex-wrap gap-2 ml-8">
                      {log.tags.map((tag) => (
                        <Badge key={tag} className="bg-neutral-800 text-neutral-300 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2">
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getTypeColor(log.type)}>{log.type.replace("_", " ").toUpperCase()}</Badge>
                      <Badge className={getLevelColor(log.level)}>{log.level.toUpperCase()}</Badge>
                      <Badge className={getStatusColor(log.status)}>{log.status.toUpperCase()}</Badge>
                    </div>

                    <div className="text-xs text-neutral-400 space-y-1">
                      <div className="flex items-center gap-2">
                        <GitBranch className="w-3 h-3" />
                        <span>{log.repository}</span>
                      </div>
                      <div className="font-mono">{log.date}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-neutral-900 border-neutral-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-white tracking-wider">{selectedLog.title}</CardTitle>
                <p className="text-sm text-neutral-400 font-mono">{selectedLog.id}</p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedLog(null)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">EVENT TYPE</h3>
                    <div className="flex gap-2">
                      <Badge className={getTypeColor(selectedLog.type)}>
                        {selectedLog.type.replace("_", " ").toUpperCase()}
                      </Badge>
                      <Badge className={getLevelColor(selectedLog.level)}>
                        {selectedLog.level.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">DETAILS</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Repository:</span>
                        <span className="text-white font-mono">{selectedLog.repository}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Branch:</span>
                        <span className="text-white">{selectedLog.branch}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Timestamp:</span>
                        <span className="text-white font-mono">{selectedLog.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Status:</span>
                        <Badge className={getStatusColor(selectedLog.status)}>
                          {selectedLog.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">TAGS</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedLog.tags.map((tag) => (
                        <Badge key={tag} className="bg-neutral-800 text-neutral-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">STATUS</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-400">Result</span>
                        <Badge className={getStatusColor(selectedLog.status)}>
                          {selectedLog.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="w-full bg-neutral-800 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            selectedLog.status === "error"
                              ? "bg-red-500 w-full"
                              : selectedLog.status === "warning"
                                ? "bg-yellow-500 w-3/4"
                                : "bg-green-500 w-full"
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">SUMMARY</h3>
                <p className="text-sm text-neutral-300 leading-relaxed">{selectedLog.summary}</p>
              </div>

              <div className="flex gap-2 pt-4 border-t border-neutral-700">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-neutral-900 font-semibold">
                  <Eye className="w-4 h-4 mr-2" />
                  View Full Details
                </Button>
                <Button
                  variant="outline"
                  className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Brain, Plus, FileText, Trash2, Upload, Search, Database, Cpu, Clock, Tag } from "lucide-react"

export default function ContextPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const contexts = [
    {
      id: "ctx_1",
      name: "Project Guidelines",
      description: "Coding standards, PR conventions, and team workflows",
      type: "document",
      size: "24 KB",
      lastUpdated: "2 hours ago",
      tokens: "4,521",
      status: "active",
    },
    {
      id: "ctx_2",
      name: "API Documentation",
      description: "Internal API reference and endpoint specifications",
      type: "document",
      size: "156 KB",
      lastUpdated: "1 day ago",
      tokens: "28,340",
      status: "active",
    },
    {
      id: "ctx_3",
      name: "Architecture Decisions",
      description: "ADRs and system design documentation",
      type: "folder",
      size: "89 KB",
      lastUpdated: "3 days ago",
      tokens: "15,672",
      status: "active",
    },
    {
      id: "ctx_4",
      name: "Onboarding Guide",
      description: "New developer onboarding and setup instructions",
      type: "document",
      size: "12 KB",
      lastUpdated: "1 week ago",
      tokens: "2,890",
      status: "active",
    },
  ]

  const filteredContexts = contexts.filter(
    (ctx) =>
      ctx.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ctx.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-yellow-500 bg-transparent">
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-neutral-900 font-semibold">
          <Plus className="w-4 h-4 mr-2" />
          Add Context
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">TOTAL CONTEXTS</p>
                <p className="text-2xl font-bold text-white font-mono">4</p>
              </div>
              <Brain className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">TOTAL TOKENS</p>
                <p className="text-2xl font-bold text-white font-mono">51.4K</p>
              </div>
              <Cpu className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">STORAGE USED</p>
                <p className="text-2xl font-bold text-white font-mono">281 KB</p>
              </div>
              <Database className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">LAST UPDATED</p>
                <p className="text-2xl font-bold text-white font-mono">2h ago</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              placeholder="Search context sources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Context List */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">CONTEXT SOURCES</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredContexts.map((ctx) => (
              <div
                key={ctx.id}
                className="border border-neutral-700 rounded-lg p-4 hover:border-yellow-500/50 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-yellow-500/10 flex items-center justify-center shrink-0">
                      {ctx.type === "folder" ? (
                        <Database className="w-6 h-6 text-yellow-500" />
                      ) : (
                        <FileText className="w-6 h-6 text-yellow-500" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-white">{ctx.name}</h3>
                      <p className="text-xs text-neutral-400">{ctx.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-neutral-500 flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {ctx.type}
                        </span>
                        <span className="text-xs text-neutral-500">{ctx.size}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                    <div className="text-right">
                      <p className="text-xs text-neutral-400">Tokens</p>
                      <p className="text-sm font-mono text-white">{ctx.tokens}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-neutral-400">Updated</p>
                      <p className="text-sm text-neutral-300">{ctx.lastUpdated}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                      <span className="text-xs text-neutral-300 uppercase tracking-wider">{ctx.status}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-neutral-400 hover:text-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-neutral-900 border-neutral-700 border-l-4 border-l-yellow-500">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">Pro Tip: Context Optimization</h3>
              <p className="text-sm text-neutral-400">
                Keep your context sources focused and up-to-date. Well-organized context helps GitBee provide more accurate 
                and relevant responses to issues and pull requests. Remove outdated documentation to improve response quality.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

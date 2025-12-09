"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Key, Plus, Copy, Eye, EyeOff, Trash2, Shield, Clock, Activity } from "lucide-react"

export default function ApiKeysPage() {
  const [showKey, setShowKey] = useState<string | null>(null)

  const apiKeys = [
    {
      id: "key_1",
      name: "Production API Key",
      key: "gb_live_sk_1a2b3c4d5e6f7g8h9i0j",
      created: "2025-05-15",
      lastUsed: "2 hours ago",
      status: "active",
      requests: "12,847",
    },
    {
      id: "key_2",
      name: "Development Key",
      key: "gb_test_sk_9z8y7x6w5v4u3t2s1r0q",
      created: "2025-06-01",
      lastUsed: "5 min ago",
      status: "active",
      requests: "3,291",
    },
    {
      id: "key_3",
      name: "CI/CD Pipeline",
      key: "gb_live_sk_abcdef123456789xyz",
      created: "2025-04-20",
      lastUsed: "1 day ago",
      status: "active",
      requests: "8,456",
    },
  ]

  const maskKey = (key: string) => {
    return key.substring(0, 12) + "••••••••••••"
  }

  return (
    <div className="space-y-6">
      {/* Action Button */}
      <div className="flex justify-end">
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-neutral-900 font-semibold">
          <Plus className="w-4 h-4 mr-2" />
          Generate New Key
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">ACTIVE KEYS</p>
                <p className="text-2xl font-bold text-white font-mono">3</p>
              </div>
              <Key className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">TOTAL REQUESTS</p>
                <p className="text-2xl font-bold text-white font-mono">24,594</p>
              </div>
              <Activity className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">RATE LIMIT</p>
                <p className="text-2xl font-bold text-white font-mono">10K/hr</p>
              </div>
              <Shield className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Keys List */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">YOUR API KEYS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div
                key={apiKey.id}
                className="border border-neutral-700 rounded-lg p-4 hover:border-yellow-500/50 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                      <Key className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-white">{apiKey.name}</h3>
                      <div className="flex items-center gap-2">
                        <code className="text-xs text-neutral-400 font-mono bg-neutral-800 px-2 py-1 rounded">
                          {showKey === apiKey.id ? apiKey.key : maskKey(apiKey.key)}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-neutral-400 hover:text-yellow-500"
                          onClick={() => setShowKey(showKey === apiKey.id ? null : apiKey.id)}
                        >
                          {showKey === apiKey.id ? (
                            <EyeOff className="w-3 h-3" />
                          ) : (
                            <Eye className="w-3 h-3" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-neutral-400 hover:text-yellow-500"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                    <div className="text-xs text-neutral-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Created: {apiKey.created}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Activity className="w-3 h-3" />
                        <span>Last used: {apiKey.lastUsed}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-neutral-400">Requests</p>
                      <p className="text-sm font-mono text-white">{apiKey.requests}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                      <span className="text-xs text-neutral-300 uppercase tracking-wider">{apiKey.status}</span>
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

      {/* Usage Guide */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">QUICK START</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-neutral-400">
              Use your API key to authenticate requests to the GitBee API.
            </p>
            <div className="bg-neutral-800 rounded-lg p-4">
              <code className="text-sm text-yellow-500 font-mono">
                curl -H "Authorization: Bearer YOUR_API_KEY" \<br />
                &nbsp;&nbsp;https://api.gitbee.dev/v1/repositories
              </code>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-yellow-500 bg-transparent">
                View Documentation
              </Button>
              <Button variant="outline" className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-yellow-500 bg-transparent">
                API Reference
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

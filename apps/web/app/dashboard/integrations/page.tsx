"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Puzzle, Check, ExternalLink, Settings2, MessageSquare, GitBranch, Bell, Zap } from "lucide-react"

export default function IntegrationsPage() {
  const integrations = [
    {
      id: "github",
      name: "GitHub",
      description: "Connect your GitHub repositories for automated issue and PR responses",
      icon: GitBranch,
      color: "bg-neutral-800",
      iconColor: "text-white",
      status: "connected",
      features: ["Issue responses", "PR reviews", "Discussions"],
    },
    {
      id: "slack",
      name: "Slack",
      description: "Receive notifications and updates directly in your team's Slack channels",
      icon: MessageSquare,
      color: "bg-[#4A154B]",
      iconColor: "text-white",
      status: "available",
      features: ["Real-time alerts", "Thread replies", "Commands"],
    },
    {
      id: "discord",
      name: "Discord",
      description: "Get GitBee notifications in your Discord server channels",
      icon: MessageSquare,
      color: "bg-[#5865F2]",
      iconColor: "text-white",
      status: "available",
      features: ["Bot notifications", "Channel alerts", "Commands"],
    },
    {
      id: "jira",
      name: "Jira",
      description: "Sync issues and create tickets automatically from GitHub activity",
      icon: Settings2,
      color: "bg-[#0052CC]",
      iconColor: "text-white",
      status: "coming_soon",
      features: ["Issue sync", "Auto tickets", "Status updates"],
    },
    {
      id: "linear",
      name: "Linear",
      description: "Connect Linear for seamless project management integration",
      icon: Zap,
      color: "bg-[#5E6AD2]",
      iconColor: "text-white",
      status: "coming_soon",
      features: ["Issue linking", "Auto updates", "Workflows"],
    },
    {
      id: "webhooks",
      name: "Webhooks",
      description: "Send custom webhook notifications to any endpoint",
      icon: Bell,
      color: "bg-yellow-500",
      iconColor: "text-neutral-900",
      status: "available",
      features: ["Custom payloads", "Event filtering", "Retry logic"],
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return (
          <span className="flex items-center gap-1.5 text-xs px-2 py-1 rounded bg-green-500/20 text-green-500">
            <Check className="w-3 h-3" />
            Connected
          </span>
        )
      case "available":
        return (
          <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-500">
            Available
          </span>
        )
      case "coming_soon":
        return (
          <span className="text-xs px-2 py-1 rounded bg-neutral-700 text-neutral-400">
            Coming Soon
          </span>
        )
      default:
        return null
    }
  }

  const getActionButton = (status: string) => {
    switch (status) {
      case "connected":
        return (
          <Button variant="outline" className="w-full border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-yellow-500 bg-transparent">
            <Settings2 className="w-4 h-4 mr-2" />
            Configure
          </Button>
        )
      case "available":
        return (
          <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-neutral-900 font-semibold">
            Connect
          </Button>
        )
      case "coming_soon":
        return (
          <Button disabled className="w-full bg-neutral-800 text-neutral-500 cursor-not-allowed">
            Coming Soon
          </Button>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Action Button */}
      <div className="flex justify-end">
        <Button variant="outline" className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-yellow-500 bg-transparent">
          <ExternalLink className="w-4 h-4 mr-2" />
          Browse Marketplace
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">CONNECTED</p>
                <p className="text-2xl font-bold text-white font-mono">1</p>
              </div>
              <Check className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">AVAILABLE</p>
                <p className="text-2xl font-bold text-yellow-500 font-mono">3</p>
              </div>
              <Puzzle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">COMING SOON</p>
                <p className="text-2xl font-bold text-neutral-400 font-mono">2</p>
              </div>
              <Zap className="w-8 h-8 text-neutral-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integrations Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => (
          <Card
            key={integration.id}
            className={`bg-neutral-900 border-neutral-700 ${
              integration.status === "connected" ? "ring-1 ring-green-500/30" : ""
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg ${integration.color} flex items-center justify-center`}>
                    <integration.icon className={`w-5 h-5 ${integration.iconColor}`} />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold text-white">{integration.name}</CardTitle>
                  </div>
                </div>
                {getStatusBadge(integration.status)}
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <CardDescription className="text-sm text-neutral-400 mb-4">
                {integration.description}
              </CardDescription>
              <div className="flex flex-wrap gap-2">
                {integration.features.map((feature, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 rounded bg-neutral-800 text-neutral-400"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              {getActionButton(integration.status)}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Custom Integration */}
      <Card className="bg-neutral-900 border-neutral-700 border-dashed">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-neutral-800 border-2 border-dashed border-neutral-600 flex items-center justify-center">
                <Puzzle className="w-6 h-6 text-neutral-500" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Need a custom integration?</h3>
                <p className="text-sm text-neutral-400">Use our API to build your own integration or request a new one</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-yellow-500 bg-transparent">
                View API Docs
              </Button>
              <Button variant="outline" className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-yellow-500 bg-transparent">
                Request Integration
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

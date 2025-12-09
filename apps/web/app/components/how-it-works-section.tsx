"use client"

import { useState } from "react"
import { Check, GitPullRequest, MessageSquare, Users, Bot } from "lucide-react"

const steps = [
  {
    icon: GitPullRequest,
    title: "Connect Repository",
    description: "Link your GitHub, GitLab, or Bitbucket repository in seconds.",
  },
  {
    icon: Bot,
    title: "Configure Rules",
    description: "Set up moderation policies, contribution guidelines, and auto-responses.",
  },
  {
    icon: MessageSquare,
    title: "AI Moderates",
    description: "Our AI monitors issues, PRs, and discussions in real-time.",
  },
  {
    icon: Users,
    title: "Community Thrives",
    description: "Focus on building while we handle community governance at scale.",
  },
]

export function HowItWorksSection() {
  const [deploymentType, setDeploymentType] = useState<"saas" | "self-hosted">("saas")

  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="rounded-2xl border border-border/50 bg-card/30 overflow-hidden">
              {/* Visual representation instead of code */}
              <div className="aspect-[4/3] bg-gradient-to-br from-card via-card to-emerald-500/5 p-8 flex flex-col justify-center">
                <div className="space-y-4">
                  {/* Moderation action cards */}
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-background/60 border border-border/40">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground">Issue #847 auto-labeled</div>
                      <div className="text-xs text-muted-foreground mt-0.5">bug, needs-triage</div>
                    </div>
                    <div className="text-xs text-emerald-400">2s ago</div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-lg bg-background/60 border border-border/40">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground">Welcome message sent</div>
                      <div className="text-xs text-muted-foreground mt-0.5">New contributor @dev_user</div>
                    </div>
                    <div className="text-xs text-emerald-400">5s ago</div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-lg bg-background/60 border border-border/40">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground">CoC violation flagged</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Pending maintainer review</div>
                    </div>
                    <div className="text-xs text-muted-foreground">12s ago</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle glow effect */}
            <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none" />
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <div className="flex gap-2 mb-8">
              <button
                onClick={() => setDeploymentType("saas")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  deploymentType === "saas"
                    ? "bg-emerald-500 text-background"
                    : "bg-secondary/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                Cloud
              </button>
              <button
                onClick={() => setDeploymentType("self-hosted")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  deploymentType === "self-hosted"
                    ? "bg-emerald-500 text-background"
                    : "bg-secondary/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                Self-Hosted
              </button>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">How It Works</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {deploymentType === "saas"
                ? "Get started in minutes with our managed cloud solution."
                : "Full control with on-premise deployment options."}
            </p>

            <div className="mt-10 space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{step.title}</h4>
                    <p className="text-muted-foreground mt-1">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

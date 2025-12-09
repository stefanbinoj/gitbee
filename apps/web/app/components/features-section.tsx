import { Zap, MessageSquare, Users, GitPullRequest, Bot, Shield } from "lucide-react"

const features = [
  {
    icon: GitPullRequest,
    title: "PR Governance",
    description: "Automated checks for contribution guidelines, DCO sign-offs, and merge requirements.",
  },
  {
    icon: Zap,
    title: "Instant Triage",
    description: "AI-powered issue labeling and prioritization that learns your project's patterns.",
  },
  {
    icon: Users,
    title: "Contributor Management",
    description: "Track contributions, manage permissions, and recognize top community members.",
  },
  {
    icon: Bot,
    title: "Smart Responses",
    description: "Context-aware auto-replies for common questions and duplicate issues.",
  },
  {
    icon: MessageSquare,
    title: "Discussion Moderation",
    description: "Keep conversations healthy with automated CoC enforcement and spam detection.",
  },
  {
    icon: Shield,
    title: "Security Alerts",
    description: "Detect and flag potential security disclosures in public issue threads.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.02] to-transparent pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Everything You Need to Moderate at Scale
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Comprehensive tools designed specifically for open source maintainers.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative rounded-xl border border-border/50 bg-card/40 p-8 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-0.5"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 group-hover:bg-emerald-500/15 transition-colors">
                <feature.icon className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

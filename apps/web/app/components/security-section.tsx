import { Shield, Eye, Scale } from "lucide-react"

const aboutFeatures = [
  {
    icon: Shield,
    title: "Community Protection",
    description: "Safeguard your contributors with automated enforcement of community guidelines and code of conduct.",
  },
  {
    icon: Eye,
    title: "Transparent Governance",
    description: "Every moderation action is logged and auditable, ensuring accountability across your project.",
  },
  {
    icon: Scale,
    title: "Fair & Consistent",
    description: "AI-driven decisions that eliminate bias and apply standards uniformly across all interactions.",
  },
]

export function SecuritySection() {
  return (
    <section id="about" className="py-24 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Built for Open Source Communities
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Empower maintainers with intelligent tools that scale alongside your community.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {aboutFeatures.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-xl border border-border/50 bg-card/40 p-8 hover:border-emerald-500/30 transition-all duration-300"
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

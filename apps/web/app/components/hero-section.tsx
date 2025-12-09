"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Github } from "lucide-react"
import { FloatingShapes } from "./floating-shapes"
import { CursorTrail } from "./cursor-trail"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <FloatingShapes />
      <CursorTrail />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-sm text-emerald-400 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Open Source Community Management
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight text-balance">
            <span className="text-foreground">Intelligent Moderation for</span>
            <br />
            <span className="text-emerald-400">Open Source Projects</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
            Automate community governance, enforce contribution standards, and scale your open source project with
            AI-powered moderation tools built for maintainers.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-emerald-500 text-background hover:bg-emerald-400 transition-colors h-12 px-8 text-base font-medium group"
            >
              Start Free
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border/60 text-foreground hover:bg-secondary/60 bg-transparent h-12 px-8 text-base font-medium"
            >
              <Github className="mr-2 w-4 h-4" />
              View on GitHub
            </Button>
          </div>

          <div className="mt-16 pt-10 border-t border-border/30">
            <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-foreground">50K+</div>
                <div className="text-sm text-muted-foreground mt-1">Repositories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-foreground">2M+</div>
                <div className="text-sm text-muted-foreground mt-1">Issues Moderated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-foreground">99.9%</div>
                <div className="text-sm text-muted-foreground mt-1">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { SecuritySection } from "@/components/security-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { FeaturesSection } from "@/components/features-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <SecuritySection />
      <FeaturesSection />
      <HowItWorksSection />
      <Footer />
    </main>
  )
}

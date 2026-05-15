import { LandingNav } from '@/components/landing/landing-nav'
import { PromptHero } from '@/components/landing/prompt-hero'

export default function LandingPage() {
  return (
    <main
      className="relative min-h-screen bg-bg overflow-hidden"
    >
      {/* Subtle warm noise background */}
      <div className="bg-noise absolute inset-0 pointer-events-none" />

      <LandingNav />
      <PromptHero />
    </main>
  )
}

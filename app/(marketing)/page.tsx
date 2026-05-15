import { createClient } from '@/lib/supabase/server'
import { LandingNav } from '@/components/landing/landing-nav'
import { PromptHero } from '@/components/landing/prompt-hero'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const navUser = user
    ? {
        name:   user.user_metadata?.full_name
               ?? user.user_metadata?.name
               ?? user.email!.split('@')[0],
        email:  user.email!,
      }
    : null

  return (
    <main className="relative min-h-screen bg-bg overflow-hidden">
      <div className="bg-noise absolute inset-0 pointer-events-none" />
      <LandingNav user={navUser} />
      <PromptHero />
    </main>
  )
}

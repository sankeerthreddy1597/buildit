import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { AppSidebar } from '@/components/app/sidebar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/dashboard')

  const [dbUser] = await db.select().from(users).where(eq(users.id, user.id))

  const sidebarUser = {
    name:    user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email!.split('@')[0],
    email:   user.email!,
    credits: dbUser?.creditBalance ?? 50,
    plan:    (dbUser?.plan ?? 'free') as 'free' | 'pro',
  }

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <AppSidebar user={sidebarUser} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}

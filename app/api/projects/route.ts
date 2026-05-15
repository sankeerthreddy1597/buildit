import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { projects, users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { initialPrompt } = await req.json()

  // Ensure user row exists (created on first sign-in via auth hook or here lazily)
  const [existing] = await db.select().from(users).where(eq(users.id, user.id))
  if (!existing) {
    await db.insert(users).values({ id: user.id, email: user.email! })
  }

  const [project] = await db
    .insert(projects)
    .values({
      userId: user.id,
      name: 'Untitled project',
      description: initialPrompt ?? null,
      status: 'planning',
    })
    .returning({ id: projects.id })

  return NextResponse.json({ projectId: project.id })
}

export async function GET(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, user.id))

  return NextResponse.json(rows)
}

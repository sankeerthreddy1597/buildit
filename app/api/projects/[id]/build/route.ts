import { eq, and } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { projects } from '@/lib/db/schema'
import type { Plan } from '@/components/workspace/plan-card'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, user.id)))

  if (!project) return new Response('Not found', { status: 404 })
  if (!project.plan) return Response.json({ error: 'No plan yet' }, { status: 400 })
  if (project.status !== 'planning') return Response.json({ error: 'Already building' }, { status: 400 })

  // Accept an updated plan from the client (reflects any checkbox toggles the user made)
  const body = await _req.json().catch(() => ({}))
  const finalPlan: Plan = body.plan ?? (JSON.parse(project.plan) as Plan)

  await db
    .update(projects)
    .set({
      status:    'building',
      name:      finalPlan.appName,
      plan:      JSON.stringify(finalPlan),
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id))

  return Response.json({ ok: true })
}

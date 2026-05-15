import { redirect, notFound } from 'next/navigation'
import { eq, and, asc } from 'drizzle-orm'
import type { UIMessage } from 'ai'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { projects, messages as messagesTable } from '@/lib/db/schema'
import { WorkspaceView } from '@/components/workspace/workspace-view'
import type { Plan } from '@/components/workspace/plan-card'

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/project/${id}`)

  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, user.id)))

  if (!project) notFound()

  const dbMessages = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.projectId, project.id))
    .orderBy(asc(messagesTable.createdAt))

  const initialMessages: UIMessage[] = dbMessages.map(m => ({
    id:    m.id,
    role:  m.role as 'user' | 'assistant',
    parts: [{ type: 'text' as const, text: m.content }],
  })) as UIMessage[]

  const initialPlan: Plan | null    = project.plan ? (JSON.parse(project.plan) as Plan) : null
  const initialPocHtml: string | null = initialPlan?.pocHtml ?? null

  return (
    <WorkspaceView
      projectId={project.id}
      projectName={project.name}
      projectStatus={project.status}
      initialDescription={project.description}
      initialMessages={initialMessages}
      initialPlan={initialPlan}
      initialWidth={project.previewUrl || initialPocHtml ? 380 : 640}
      previewUrl={project.previewUrl}
      initialPocHtml={initialPocHtml}
    />
  )
}

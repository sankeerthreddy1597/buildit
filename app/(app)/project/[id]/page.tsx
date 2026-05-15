import { redirect, notFound } from 'next/navigation'
import { eq, and, asc } from 'drizzle-orm'
import type { UIMessage } from 'ai'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { projects, messages as messagesTable } from '@/lib/db/schema'
import { ChatPane } from '@/components/workspace/chat-pane'
import { PreviewPane } from '@/components/workspace/preview-pane'

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/project/${id}`)

  // Fetch project (ownership check via userId)
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, user.id)))

  if (!project) notFound()

  // Fetch existing message history
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

  return (
    <div className="flex h-full overflow-hidden">
      <ChatPane
        projectId={project.id}
        projectName={project.name}
        projectStatus={project.status}
        initialDescription={project.description}
        initialMessages={initialMessages}
      />
      <PreviewPane
        previewUrl={project.previewUrl}
        projectStatus={project.status}
      />
    </div>
  )
}

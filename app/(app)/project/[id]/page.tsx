import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { projects } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
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

  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, user.id)))

  if (!project) notFound()

  return (
    <div className="flex h-full overflow-hidden">
      <ChatPane
        projectId={project.id}
        projectName={project.name}
        projectStatus={project.status}
        initialDescription={project.description}
      />
      <PreviewPane
        previewUrl={project.previewUrl}
        projectStatus={project.status}
      />
    </div>
  )
}

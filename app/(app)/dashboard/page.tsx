import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { projects } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { Icon } from '@/components/shared/icons'
import { NewProjectButton } from '@/components/app/new-project-button'

const STATUS_CONFIG = {
  planning: { label: 'Planning', bg: 'var(--bg-soft)',              color: 'var(--fg-muted)',  pulse: false },
  building: { label: 'Building', bg: 'rgba(201,139,30,0.12)',       color: 'var(--warn)',      pulse: true  },
  ready:    { label: 'Ready',    bg: 'rgba(90,138,74,0.12)',        color: 'var(--ok)',        pulse: false },
  error:    { label: 'Error',    bg: 'rgba(176,56,48,0.12)',        color: 'var(--danger)',    pulse: false },
}

function formatDate(d: Date | null | undefined) {
  if (!d) return ''
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(d))
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/dashboard')

  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, user.id))
    .orderBy(desc(projects.createdAt))

  return (
    <div style={{ padding: '40px 48px', maxWidth: 1200 }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-fg font-semibold" style={{ fontSize: 22, letterSpacing: '-0.01em' }}>
            Projects
          </h1>
          <p className="text-fg-muted mt-0.5" style={{ fontSize: 13.5 }}>
            {rows.length === 0
              ? 'No projects yet — start building.'
              : `${rows.length} project${rows.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        {rows.length > 0 && <NewProjectButton />}
      </div>

      {rows.length === 0 ? (
        /* ── Empty state ── */
        <div
          className="flex flex-col items-center justify-center text-center"
          style={{
            border: '1px dashed var(--bd-strong)',
            borderRadius: 16,
            padding: '80px 48px',
          }}
        >
          <div
            className="flex items-center justify-center mb-4"
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'var(--brand-faint)',
              color: 'var(--brand)',
            }}
          >
            <Icon name="layers" size={22} />
          </div>
          <h2 className="text-fg font-medium mb-2" style={{ fontSize: 17 }}>
            No projects yet
          </h2>
          <p className="text-fg-muted mb-6" style={{ fontSize: 13.5, maxWidth: 320, lineHeight: 1.6 }}>
            Describe an app and the AI will plan, scaffold, and preview it in minutes.
          </p>
          <NewProjectButton primary />
        </div>
      ) : (
        /* ── Project grid ── */
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
        >
          {rows.map((project) => {
            const cfg = STATUS_CONFIG[project.status]
            return (
              <Link
                key={project.id}
                href={`/project/${project.id}`}
                className="group block rounded-xl transition-all hover:shadow-md"
                style={{
                  background: 'var(--bg-elev)',
                  border: '1px solid var(--bd)',
                  padding: '20px',
                }}
              >
                {/* Top row: status + arrow */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="inline-flex items-center gap-1.5"
                    style={{
                      padding: '3px 9px',
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 500,
                      background: cfg.bg,
                      color: cfg.color,
                    }}
                  >
                    {cfg.pulse && (
                      <span
                        className="pulse-dot shrink-0"
                        style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--warn)' }}
                      />
                    )}
                    {cfg.label}
                  </span>
                  <Icon
                    name="chevRight"
                    size={14}
                    className="text-fg-faint group-hover:text-fg-muted transition-colors"
                  />
                </div>

                {/* Name */}
                <h3
                  className="text-fg font-medium truncate mb-1"
                  style={{ fontSize: 14.5 }}
                >
                  {project.name}
                </h3>

                {/* Description */}
                {project.description && (
                  <p className="text-fg-muted line-clamp-2" style={{ fontSize: 12.5 }}>
                    {project.description}
                  </p>
                )}

                {/* Date */}
                <p className="text-fg-faint mt-3" style={{ fontSize: 11.5 }}>
                  {formatDate(project.createdAt)}
                </p>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

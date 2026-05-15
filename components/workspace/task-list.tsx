import { Icon } from '@/components/shared/icons'
import { cn } from '@/lib/utils'

// ── Types ────────────────────────────────────────────────────────────────────

export type TaskState = 'done' | 'running' | 'queued'

export type BuildTask = {
  id: string
  name: string
  state: TaskState
  duration?: string
}

interface TaskListProps {
  tasks: BuildTask[]
  className?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

export function TaskList({ tasks, className }: TaskListProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        className,
      )}
      style={{ padding: 40 }}
    >
      {/* "BUILDING" label */}
      <div className="flex items-center gap-2.5 mb-5">
        <span
          className="pulse-dot shrink-0"
          style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--brand)' }}
        />
        <span
          className="text-fg-muted uppercase tracking-widest"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5 }}
        >
          building
        </span>
      </div>

      {/* Headline */}
      <h2
        className="font-normal text-fg leading-tight"
        style={{ fontSize: 38, maxWidth: 560 }}
      >
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            color: 'var(--brand)',
          }}
        >
          Brewing
        </span>
        {' '}your app…
      </h2>

      {/* Subhead */}
      <p
        className="text-fg-muted mt-2.5 max-w-md"
        style={{ fontSize: 14 }}
      >
        This usually takes about 90 seconds. We&apos;ll show the preview as soon as the first
        page is reachable.
      </p>

      {/* Task card */}
      <div
        className="mt-8 text-left"
        style={{
          width: 480,
          background: 'var(--bg-elev)',
          border: '1px solid var(--bd)',
          borderRadius: 12,
          padding: 14,
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {tasks.map((task, i) => (
          <div
            key={task.id}
            className="flex items-center gap-2.5"
            style={{
              padding: '8px 4px',
              borderBottom: i < tasks.length - 1 ? '1px solid var(--bd)' : 'none',
            }}
          >
            {/* Status indicator */}
            <StatusIndicator state={task.state} />

            {/* Task name */}
            <span
              className="flex-1 min-w-0"
              style={{
                fontSize: 13,
                color: task.state === 'queued' ? 'var(--fg-muted)' : 'var(--fg)',
              }}
            >
              {task.name}
            </span>

            {/* Duration (completed only) */}
            {task.duration && (
              <span
                className="text-fg-muted shrink-0"
                style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}
              >
                {task.duration}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Footer fun-fact */}
      <p className="mt-4 text-fg-muted" style={{ fontSize: 12 }}>
        Did you know?{' '}
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            color: 'var(--brand)',
          }}
        >
          You can iterate while we build
        </span>{' '}
        — just keep chatting.
      </p>
    </div>
  )
}

// ── Status indicator ──────────────────────────────────────────────────────────

function StatusIndicator({ state }: { state: TaskState }) {
  if (state === 'done') {
    return (
      <span
        className="inline-flex items-center justify-center shrink-0 text-white"
        style={{ width: 14, height: 14, borderRadius: 4, background: 'var(--ok)' }}
      >
        <Icon name="check" size={9} strokeWidth={3} />
      </span>
    )
  }

  if (state === 'running') {
    return (
      <span
        className="spin-ring shrink-0"
        style={{
          display: 'block',
          width: 14,
          height: 14,
          borderRadius: 999,
          border: '2px solid var(--brand)',
          borderTopColor: 'transparent',
        }}
      />
    )
  }

  // queued
  return (
    <span
      className="shrink-0"
      style={{ display: 'block', width: 8, height: 8, borderRadius: 999, background: 'var(--bd-strong)', margin: '0 3px' }}
    />
  )
}

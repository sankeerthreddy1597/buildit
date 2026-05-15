'use client'

import { Icon } from '@/components/shared/icons'
import { cn } from '@/lib/utils'

// ── Types ────────────────────────────────────────────────────────────────────

export type PlanItem = {
  id: string
  name: string
  enabled: boolean
  required: boolean
}

export type PlanSection = {
  key: 'pages' | 'data' | 'integrations'
  title: string
  items: PlanItem[]
}

export type Plan = {
  appName: string
  description: string
  sections: PlanSection[]
  estimatedMinutes: number
  estimatedCredits: number
  starterKitArgs: string
}

interface PlanCardProps {
  plan: Plan
  onToggle: (sectionKey: PlanSection['key'], itemId: string) => void
  onBuild: () => void
  isBuilding?: boolean
  className?: string
}

// ── Section icon map ──────────────────────────────────────────────────────────

const SECTION_ICON = {
  pages:        'monitor',
  data:         'database',
  integrations: 'bolt',
} as const

// ── Component ─────────────────────────────────────────────────────────────────

export function PlanCard({ plan, onToggle, onBuild, isBuilding, className }: PlanCardProps) {
  const totalItems  = plan.sections.reduce((n, s) => n + s.items.length, 0)
  const enabledItems = plan.sections.reduce((n, s) => n + s.items.filter(i => i.enabled).length, 0)

  // Summary stats line
  const pages        = plan.sections.find(s => s.key === 'pages')?.items.length ?? 0
  const tables       = plan.sections.find(s => s.key === 'data')?.items.length ?? 0
  const integrations = plan.sections.find(s => s.key === 'integrations')?.items.filter(i => i.enabled).length ?? 0

  return (
    <div
      className={cn('overflow-hidden', className)}
      style={{
        background: 'var(--bg-elev)',
        borderRadius: 14,
        border: '1px solid var(--bd)',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3"
        style={{ padding: '14px 16px', borderBottom: '1px solid var(--bd)' }}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="pulse-dot shrink-0"
              style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--brand)' }}
            />
            <span className="text-fg font-semibold" style={{ fontSize: 13 }}>
              Plan ready · review before building
            </span>
          </div>
          <div
            className="text-fg-muted mt-0.5"
            style={{ fontSize: 11.5, marginLeft: 16 }}
          >
            {pages} pages · {tables} tables · {integrations} integrations
            {' · '}est. ~{plan.estimatedMinutes} min
            {' · '}
            <span style={{ fontFamily: 'var(--font-mono)' }}>~{plan.estimatedCredits} credits</span>
          </div>
        </div>

        {/* Starter args ghost button */}
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-fg-muted transition-colors hover:text-fg-dim"
          style={{ padding: '6px 10px', borderRadius: 8, fontSize: 12 }}
        >
          <Icon name="code" size={13} />
          Starter args
        </button>

        {/* Build button */}
        <button
          type="button"
          onClick={onBuild}
          disabled={isBuilding}
          className="inline-flex items-center gap-2 text-white font-medium transition-colors disabled:opacity-50"
          style={{
            padding: '8px 18px',
            borderRadius: 10,
            background: 'var(--brand)',
            fontSize: 13,
          }}
        >
          Build →
          <kbd
            className="inline-flex items-center justify-center"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              padding: '1px 5px',
              borderRadius: 4,
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: '#fff',
            }}
          >
            ↵
          </kbd>
        </button>
      </div>

      {/* Three-column section grid */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        {plan.sections.map((section, si) => (
          <div
            key={section.key}
            style={{
              padding: '14px 16px',
              borderRight: si < plan.sections.length - 1 ? '1px solid var(--bd)' : 'none',
            }}
          >
            {/* Section header */}
            <div
              className="flex items-center gap-1.5 text-fg-muted uppercase mb-2.5"
              style={{
                fontSize: 11,
                letterSpacing: '0.06em',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <Icon name={SECTION_ICON[section.key]} size={12} />
              {section.title}
            </div>

            {/* Items */}
            <div className="flex flex-col gap-2">
              {section.items.map((item) => (
                <label
                  key={item.id}
                  className={cn(
                    'flex items-center gap-2 cursor-pointer',
                    item.required && 'cursor-default',
                  )}
                >
                  {/* Checkbox */}
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={item.enabled}
                    disabled={item.required}
                    onClick={() => !item.required && onToggle(section.key, item.id)}
                    className="inline-flex items-center justify-center shrink-0 text-white transition-colors"
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 4,
                      border: `1.5px solid ${item.enabled ? 'var(--brand)' : 'var(--bd-strong)'}`,
                      background: item.enabled ? 'var(--brand)' : 'transparent',
                    }}
                  >
                    {item.enabled && <Icon name="check" size={10} strokeWidth={2.8} />}
                  </button>

                  {/* Label */}
                  <span
                    className="flex-1 min-w-0"
                    style={{
                      fontSize: 12.5,
                      color: item.enabled ? 'var(--fg)' : 'var(--fg-muted)',
                      textDecoration: item.enabled ? 'none' : 'line-through',
                    }}
                  >
                    {item.name}
                  </span>

                  {/* Required tag */}
                  {item.required && (
                    <span
                      className="text-fg-muted shrink-0"
                      style={{ fontFamily: 'var(--font-mono)', fontSize: 9 }}
                    >
                      •req
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer footnote */}
      <div
        className="flex items-center gap-2 text-fg-muted"
        style={{ padding: '8px 16px', fontSize: 11.5 }}
      >
        <Icon name="sparkle" size={11} />
        <span>
          {enabledItems}/{totalItems} features selected · You can iterate after the first build
          — uncheck anything to defer it.
        </span>
      </div>
    </div>
  )
}

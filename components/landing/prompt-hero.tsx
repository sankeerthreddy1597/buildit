'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PromptInput } from '@/components/shared/prompt-input'
import { MarginNote } from './margin-note'
import { Icon } from '@/components/shared/icons'

const SUGGESTIONS = [
  'A read-it-later app with tags',
  'Internal CRM with Stripe billing',
  'Landing page for my podcast',
  'Pomodoro timer with leaderboard',
]

export function PromptHero() {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!prompt.trim() || loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initialPrompt: prompt }),
      })
      if (res.status === 401) {
        router.push(`/login?next=/dashboard`)
        return
      }
      const { projectId } = await res.json()
      router.push(`/project/${projectId}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="absolute inset-0 flex flex-col items-center"
      style={{ paddingTop: 130 }}
    >
      {/* Eyebrow chip */}
      <div className="chip mb-7">
        <span className="inline-flex items-center gap-1.5">
          <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--ok)', flexShrink: 0 }} />
          Now in public beta
        </span>
        <span className="text-fg-faint">·</span>
        <span className="text-fg-muted">Bring your own model →</span>
      </div>

      {/* Headline */}
      <h1
        className="text-center text-fg"
        style={{
          fontSize: 96,
          lineHeight: 0.95,
          letterSpacing: '-0.04em',
          maxWidth: 1000,
          textWrap: 'pretty',
        } as React.CSSProperties}
      >
        <span style={{ fontWeight: 460 }}>The fastest way</span>
        <br />
        <span style={{ fontWeight: 460, color: 'var(--fg-dim)' }}>to </span>
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 110,
            color: 'var(--brand)',
          }}
        >
          build
        </span>
        <span style={{ fontWeight: 460, color: 'var(--fg-dim)' }}> it.</span>
      </h1>

      {/* Subhead */}
      <p
        className="text-center text-fg-dim mt-7"
        style={{ fontSize: 18, maxWidth: 600, lineHeight: 1.5 }}
      >
        Describe what you want. Answer a few questions.
        Watch a working app appear in a sandbox preview.
      </p>

      {/* Prompt input with margin notes */}
      <div className="relative mt-11" style={{ width: 720 }}>
        <PromptInput
          value={prompt}
          onChange={setPrompt}
          onSubmit={handleSubmit}
          placeholder="A habit tracker with email login, daily reminders, and a streak page…"
          disabled={loading}
          tall
        />

        <MarginNote
          dir="left"
          style={{ top: -10, right: -244, width: 230 }}
        >
          we&apos;ll ask you a few things first — auth? db? payments?
        </MarginNote>

        <MarginNote
          dir="right"
          style={{ bottom: -34, left: -254, width: 230, flexDirection: 'row-reverse' } as React.CSSProperties}
        >
          <span style={{ textAlign: 'right' }}>preview boots in&nbsp;~4s on E2B</span>
        </MarginNote>
      </div>

      {/* Suggestion chips */}
      <div
        className="flex flex-wrap justify-center gap-2 mt-8"
        style={{ maxWidth: 760 }}
      >
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setPrompt(s)}
            className="chip transition-colors hover:border-brand hover:text-brand"
            style={{ padding: '7px 14px', fontSize: 12.5, cursor: 'pointer' }}
          >
            <Icon name="sparkle" size={11} />
            {s}
          </button>
        ))}
      </div>

      {/* Scroll affordance */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: 70, background: 'linear-gradient(180deg, transparent, var(--bg))' }}
      />
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-fg-muted"
        style={{ fontSize: 12 }}
      >
        <span>How it works</span>
        <Icon name="chevDown" size={12} />
      </div>
    </div>
  )
}

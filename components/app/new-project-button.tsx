'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@/components/shared/icons'

interface NewProjectButtonProps {
  /** Filled brand-color style vs. outlined ghost style */
  primary?: boolean
}

export function NewProjectButton({ primary = false }: NewProjectButtonProps) {
  const router  = useRouter()
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initialPrompt: null }),
    })
    if (res.ok) {
      const { projectId } = await res.json()
      router.push(`/project/${projectId}`)
    } else {
      setLoading(false)
    }
  }

  if (primary) {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center gap-2 text-white font-medium transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        style={{
          padding: '10px 20px',
          borderRadius: 10,
          background: 'var(--brand)',
          fontSize: 13.5,
        }}
      >
        <Icon name="plus" size={14} />
        {loading ? 'Creating…' : 'New project'}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-2 text-fg-dim font-medium transition-colors hover:text-fg disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
      style={{
        padding: '7px 14px',
        borderRadius: 10,
        background: 'var(--bg-elev)',
        border: '1px solid var(--bd-strong)',
        fontSize: 13,
      }}
    >
      <Icon name="plus" size={13} />
      {loading ? 'Creating…' : 'New project'}
    </button>
  )
}

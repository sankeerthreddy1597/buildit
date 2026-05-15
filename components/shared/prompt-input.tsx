'use client'

import { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Icon } from './icons'

interface PromptInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  placeholder?: string
  disabled?: boolean
  /** Current model display label */
  modelLabel?: string
  onModelClick?: () => void
  /** Credit balance shown in workspace (omit on landing) */
  credits?: number
  /** Taller min-height — used in workspace chat dock */
  tall?: boolean
  className?: string
}

export function PromptInput({
  value,
  onChange,
  onSubmit,
  placeholder = 'Describe the app you want to build…',
  disabled = false,
  modelLabel = 'Claude Sonnet 4.6',
  onModelClick,
  credits,
  tall = false,
  className,
}: PromptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !disabled) onSubmit()
    }
  }

  return (
    <div
      className={cn('relative w-full', className)}
      style={{
        background: 'var(--bg-elev)',
        borderRadius: 18,
        border: '1px solid var(--bd)',
        boxShadow: 'var(--shadow-md)',
        padding: 18,
      }}
    >
      {/* Text area */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="w-full resize-none bg-transparent outline-none text-fg placeholder:text-fg-faint leading-relaxed"
        style={{
          fontSize: 16,
          minHeight: tall ? 84 : 56,
          fontFamily: 'var(--font-sans)',
        }}
      />

      {/* Footer row */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1.5">
          {/* Attach button */}
          <button
            type="button"
            className="flex items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-bg-soft"
            style={{ width: 30, height: 30 }}
            aria-label="Attach file"
          >
            <Icon name="paperclip" size={15} />
          </button>

          {/* Model picker pill */}
          <button
            type="button"
            onClick={onModelClick}
            className="inline-flex items-center gap-1.5 text-fg-muted transition-colors hover:text-fg-dim"
            style={{
              padding: '5px 10px',
              borderRadius: 8,
              border: '1px solid var(--bd)',
              fontSize: 12.5,
            }}
          >
            <span
              className="pulse-dot"
              style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--ok)', flexShrink: 0 }}
            />
            {modelLabel}
            <Icon name="chevDown" size={12} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Credits counter (workspace only) */}
          {credits !== undefined && (
            <span
              className="text-fg-muted"
              style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5 }}
            >
              {credits.toLocaleString()} credits
            </span>
          )}

          {/* Send button */}
          <button
            type="button"
            onClick={() => { if (value.trim() && !disabled) onSubmit() }}
            disabled={disabled || !value.trim()}
            className="inline-flex items-center justify-center text-white transition-colors disabled:opacity-40"
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'var(--brand)',
              flexShrink: 0,
            }}
            aria-label="Submit"
          >
            <Icon name="arrowUp" size={16} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </div>
  )
}

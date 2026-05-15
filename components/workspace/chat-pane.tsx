'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, isTextUIPart, type UIMessage } from 'ai'
import { PromptInput } from '@/components/shared/prompt-input'
import { Icon } from '@/components/shared/icons'
import { cn } from '@/lib/utils'
import { CLOUD_MODELS } from '@/lib/ai/providers'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ChatPaneProps {
  projectId: string
  projectName: string
  projectStatus: string
  initialDescription: string | null
  initialMessages: UIMessage[]
}

interface ModelOption {
  id: string
  label: string
  section: 'cloud' | 'local'
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ChatPane({
  projectId,
  projectName,
  projectStatus,
  initialDescription,
  initialMessages,
}: ChatPaneProps) {
  const [input, setInput]           = useState('')
  const [modelId, setModelId]       = useState('claude-sonnet-4-6')
  const [showPicker, setShowPicker] = useState(false)
  const [ollamaModels, setOllamaModels] = useState<string[]>([])
  const [ollamaLoading, setOllamaLoading] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pickerRef      = useRef<HTMLDivElement>(null)
  const initialized    = useRef(false)
  const modelIdRef     = useRef(modelId)
  modelIdRef.current   = modelId

  // Fetch Ollama models once on mount
  useEffect(() => {
    fetch('/api/ollama/models')
      .then(r => r.json())
      .then(d => setOllamaModels(d.models ?? []))
      .catch(() => {})
      .finally(() => setOllamaLoading(false))
  }, [])

  // Close picker on outside click
  useEffect(() => {
    if (!showPicker) return
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showPicker])

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        // Send only the new user message text — server loads history from DB
        prepareSendMessagesRequest: ({ messages: all }) => {
          const last = all[all.length - 1]
          const text = last ? last.parts.filter(isTextUIPart).map(p => p.text).join('') : ''
          return { body: { projectId, modelId: modelIdRef.current, message: text } }
        },
      }),
    [projectId],
  )

  const { messages, sendMessage, status, error } = useChat({
    transport,
    messages: initialMessages,
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  // Auto-send the initial description only on the very first open (no history yet)
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    if (initialMessages.length === 0 && initialDescription) {
      sendMessage({ text: initialDescription })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput('')
  }

  // Build the flat list of model options for the picker
  const modelOptions: ModelOption[] = [
    ...CLOUD_MODELS.map(m => ({ ...m, section: 'cloud' as const })),
    ...ollamaModels.map(name => ({
      id:      `ollama/${name}`,
      label:   name,
      section: 'local' as const,
    })),
  ]

  const selectedModel = modelOptions.find(m => m.id === modelId)
  const modelLabel    = selectedModel?.label ?? modelId

  return (
    <div
      className="flex flex-col shrink-0"
      style={{
        width: 380,
        borderRight: '1px solid var(--bd)',
        background: 'var(--bg-elev)',
      }}
    >
      {/* ── Top bar ── */}
      <div
        className="flex items-center gap-2.5 shrink-0"
        style={{ padding: '12px 16px', borderBottom: '1px solid var(--bd)' }}
      >
        <Link
          href="/dashboard"
          className="text-fg-muted hover:text-fg transition-colors"
          title="Back to dashboard"
        >
          <Icon name="chevRight" size={15} className="rotate-180" />
        </Link>
        <span className="text-fg font-medium flex-1 truncate" style={{ fontSize: 14 }}>
          {projectName}
        </span>
        <StatusBadge status={projectStatus} />
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto" style={{ padding: '16px 12px' }}>
        {messages.length === 0 && !isLoading && (
          <div
            className="flex flex-col items-center justify-center text-center h-full"
            style={{ padding: '32px 0' }}
          >
            <div
              className="flex items-center justify-center mb-4"
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'var(--brand-faint)',
                color: 'var(--brand)',
              }}
            >
              <Icon name="sparkle" size={20} />
            </div>
            <p
              className="text-fg-muted"
              style={{ fontSize: 13.5, maxWidth: 260, lineHeight: 1.65 }}
            >
              Describe the app you want to build and the AI will start planning.
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const text = msg.parts.filter(isTextUIPart).map(p => p.text).join('')
          if (!text) return null
          const isUser = msg.role === 'user'
          return (
            <div
              key={msg.id}
              className={cn('flex mb-3', isUser ? 'justify-end' : 'justify-start')}
            >
              <div
                className={isUser ? 'text-white' : 'text-fg'}
                style={{
                  maxWidth: '86%',
                  padding: '10px 13px',
                  borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: isUser ? 'var(--brand)' : 'var(--bg-soft)',
                  border: isUser ? 'none' : '1px solid var(--bd)',
                  fontSize: 13.5,
                  lineHeight: 1.55,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {text}
              </div>
            </div>
          )
        })}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex justify-start mb-3">
            <div
              className="flex items-center gap-1.5"
              style={{
                padding: '12px 14px',
                borderRadius: '16px 16px 16px 4px',
                background: 'var(--bg-soft)',
                border: '1px solid var(--bd)',
              }}
            >
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="typing-dot"
                  style={{
                    display: 'block',
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    background: 'var(--fg-muted)',
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {error && (
          <p className="text-danger text-center my-2" style={{ fontSize: 12.5 }}>
            {error.message}
          </p>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input area ── */}
      <div className="relative" style={{ padding: '10px', borderTop: '1px solid var(--bd)' }}>
        {/* Model picker dropdown */}
        {showPicker && (
          <div
            ref={pickerRef}
            className="absolute left-3 right-3 z-50 rounded-xl overflow-hidden"
            style={{
              bottom: 'calc(100% - 4px)',
              background: 'var(--bg-elev)',
              border: '1px solid var(--bd)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            {/* Cloud models */}
            <div
              className="text-fg-faint uppercase px-3 pt-2.5 pb-1"
              style={{ fontSize: 10.5, letterSpacing: '0.07em', fontFamily: 'var(--font-mono)' }}
            >
              Cloud
            </div>
            {CLOUD_MODELS.map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => { setModelId(m.id); setShowPicker(false) }}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors cursor-pointer',
                  modelId === m.id ? 'text-fg bg-bg-soft' : 'text-fg-dim hover:bg-bg-soft hover:text-fg',
                )}
                style={{ fontSize: 13 }}
              >
                <span
                  className="shrink-0"
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 999,
                    background: modelId === m.id ? 'var(--brand)' : 'var(--bd-strong)',
                    display: 'block',
                  }}
                />
                {m.label}
                {modelId === m.id && (
                  <Icon name="check" size={12} className="ml-auto text-brand" />
                )}
              </button>
            ))}

            {/* Ollama section */}
            <div
              className="text-fg-faint uppercase px-3 pt-2.5 pb-1 mt-1"
              style={{
                fontSize: 10.5,
                letterSpacing: '0.07em',
                fontFamily: 'var(--font-mono)',
                borderTop: '1px solid var(--bd)',
              }}
            >
              Local · Ollama
            </div>

            {ollamaLoading ? (
              <div className="px-3 py-2 text-fg-faint" style={{ fontSize: 12.5 }}>
                Checking…
              </div>
            ) : ollamaModels.length === 0 ? (
              <div className="px-3 py-2.5 pb-3" style={{ fontSize: 12.5, color: 'var(--fg-muted)' }}>
                Ollama not detected.{' '}
                <a
                  href="https://ollama.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand underline"
                >
                  Install Ollama
                </a>{' '}
                and run{' '}
                <code
                  className="text-fg-dim"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5 }}
                >
                  ollama pull llama3
                </code>
              </div>
            ) : (
              ollamaModels.map(name => {
                const id = `ollama/${name}`
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => { setModelId(id); setShowPicker(false) }}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors cursor-pointer',
                      modelId === id ? 'text-fg bg-bg-soft' : 'text-fg-dim hover:bg-bg-soft hover:text-fg',
                    )}
                    style={{ fontSize: 13 }}
                  >
                    <span
                      className="shrink-0"
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: 999,
                        background: modelId === id ? 'var(--ok)' : 'var(--bd-strong)',
                        display: 'block',
                      }}
                    />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{name}</span>
                    {modelId === id && (
                      <Icon name="check" size={12} className="ml-auto text-ok" />
                    )}
                  </button>
                )
              })
            )}

            <div style={{ height: 6 }} />
          </div>
        )}

        <PromptInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          disabled={isLoading}
          modelLabel={modelLabel}
          onModelClick={() => setShowPicker(p => !p)}
          tall
        />
      </div>
    </div>
  )
}

// ── Status badge ──────────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, { label: string; bg: string; color: string; pulse?: boolean }> = {
  planning: { label: 'Planning', bg: 'var(--bg-soft)',          color: 'var(--fg-muted)'    },
  building: { label: 'Building', bg: 'rgba(201,139,30,0.12)',   color: 'var(--warn)',   pulse: true },
  ready:    { label: 'Ready',    bg: 'rgba(90,138,74,0.12)',    color: 'var(--ok)'          },
  error:    { label: 'Error',    bg: 'rgba(176,56,48,0.12)',    color: 'var(--danger)'      },
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_MAP[status] ?? STATUS_MAP.planning
  return (
    <span
      className="inline-flex items-center gap-1.5 shrink-0"
      style={{
        padding: '3px 8px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 500,
        background: cfg.bg,
        color: cfg.color,
      }}
    >
      {cfg.pulse && (
        <span
          className="pulse-dot"
          style={{ display: 'block', width: 5, height: 5, borderRadius: 999, background: 'var(--warn)', flexShrink: 0 }}
        />
      )}
      {cfg.label}
    </span>
  )
}

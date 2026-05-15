'use client'

import { useState } from 'react'
import { Icon } from '@/components/shared/icons'

interface PreviewPaneProps {
  previewUrl:    string | null
  projectStatus: string
  pocHtml?:      string | null
}

export function PreviewPane({ previewUrl, projectStatus, pocHtml }: PreviewPaneProps) {
  const [iframeKey, setIframeKey] = useState(0)

  // ── PoC HTML preview ─────────────────────────────────────────────────────────
  if (pocHtml) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: 'var(--bg)' }}>
        {/* Toolbar */}
        <div
          className="flex items-center gap-2 shrink-0"
          style={{
            padding: '8px 12px',
            borderBottom: '1px solid var(--bd)',
            background: 'var(--bg-elev)',
          }}
        >
          <div
            className="flex-1 flex items-center gap-2"
            style={{
              padding: '0 10px',
              height: 32,
              background: 'var(--bg-soft)',
              border: '1px solid var(--bd)',
              borderRadius: 8,
            }}
          >
            <Icon name="code" size={12} className="text-fg-faint shrink-0" />
            <span className="text-fg-muted" style={{ fontSize: 12, fontFamily: 'var(--font-mono)' }}>
              proof-of-concept · HTML preview
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIframeKey(k => k + 1)}
            className="inline-flex items-center justify-center text-fg-muted transition-colors hover:text-fg cursor-pointer"
            style={{ width: 30, height: 30, borderRadius: 7, border: '1px solid var(--bd)' }}
            title="Refresh preview"
          >
            <Icon name="refresh" size={13} />
          </button>
        </div>

        {/* srcdoc iframe — allow-scripts only, no same-origin */}
        <iframe
          key={iframeKey}
          srcDoc={pocHtml}
          className="flex-1 w-full border-0"
          sandbox="allow-scripts"
          title="PoC preview"
        />
      </div>
    )
  }

  // ── No preview yet ────────────────────────────────────────────────────────────
  if (!previewUrl) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center text-center"
        style={{ background: 'var(--bg)', padding: 48 }}
      >
        {projectStatus === 'building' ? (
          <>
            <span
              className="spin-ring mb-5"
              style={{
                display: 'block',
                width: 36,
                height: 36,
                borderRadius: 999,
                border: '3px solid var(--brand)',
                borderTopColor: 'transparent',
              }}
            />
            <h3 className="text-fg font-medium mb-2" style={{ fontSize: 16 }}>
              Building your app…
            </h3>
            <p className="text-fg-muted" style={{ fontSize: 13.5, maxWidth: 320, lineHeight: 1.6 }}>
              The preview will appear here as soon as the first page is reachable.
            </p>
          </>
        ) : (
          <>
            <div
              className="flex items-center justify-center mb-4"
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: 'var(--bg-soft)',
                color: 'var(--fg-faint)',
              }}
            >
              <Icon name="monitor" size={24} />
            </div>
            <h3 className="text-fg-muted font-normal mb-1.5" style={{ fontSize: 15 }}>
              Preview will appear here
            </h3>
            <p className="text-fg-faint" style={{ fontSize: 13, maxWidth: 280, lineHeight: 1.6 }}>
              Finish planning in the chat and click{' '}
              <strong className="text-fg-muted font-medium">Build</strong> to start.
            </p>
          </>
        )}
      </div>
    )
  }

  // ── Full-build URL preview ────────────────────────────────────────────────────
  return (
    <div
      className="flex-1 flex flex-col overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
      {/* Toolbar */}
      <div
        className="flex items-center gap-2 shrink-0"
        style={{
          padding: '8px 12px',
          borderBottom: '1px solid var(--bd)',
          background: 'var(--bg-elev)',
        }}
      >
        <div
          className="flex-1 flex items-center gap-2 rounded-lg"
          style={{
            padding: '0 10px',
            height: 32,
            background: 'var(--bg-soft)',
            border: '1px solid var(--bd)',
            overflow: 'hidden',
          }}
        >
          <Icon name="globe" size={12} className="text-fg-faint shrink-0" />
          <span
            className="text-fg-muted truncate"
            style={{ fontSize: 12, fontFamily: 'var(--font-mono)' }}
          >
            {previewUrl}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIframeKey(k => k + 1)}
          className="inline-flex items-center justify-center text-fg-muted transition-colors hover:text-fg cursor-pointer"
          style={{ width: 30, height: 30, borderRadius: 7, border: '1px solid var(--bd)' }}
          title="Refresh preview"
        >
          <Icon name="refresh" size={13} />
        </button>

        <a
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center text-fg-muted transition-colors hover:text-fg"
          style={{ width: 30, height: 30, borderRadius: 7, border: '1px solid var(--bd)' }}
          title="Open in new tab"
        >
          <Icon name="external" size={13} />
        </a>
      </div>

      <iframe
        key={iframeKey}
        src={previewUrl}
        className="flex-1 w-full border-0"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        title="App preview"
      />
    </div>
  )
}

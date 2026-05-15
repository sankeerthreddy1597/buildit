'use client'

import { useState, useCallback } from 'react'
import type { UIMessage } from 'ai'
import { ChatPane } from '@/components/workspace/chat-pane'
import { PreviewPane } from '@/components/workspace/preview-pane'
import type { Plan } from '@/components/workspace/plan-card'

interface WorkspaceViewProps {
  projectId:          string
  projectName:        string
  projectStatus:      string
  initialDescription: string | null
  initialMessages:    UIMessage[]
  initialPlan:        Plan | null
  initialWidth:       number
  previewUrl:         string | null
  initialPocHtml:     string | null
}

export function WorkspaceView({
  projectId,
  projectName,
  projectStatus,
  initialDescription,
  initialMessages,
  initialPlan,
  initialWidth,
  previewUrl,
  initialPocHtml,
}: WorkspaceViewProps) {
  const [pocHtml, setPocHtml]   = useState<string | null>(initialPocHtml)
  const [status, setStatus]     = useState(projectStatus)

  const handlePocHtml     = useCallback((html: string) => setPocHtml(html), [])
  const handleStatusChange = useCallback((s: string)   => setStatus(s), [])

  return (
    <div className="flex h-full overflow-hidden">
      <ChatPane
        projectId={projectId}
        projectName={projectName}
        projectStatus={status}
        initialDescription={initialDescription}
        initialMessages={initialMessages}
        initialPlan={initialPlan}
        initialWidth={initialWidth}
        onPocHtml={handlePocHtml}
        onStatusChange={handleStatusChange}
      />
      <PreviewPane
        previewUrl={previewUrl}
        projectStatus={status}
        pocHtml={pocHtml}
      />
    </div>
  )
}

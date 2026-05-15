import { streamText, convertToModelMessages, type UIMessage } from 'ai'
import { eq, asc } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { messages as messagesTable } from '@/lib/db/schema'
import { getModel } from '@/lib/ai/providers'

const SYSTEM_PROMPT = `You are a planning assistant for buildit, an AI app builder.

When the user describes an app idea, ask 2-3 concise clarifying questions to understand:
1. Does it need user authentication?
2. Does it need a database or backend?
3. What is the primary user flow?

Keep each question short. Once you have enough information, summarize what you'll build in a few sentences and tell the user you're ready to build whenever they are.

Be direct, friendly, and efficient — users want to build fast.`

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const body = await req.json()
  const projectId: string = body.projectId
  const modelId: string   = body.modelId ?? 'claude-sonnet-4-6'
  const message: string   = body.message ?? ''

  if (!projectId || !message.trim()) {
    return new Response('Bad request', { status: 400 })
  }

  // ── Load existing history from DB ──────────────────────────────────────────
  const history = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.projectId, projectId))
    .orderBy(asc(messagesTable.createdAt))

  // ── Save the incoming user message ─────────────────────────────────────────
  const [savedUserMsg] = await db
    .insert(messagesTable)
    .values({ projectId, role: 'user', content: message, mode: 'plan' })
    .returning({ id: messagesTable.id })

  // ── Build full UIMessage array for the model ───────────────────────────────
  const uiMessages = [
    ...history.map(m => ({
      id:    m.id,
      role:  m.role as 'user' | 'assistant',
      parts: [{ type: 'text' as const, text: m.content }],
    })),
    {
      id:    savedUserMsg.id,
      role:  'user' as const,
      parts: [{ type: 'text' as const, text: message }],
    },
  ] as UIMessage[]

  // ── Stream response ────────────────────────────────────────────────────────
  const result = streamText({
    model: getModel(modelId),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(uiMessages),
    onFinish: async ({ text }) => {
      try {
        await db.insert(messagesTable).values({
          projectId,
          role: 'assistant',
          content: text,
          mode: 'plan',
        })
      } catch (err) {
        console.error('[chat] failed to save assistant message:', err)
      }
    },
  })

  return result.toUIMessageStreamResponse()
}

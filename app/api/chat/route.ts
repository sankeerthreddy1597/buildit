import { streamText, convertToModelMessages, tool, type UIMessage } from 'ai'
import { z } from 'zod'
import { eq, asc, and } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { messages as messagesTable, projects } from '@/lib/db/schema'
import { getModel } from '@/lib/ai/providers'

const SYSTEM_PROMPT = `You are a planning assistant for buildit, an AI app builder.

When the user describes an app idea, ask 2-3 concise clarifying questions to understand:
1. Does it need user authentication?
2. Does it need a database or backend?
3. What is the primary user flow?

Keep each question short. Once you have enough information, call the \`propose_plan\` tool to present your proposed build plan to the user for review. Only call \`propose_plan\` once you have gathered enough context — do not call it prematurely.

If the user asks to change the plan, call \`propose_plan\` again with the updated plan — this will replace the previous one.

## Proof of concept mode
For simple apps with no backend, no auth, and no data persistence — such as calculators, colour pickers, games, simple UI tools, or single-page demos — set \`isProofOfConcept: true\` in the plan. These are built as a single self-contained HTML file instead of a full starter-kit project.

When the user confirms a proof-of-concept plan and asks you to generate, call the \`generate_poc\` tool with a complete, polished HTML document that:
- Includes Tailwind CSS via CDN: \`<script src="https://cdn.tailwindcss.com"></script>\`
- Has all logic in inline \`<script>\` tags (vanilla JS, no imports)
- Is fully self-contained — no external dependencies other than Tailwind CDN
- Looks professional and is fully functional

Be direct, friendly, and efficient — users want to build fast.`

const planItemSchema = z.object({
  id:       z.string().describe('Unique slug, e.g. "home-page"'),
  name:     z.string(),
  enabled:  z.boolean(),
  required: z.boolean().describe('True if the item cannot be deselected'),
})

const planSectionSchema = z.object({
  key:   z.enum(['pages', 'data', 'integrations']),
  title: z.string(),
  items: z.array(planItemSchema),
})

const proposePlanSchema = z.object({
  appName:            z.string().describe('Short name of the app being built'),
  description:        z.string().describe('1-2 sentence summary of what the app does'),
  sections:           z.array(planSectionSchema),
  estimatedMinutes:   z.number().int().describe('Rough build time estimate in minutes'),
  estimatedCredits:   z.number().int().describe('Estimated credit usage'),
  starterKitArgs:     z.string().describe('CLI args for the starter kit, e.g. "--features auth,db"'),
  isProofOfConcept:   z.boolean().optional().describe('True for simple no-backend apps that will be built as a single HTML file'),
})

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

  // Ownership check
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, user.id)))
  if (!project) return new Response('Not found', { status: 404 })

  // When a PoC plan is confirmed and the project is building, use a focused
  // directive prompt so the agent knows to call generate_poc immediately.
  const parsedPlan = project.plan ? JSON.parse(project.plan) : null
  const isPocBuilding = project.status === 'building' && parsedPlan?.isProofOfConcept === true

  const activeSystemPrompt = isPocBuilding
    ? `You are an HTML generator for buildit. The user has already confirmed the following proof-of-concept plan and clicked Generate:

${JSON.stringify(parsedPlan, null, 2)}

Your ONLY task is to call the \`generate_poc\` tool immediately with a complete, polished, self-contained HTML document that implements this app. Do NOT call \`propose_plan\`. Do NOT ask questions. Call \`generate_poc\` now.

Requirements for the HTML:
- Include Tailwind CSS via CDN: <script src="https://cdn.tailwindcss.com"></script>
- All logic in inline <script> tags (vanilla JS, no imports or module bundlers)
- Fully self-contained — no external dependencies other than Tailwind CDN
- Professional appearance, fully functional`
    : SYSTEM_PROMPT

  // Load existing history
  const history = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.projectId, projectId))
    .orderBy(asc(messagesTable.createdAt))

  // Save incoming user message
  const [savedUserMsg] = await db
    .insert(messagesTable)
    .values({ projectId, role: 'user', content: message, mode: 'plan' })
    .returning({ id: messagesTable.id })

  // Build full UIMessage array
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

  const result = streamText({
    model: getModel(modelId),
    system: activeSystemPrompt,
    messages: await convertToModelMessages(uiMessages),
    tools: {
      propose_plan: tool({
        description: 'Present the build plan to the user for review. Call this once you have gathered enough context. Call it again if the user requests changes.',
        inputSchema: proposePlanSchema,
        execute: async (plan) => {
          await db
            .update(projects)
            .set({ plan: JSON.stringify(plan), name: plan.appName, updatedAt: new Date() })
            .where(eq(projects.id, projectId))
          return { ok: true }
        },
      }),

      generate_poc: tool({
        description: 'Generate the proof-of-concept HTML for a simple app. Only call this when the user has confirmed a proof-of-concept plan and asked you to generate.',
        inputSchema: z.object({
          html: z.string().describe('Complete self-contained HTML document with Tailwind CSS via CDN'),
        }),
        execute: async ({ html }) => {
          // Re-read current plan to avoid using stale closure data
          const [proj] = await db
            .select({ plan: projects.plan })
            .from(projects)
            .where(eq(projects.id, projectId))
          const currentPlan = proj?.plan ? JSON.parse(proj.plan) : {}
          await db
            .update(projects)
            .set({
              plan:      JSON.stringify({ ...currentPlan, pocHtml: html }),
              status:    'ready',
              updatedAt: new Date(),
            })
            .where(eq(projects.id, projectId))
          return { ok: true }
        },
      }),
    },
    onFinish: async ({ text }) => {
      if (!text.trim()) return
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

import { streamText, convertToModelMessages, type UIMessage } from 'ai'
import { createClient } from '@/lib/supabase/server'
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
  const messages: UIMessage[] = body.messages ?? []
  const modelId: string = body.modelId ?? 'claude-sonnet-4-6'

  const result = streamText({
    model: getModel(modelId),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}

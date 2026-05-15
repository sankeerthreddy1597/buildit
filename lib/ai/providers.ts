import { createAnthropic } from '@ai-sdk/anthropic'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'

const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const ollama = createOpenAICompatible({
  name: 'ollama',
  baseURL: 'http://localhost:11434/v1',
})

export const CLOUD_MODELS = [
  { id: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6' },
  { id: 'claude-opus-4-7',   label: 'Claude Opus 4.7'   },
] as const

export type ModelId = string

export function getModel(modelId: ModelId) {
  if (modelId.startsWith('ollama/')) {
    return ollama(modelId.slice('ollama/'.length))
  }
  return anthropic(modelId)
}

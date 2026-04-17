import { OpenAIAdapter } from '../adapters/openAiAdapter'
import { parseAIResponse } from '../adapters/responseAdapter'
import type { AIProvider } from '../adapters/aiProvider'
import { buildPrompt } from '../prompt/promptBuilder'
import type { AIInsightInput, AIInsightResult } from '../types'

// ─── Version counter (increments per generation within the session) ───────────
let sessionVersion = 0

// ─── Provider resolution ──────────────────────────────────────────────────────

/**
 * Resolves the active AI provider.
 *
 * In DEV, uses the OpenAI adapter with VITE_OPENAI_KEY.
 * In production, the key must be injected via the tenant backend config —
 * never hardcoded or committed.
 *
 * The service is the ONLY place that knows which provider is active.
 * The rest of the module works exclusively against the AIProvider interface.
 */
function resolveProvider(): AIProvider {
  const apiKey = import.meta.env.VITE_OPENAI_KEY as string | undefined

  if (!apiKey) {
    throw new Error(
      'Provedor de IA não configurado. Defina VITE_OPENAI_KEY no arquivo .env.local para usar o módulo AI Insights em desenvolvimento.',
    )
  }

  return new OpenAIAdapter(apiKey)
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const insightService = {
  /**
   * Generates a new AIInsightResult from a structured AIInsightInput.
   *
   * Flow:
   *   1. Build prompt from input (prompt layer)
   *   2. Send to provider (adapter layer)
   *   3. Parse raw response into typed result (adapter layer)
   *
   * This function is the only integration point between the prompt/adapter
   * layers and the rest of the application.
   */
  async generate(input: AIInsightInput): Promise<AIInsightResult> {
    const provider = resolveProvider()
    const { system, user } = buildPrompt(input)
    const rawText = await provider.generate(system, user)
    sessionVersion += 1
    return parseAIResponse(rawText, sessionVersion)
  },
}

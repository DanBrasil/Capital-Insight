import type { AIProvider } from './aiProvider'

/**
 * OpenAI Chat Completions adapter.
 *
 * Uses the fetch API directly to avoid bundling the full openai SDK.
 * In DEV, the key comes from VITE_OPENAI_KEY (never committed).
 * In production, the key must come from the backend/tenant config — never
 * exposed to the frontend bundle.
 *
 * Model: gpt-4o-mini — good balance of quality, speed, and token cost.
 */
export class OpenAIAdapter implements AIProvider {
  private readonly apiKey: string
  private readonly model: string

  constructor(apiKey: string, model = 'gpt-4o-mini') {
    this.apiKey = apiKey
    this.model = model
  }

  async generate(system: string, user: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        temperature: 0.3, // low temperature = more consistent, less creative
        max_tokens: 1024,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'erro desconhecido')
      throw new Error(`OpenAI API error ${response.status}: ${errorText}`)
    }

    const data = (await response.json()) as {
      choices: { message: { content: string | null } }[]
    }

    const content = data.choices?.[0]?.message?.content
    if (!content) throw new Error('Resposta vazia do provedor de IA')

    return content
  }
}

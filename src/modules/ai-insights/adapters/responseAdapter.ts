import type { AIInsightResult, AIInsightSection } from '../types'

// ─── Section delimiters (must match SYSTEM_INSTRUCTION in promptBuilder.ts) ──

const SECTION_MAP: Record<string, { id: string; title: string; priority: number }> = {
  '[CONCENTRACAO]': { id: 'concentration', title: 'Concentração e Distribuição', priority: 2 },
  '[PERFORMANCE]': { id: 'performance', title: 'Desempenho da Carteira', priority: 3 },
  '[EXPOSICAO]': { id: 'exposure', title: 'Exposição por Classe', priority: 4 },
}

const SUMMARY_DELIMITER = '[RESUMO]'
const WARNINGS_DELIMITER = '[ALERTAS]'

// ─── Parser ──────────────────────────────────────────────────────────────────

/**
 * Parses the raw text returned by the AI provider into a typed AIInsightResult.
 *
 * Strategy: split by known delimiters, extract each block, clean whitespace.
 * If a required block is missing, fallback text is used so the UI never breaks.
 * Warnings are extracted as a list (lines starting with "-").
 *
 * This is the ONLY place that deals with the raw AI string.
 * If the AI output format changes, only this file needs to be updated.
 */
export function parseAIResponse(rawText: string, sourceVersion: number): AIInsightResult {
  const summary = extractBlock(rawText, SUMMARY_DELIMITER, Object.keys(SECTION_MAP)[0])
  const sections = extractSections(rawText)
  const warnings = extractWarnings(rawText)

  return {
    summary: summary || 'Não foi possível gerar o resumo. Tente novamente.',
    sections,
    warnings,
    generatedAt: new Date().toISOString(),
    sourceVersion,
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Extracts the text between `startDelimiter` and `endDelimiter`.
 * Returns an empty string if the delimiter is not found.
 */
function extractBlock(text: string, startDelimiter: string, endDelimiter: string): string {
  const startIdx = text.indexOf(startDelimiter)
  if (startIdx === -1) return ''

  const contentStart = startIdx + startDelimiter.length
  const endIdx = text.indexOf(endDelimiter, contentStart)
  const raw = endIdx === -1 ? text.slice(contentStart) : text.slice(contentStart, endIdx)
  return raw.trim()
}

function extractSections(text: string): AIInsightSection[] {
  const delimiters = Object.keys(SECTION_MAP)
  const sections: AIInsightSection[] = []

  for (let i = 0; i < delimiters.length; i++) {
    const currentDelimiter = delimiters[i]
    const nextDelimiter = i < delimiters.length - 1 ? delimiters[i + 1] : WARNINGS_DELIMITER
    const meta = SECTION_MAP[currentDelimiter]

    const content = extractBlock(text, currentDelimiter, nextDelimiter)
    if (content) {
      sections.push({ id: meta.id, title: meta.title, content, priority: meta.priority })
    }
  }

  return sections.sort((a, b) => a.priority - b.priority)
}

function extractWarnings(text: string): string[] {
  const block = extractBlock(text, WARNINGS_DELIMITER, '\n\n\n') // grab to end
  if (!block) return []

  return block
    .split('\n')
    .map(line => line.replace(/^-\s*/, '').trim())
    .filter(line => line.length > 0 && line !== 'Nenhuma observação relevante identificada.')
}

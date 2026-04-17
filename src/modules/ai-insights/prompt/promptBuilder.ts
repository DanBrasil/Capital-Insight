import type { AIInsightInput } from '../types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPercent(n: number): string {
  const sign = n >= 0 ? '+' : ''
  return `${sign}${n.toFixed(2)}%`
}

function formatCurrency(n: number, currencyCode: string): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: currencyCode }).format(n)
}

// ─── System prompt (invariant) ────────────────────────────────────────────────

const SYSTEM_INSTRUCTION = `Você é um assistente de análise financeira descritiva para uma plataforma de monitoramento de investimentos.

Seu papel é interpretar dados estruturados de uma carteira de investimentos e produzir uma análise textual objetiva.

REGRAS OBRIGATÓRIAS:
- Nunca faça recomendações de compra ou venda de ativos
- Nunca sugira estratégias de investimento ou rebalanceamento
- Nunca prometa ou projete retornos futuros
- Nunca invente dados que não estejam no input fornecido
- Não substitua cálculos determinísticos do sistema — os números já estão calculados
- Mantenha tom profissional, claro e neutro
- Limite cada seção a no máximo 3 parágrafos concisos

ESTRUTURA OBRIGATÓRIA DA RESPOSTA:
Sua resposta deve conter exatamente as seções abaixo, separadas pelos delimitadores indicados.
Não adicione seções extras nem altere os delimitadores.

[RESUMO]
<texto do resumo executivo — 2 a 3 frases descrevendo o estado geral da carteira>

[CONCENTRACAO]
<análise descritiva da distribuição e concentração dos ativos>

[PERFORMANCE]
<análise descritiva do desempenho geral, melhores e piores resultados>

[EXPOSICAO]
<análise descritiva da exposição por classe de ativo>

[ALERTAS]
<lista de observações descritivas, uma por linha, iniciadas com "-">
Se não houver alertas relevantes, escreva apenas: - Nenhuma observação relevante identificada.`

// ─── Data serializer (turns AIInsightInput into human-readable text) ──────────

function serializeInput(input: AIInsightInput): string {
  const {
    portfolioSnapshot: snap,
    topPositions,
    topPerformer,
    worstPerformer,
    allocationByType,
    recentOperations,
  } = input

  const lines: string[] = []

  lines.push('=== DADOS DA CARTEIRA ===')
  lines.push(`Total investido: ${formatCurrency(snap.totalInvested, snap.currencyCode)}`)
  lines.push(`Valor atual: ${formatCurrency(snap.currentValue, snap.currencyCode)}`)
  lines.push(`Retorno total: ${formatPercent(snap.totalProfitLossPercent)}`)
  lines.push(`Número de ativos: ${snap.totalAssets}`)
  lines.push(`Data de referência: ${new Date(input.generatedAt).toLocaleDateString('pt-BR')}`)
  lines.push('')

  if (topPositions.length > 0) {
    lines.push('=== PRINCIPAIS POSIÇÕES (por alocação) ===')
    for (const p of topPositions) {
      lines.push(
        `${p.symbol} (${p.name}) — Tipo: ${p.type} — Alocação: ${p.allocationPercent}% — Retorno: ${formatPercent(p.profitLossPercent)}`,
      )
    }
    lines.push('')
  }

  if (allocationByType.length > 0) {
    lines.push('=== DISTRIBUIÇÃO POR CLASSE ===')
    for (const a of allocationByType) {
      lines.push(`${a.type}: ${a.allocationPercent}%`)
    }
    lines.push('')
  }

  if (topPerformer) {
    lines.push('=== MELHOR DESEMPENHO ===')
    lines.push(
      `${topPerformer.symbol} (${topPerformer.name}) — Retorno: ${formatPercent(topPerformer.profitLossPercent)} — Alocação: ${topPerformer.allocationPercent}%`,
    )
    lines.push('')
  }

  if (worstPerformer) {
    lines.push('=== PIOR DESEMPENHO ===')
    lines.push(
      `${worstPerformer.symbol} (${worstPerformer.name}) — Retorno: ${formatPercent(worstPerformer.profitLossPercent)} — Alocação: ${worstPerformer.allocationPercent}%`,
    )
    lines.push('')
  }

  if (recentOperations.length > 0) {
    lines.push('=== OPERAÇÕES RECENTES ===')
    for (const op of recentOperations) {
      const type = op.operationType === 'buy' ? 'Compra' : 'Venda'
      lines.push(`${op.symbol} — ${type} — ${op.operationDate}`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Builds the final prompt string sent to the AI provider.
 *
 * The system instruction and data serialization are kept together here
 * because they are co-dependent: the system instruction defines the output
 * format, and the data serialization is designed to be read by that prompt.
 *
 * This is a business policy — changing tone or output format is a change
 * to this file only, with no impact on components or services.
 */
export function buildPrompt(input: AIInsightInput): { system: string; user: string } {
  return {
    system: SYSTEM_INSTRUCTION,
    user: serializeInput(input),
  }
}

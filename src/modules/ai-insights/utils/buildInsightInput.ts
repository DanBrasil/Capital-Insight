import type { PortfolioData } from '@/modules/portfolio/types'
import type { Operation } from '@/modules/operations/types'

import type {
  AIInsightAllocationByType,
  AIInsightInput,
  AIInsightPositionSummary,
  AIInsightRecentOperation,
} from '../types'

/**
 * Serializes already-computed portfolio and operation data into the minimal
 * structured input the AI provider will receive.
 *
 * Rules:
 * - No IDs, audit fields, prices, or broker data — only what the AI needs
 * - Limits to top-5 positions and last-5 operations to control token usage
 * - Rounds percentages to 2 decimal places for readability in the prompt
 * - Omits positions if portfolio is empty (caller must check before calling)
 */
export function buildInsightInput(
  portfolioData: PortfolioData,
  recentOperations: Operation[],
  currencyCode: string,
  locale: string,
): AIInsightInput {
  const { summary, positions, distribution } = portfolioData

  // ── Top positions by allocation ─────────────────────────────────────────
  const topPositions: AIInsightPositionSummary[] = positions
    .slice()
    .sort((a, b) => b.allocationPercent - a.allocationPercent)
    .slice(0, 5)
    .map(p => ({
      symbol: p.symbol,
      name: p.name,
      type: p.type,
      allocationPercent: round2(p.allocationPercent),
      profitLossPercent: round2(p.profitLossPercent),
    }))

  // ── Allocation by asset type ────────────────────────────────────────────
  const typeMap = new Map<string, number>()
  for (const item of distribution) {
    typeMap.set(item.type, (typeMap.get(item.type) ?? 0) + item.allocationPercent)
  }
  const allocationByType: AIInsightAllocationByType[] = [...typeMap.entries()]
    .map(([type, allocationPercent]) => ({
      type: type as AIInsightPositionSummary['type'],
      allocationPercent: round2(allocationPercent),
    }))
    .sort((a, b) => b.allocationPercent - a.allocationPercent)

  // ── Performers ──────────────────────────────────────────────────────────
  function toSummary(
    highlight: PortfolioData['summary']['topPerformer'],
  ): AIInsightPositionSummary | null {
    if (!highlight) return null
    const pos = positions.find(p => p.symbol === highlight.symbol)
    if (!pos) return null
    return {
      symbol: pos.symbol,
      name: pos.name,
      type: pos.type,
      allocationPercent: round2(pos.allocationPercent),
      profitLossPercent: round2(pos.profitLossPercent),
    }
  }

  // ── Recent operations (last 5 by date) ──────────────────────────────────
  const recentOps: AIInsightRecentOperation[] = recentOperations
    .slice()
    .sort((a, b) => new Date(b.operationDate).getTime() - new Date(a.operationDate).getTime())
    .slice(0, 5)
    .map(op => ({
      symbol: op.symbol,
      operationType: op.operationType,
      operationDate: op.operationDate.split('T')[0],
    }))

  return {
    portfolioSnapshot: {
      totalInvested: round2(summary.totalInvested),
      currentValue: round2(summary.currentValue),
      totalProfitLossPercent: round2(summary.totalProfitLossPercent),
      totalAssets: summary.totalAssets,
      currencyCode,
      locale,
    },
    topPositions,
    topPerformer: toSummary(summary.topPerformer),
    worstPerformer: toSummary(summary.worstPerformer),
    allocationByType,
    recentOperations: recentOps,
    generatedAt: new Date().toISOString(),
  }
}

/**
 * Returns true when the portfolio has no positions.
 * The caller uses this to show AIInsightsEmptyState instead of the generate button.
 */
export function hasInsufficientData(portfolioData: PortfolioData | undefined): boolean {
  return !portfolioData || portfolioData.positions.length === 0
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

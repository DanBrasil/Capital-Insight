import type { AssetType } from '@/modules/portfolio/types'

// ─── Input ────────────────────────────────────────────────────────────────────

/**
 * Serialized snapshot of the portfolio and recent operations.
 *
 * This is the ONLY data the AI receives. It is assembled by buildInsightInput()
 * from already-computed values — never built inside components or hooks.
 *
 * Design principle: small, flat, human-readable. No IDs, no audit fields.
 */
export interface AIInsightPositionSummary {
  symbol: string
  name: string
  type: AssetType
  allocationPercent: number
  profitLossPercent: number
}

export interface AIInsightAllocationByType {
  type: AssetType
  /** Percentage of total portfolio value allocated to this asset type */
  allocationPercent: number
}

export interface AIInsightRecentOperation {
  symbol: string
  operationType: 'buy' | 'sell'
  /** ISO date string — only the date part is sent (YYYY-MM-DD) */
  operationDate: string
}

export interface AIInsightPortfolioSnapshot {
  totalInvested: number
  currentValue: number
  totalProfitLossPercent: number
  totalAssets: number
  currencyCode: string
  locale: string
}

/**
 * The complete structured input sent to the AI provider.
 * All data here has already been validated and computed by the system.
 */
export interface AIInsightInput {
  portfolioSnapshot: AIInsightPortfolioSnapshot
  /** Top 5 positions by allocation, sorted descending */
  topPositions: AIInsightPositionSummary[]
  topPerformer: AIInsightPositionSummary | null
  worstPerformer: AIInsightPositionSummary | null
  allocationByType: AIInsightAllocationByType[]
  /** Last 5 operations, sorted by date descending */
  recentOperations: AIInsightRecentOperation[]
  generatedAt: string // ISO 8601
}

// ─── Output ───────────────────────────────────────────────────────────────────

/**
 * A single thematic section of the AI response.
 * The adapter produces these by splitting the raw text on known delimiters.
 */
export interface AIInsightSection {
  id: string
  title: string
  content: string
  /** Lower number = shown first */
  priority: number
}

/**
 * Parsed and validated AI response.
 *
 * WARNING fields contain descriptive observations only — never investment advice.
 * The system prompt and this type contract together enforce that boundary.
 */
export interface AIInsightResult {
  /** 2–3 sentence executive summary of the portfolio's current state */
  summary: string
  /** Thematic sections: concentration, performance, exposure */
  sections: AIInsightSection[]
  /** Descriptive observations worth flagging (e.g. high single-asset concentration) */
  warnings: string[]
  generatedAt: string // ISO 8601
  /** Incrementing version — allows future diff between regenerations */
  sourceVersion: number
}

// ─── Module state ─────────────────────────────────────────────────────────────

export type AIInsightStatus =
  | 'idle'
  | 'insufficient-data'
  | 'generating'
  | 'success'
  | 'error'
  | 'regenerating'

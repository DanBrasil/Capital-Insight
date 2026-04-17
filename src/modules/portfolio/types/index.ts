// ─── Asset classification ─────────────────────────────────────────────────────

export type AssetType = 'stock' | 'fii' | 'bdr' | 'etf' | 'fixed-income' | 'crypto'

// ─── Core domain entity ───────────────────────────────────────────────────────

/**
 * A consolidated position for a single asset in the portfolio.
 *
 * All derived fields (investedAmount, currentValue, profitLoss, etc.) are
 * computed once in the service layer and stored here as plain numbers.
 * Components never perform arithmetic — they only format and display.
 */
export interface Position {
  symbol: string
  name: string
  type: AssetType
  quantity: number
  /** Weighted average purchase price */
  averagePrice: number
  /** quantity × averagePrice */
  investedAmount: number
  /** Current market price per unit */
  currentPrice: number
  /** quantity × currentPrice */
  currentValue: number
  /** currentValue − investedAmount */
  profitLoss: number
  /** (profitLoss / investedAmount) × 100 */
  profitLossPercent: number
  /** (currentValue / totalPortfolioValue) × 100 */
  allocationPercent: number
}

// ─── Portfolio summary ────────────────────────────────────────────────────────

export interface PortfolioHighlight {
  symbol: string
  name: string
  profitLossPercent: number
}

export interface PortfolioAllocationHighlight {
  symbol: string
  name: string
  allocationPercent: number
}

/**
 * Aggregated view of the whole portfolio.
 * Computed once in portfolioService — components only render pre-computed values.
 */
export interface PortfolioSummary {
  totalInvested: number
  currentValue: number
  totalProfitLoss: number
  totalProfitLossPercent: number
  totalAssets: number
  topPerformer: PortfolioHighlight | null
  worstPerformer: PortfolioHighlight | null
  largestAllocation: PortfolioAllocationHighlight | null
}

// ─── Distribution ─────────────────────────────────────────────────────────────

export interface PortfolioDistributionItem {
  symbol: string
  name: string
  type: AssetType
  currentValue: number
  allocationPercent: number
}

// ─── Service response ─────────────────────────────────────────────────────────

export interface PortfolioData {
  positions: Position[]
  summary: PortfolioSummary
  distribution: PortfolioDistributionItem[]
}

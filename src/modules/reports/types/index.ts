// ─── Filter types ─────────────────────────────────────────────────────────────

export type ReportPeriod = '7d' | '30d' | '3m' | '6m' | '1y' | 'custom'

export interface ReportFilters {
  period: ReportPeriod
  /** Only populated when period === 'custom' */
  startDate?: string // YYYY-MM-DD
  endDate?: string // YYYY-MM-DD
}

export const DEFAULT_REPORT_FILTERS: ReportFilters = {
  period: '30d',
}

// ─── Analytics data types ─────────────────────────────────────────────────────

/**
 * Top-level summary metrics displayed in the summary cards.
 * All monetary values in BRL.
 */
export interface ReportSummary {
  totalInvested: number
  currentValue: number
  totalProfitLoss: number
  totalProfitLossPercent: number
  totalOperations: number
  bestPerformer: ReportTopMover | null
  worstPerformer: ReportTopMover | null
}

/**
 * A single point in the portfolio value time series.
 * Used to render the PortfolioEvolutionChart.
 */
export interface ReportTimeSeriesPoint {
  date: string // YYYY-MM-DD
  investedValue: number
  currentValue: number
}

/**
 * One slice of asset distribution (by type or by symbol).
 * Used to render the AssetTypeDistributionChart.
 */
export interface ReportDistributionItem {
  label: string
  value: number
  percentage: number
}

/**
 * Aggregated operational activity within the filtered period.
 */
export interface ReportOperationsAggregate {
  totalBuys: number
  totalSells: number
  totalBuyVolume: number
  totalSellVolume: number
  mostNegotiatedAsset: string | null
  periodStart: string // ISO date
  periodEnd: string // ISO date
}

/**
 * An asset that stands out by performance (positive or negative).
 */
export interface ReportTopMover {
  symbol: string
  name: string
  profitLoss: number
  profitLossPercent: number
  currentValue: number
}

/**
 * Composite output returned by reportService.
 * This is the single object passed down the component tree.
 */
export interface ReportData {
  summary: ReportSummary
  timeSeries: ReportTimeSeriesPoint[]
  distribution: ReportDistributionItem[]
  operationsAggregate: ReportOperationsAggregate
  topGainers: ReportTopMover[]
  topLosers: ReportTopMover[]
}

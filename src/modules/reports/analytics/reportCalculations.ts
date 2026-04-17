/**
 * Pure analytical calculation functions for the Reports module.
 *
 * Rules:
 * - No React, no side effects, no I/O, no imports from UI layers
 * - All functions are deterministic — same input → same output
 * - Components and hooks NEVER call these directly; only reportService does
 * - Safe division: never throws on zero denominators
 */

import type { Operation } from '@/modules/operations/types'
import type { PortfolioData } from '@/modules/portfolio/types'
import type {
  ReportData,
  ReportDistributionItem,
  ReportFilters,
  ReportOperationsAggregate,
  ReportSummary,
  ReportTimeSeriesPoint,
  ReportTopMover,
} from '../types'

// ─── Date helpers (no external dependency) ───────────────────────────────────

function toDateString(iso: string): string {
  return iso.slice(0, 10)
}

/**
 * Returns a YYYY-MM-DD boundary date derived from the period filter.
 * start = true → returns the start date; start = false → returns today.
 */
export function periodToDateRange(filters: ReportFilters): { start: string; end: string } {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  const end = fmt(now)

  if (filters.period === 'custom') {
    return {
      start: filters.startDate ?? end,
      end: filters.endDate ?? end,
    }
  }

  const offsetMap: Record<Exclude<ReportFilters['period'], 'custom'>, number> = {
    '7d': 7,
    '30d': 30,
    '3m': 90,
    '6m': 180,
    '1y': 365,
  }

  const offset = offsetMap[filters.period as keyof typeof offsetMap] ?? 30
  const start = new Date(now)
  start.setDate(start.getDate() - offset)
  return { start: fmt(start), end }
}

/** Filters an operations array to only those that fall within [start, end]. */
function filterOperationsByRange(operations: Operation[], start: string, end: string): Operation[] {
  return operations.filter(op => {
    const d = toDateString(op.operationDate)
    return d >= start && d <= end
  })
}

// ─── Summary ─────────────────────────────────────────────────────────────────

export function computeReportSummary(
  portfolio: PortfolioData,
  periodOperations: Operation[],
): ReportSummary {
  const { summary, positions } = portfolio

  const topMovers = positions.map<ReportTopMover>(p => ({
    symbol: p.symbol,
    name: p.name,
    profitLoss: p.profitLoss,
    profitLossPercent: p.profitLossPercent,
    currentValue: p.currentValue,
  }))

  const sorted = [...topMovers].sort((a, b) => b.profitLossPercent - a.profitLossPercent)

  return {
    totalInvested: summary.totalInvested,
    currentValue: summary.currentValue,
    totalProfitLoss: summary.totalProfitLoss,
    totalProfitLossPercent: summary.totalProfitLossPercent,
    totalOperations: periodOperations.length,
    bestPerformer: sorted[0] ?? null,
    worstPerformer: sorted[sorted.length - 1] ?? null,
  }
}

// ─── Time series ─────────────────────────────────────────────────────────────

/**
 * Builds a synthetic daily time series for the portfolio value over the period.
 *
 * Strategy (DEV / no price history):
 *   For each date in the range, we sum all buy operations up to that date
 *   to get the cumulative invested value. We approximate currentValue by
 *   scaling the invested value with the current portfolio P&L ratio.
 *
 * In production, the backend would return an actual price-history series.
 */
export function buildTimeSeries(
  allOperations: Operation[],
  portfolio: PortfolioData,
  filters: ReportFilters,
): ReportTimeSeriesPoint[] {
  const { start, end } = periodToDateRange(filters)

  // All buy operations ordered chronologically (all time, not just period)
  const buys = [...allOperations]
    .filter(op => op.operationType === 'buy')
    .sort((a, b) => toDateString(a.operationDate).localeCompare(toDateString(b.operationDate)))

  // Ratio to scale invested → current (portfolio-wide multiplier)
  const scaleRatio =
    portfolio.summary.totalInvested > 0
      ? portfolio.summary.currentValue / portfolio.summary.totalInvested
      : 1

  // Generate one point per day in the period
  const points: ReportTimeSeriesPoint[] = []
  const cursor = new Date(start + 'T00:00:00')
  const endDate = new Date(end + 'T00:00:00')

  while (cursor <= endDate) {
    const dateStr = cursor.toISOString().slice(0, 10)

    const cumulativeInvested = buys
      .filter(op => toDateString(op.operationDate) <= dateStr)
      .reduce((sum, op) => sum + op.totalAmount, 0)

    points.push({
      date: dateStr,
      investedValue: cumulativeInvested,
      currentValue: cumulativeInvested * scaleRatio,
    })

    cursor.setDate(cursor.getDate() + 1)
  }

  return points
}

// ─── Distribution ─────────────────────────────────────────────────────────────

export function buildDistribution(portfolio: PortfolioData): ReportDistributionItem[] {
  // PortfolioDistributionItem is per-symbol; aggregate by asset type
  const grouped = new Map<string, number>()
  for (const d of portfolio.distribution) {
    grouped.set(d.type, (grouped.get(d.type) ?? 0) + d.currentValue)
  }

  const total = Array.from(grouped.values()).reduce((sum, v) => sum + v, 0)

  return Array.from(grouped.entries()).map(([type, value]) => ({
    label: type,
    value,
    percentage: total > 0 ? (value / total) * 100 : 0,
  }))
}

// ─── Operations aggregate ─────────────────────────────────────────────────────

export function buildOperationsAggregate(
  periodOperations: Operation[],
  filters: ReportFilters,
): ReportOperationsAggregate {
  const { start, end } = periodToDateRange(filters)

  const buys = periodOperations.filter(op => op.operationType === 'buy')
  const sells = periodOperations.filter(op => op.operationType === 'sell')

  // Count operations per symbol
  const symbolCount = new Map<string, number>()
  for (const op of periodOperations) {
    symbolCount.set(op.symbol, (symbolCount.get(op.symbol) ?? 0) + 1)
  }

  let mostNegotiatedAsset: string | null = null
  let maxCount = 0
  symbolCount.forEach((count, symbol) => {
    if (count > maxCount) {
      maxCount = count
      mostNegotiatedAsset = symbol
    }
  })

  return {
    totalBuys: buys.length,
    totalSells: sells.length,
    totalBuyVolume: buys.reduce((sum, op) => sum + op.totalAmount, 0),
    totalSellVolume: sells.reduce((sum, op) => sum + op.totalAmount, 0),
    mostNegotiatedAsset,
    periodStart: start,
    periodEnd: end,
  }
}

// ─── Top movers ───────────────────────────────────────────────────────────────

export function buildTopMovers(portfolio: PortfolioData): {
  topGainers: ReportTopMover[]
  topLosers: ReportTopMover[]
} {
  const movers = portfolio.positions.map<ReportTopMover>(p => ({
    symbol: p.symbol,
    name: p.name,
    profitLoss: p.profitLoss,
    profitLossPercent: p.profitLossPercent,
    currentValue: p.currentValue,
  }))

  const sorted = [...movers].sort((a, b) => b.profitLossPercent - a.profitLossPercent)

  return {
    topGainers: sorted.filter(m => m.profitLossPercent > 0).slice(0, 3),
    topLosers: sorted
      .filter(m => m.profitLossPercent < 0)
      .reverse()
      .slice(0, 3),
  }
}

// ─── Composite builder ────────────────────────────────────────────────────────

/**
 * Single entry point called by reportService.
 * Combines all analytical functions into a ReportData object.
 */
export function buildReportData(
  portfolio: PortfolioData,
  allOperations: Operation[],
  filters: ReportFilters,
): ReportData {
  const { start, end } = periodToDateRange(filters)
  const periodOperations = filterOperationsByRange(allOperations, start, end)

  const { topGainers, topLosers } = buildTopMovers(portfolio)

  return {
    summary: computeReportSummary(portfolio, periodOperations),
    timeSeries: buildTimeSeries(allOperations, portfolio, filters),
    distribution: buildDistribution(portfolio),
    operationsAggregate: buildOperationsAggregate(periodOperations, filters),
    topGainers,
    topLosers,
  }
}

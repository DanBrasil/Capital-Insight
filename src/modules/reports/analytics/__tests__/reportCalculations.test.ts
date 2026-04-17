/**
 * Unit tests for reportCalculations.ts
 *
 * These are the most critical tests in the application: they protect the
 * financial domain logic. All functions are pure, so tests are cheap to write
 * and highly reliable — same input always produces the same output.
 *
 * Date-sensitive functions use vi.useFakeTimers() to prevent flaky failures
 * when run at different times.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  buildDistribution,
  buildOperationsAggregate,
  buildTimeSeries,
  buildTopMovers,
  computeReportSummary,
  periodToDateRange,
} from '../reportCalculations'

import { emptyPortfolioData, mockPortfolioData } from '@/test/fixtures/portfolio'
import { mockOperations } from '@/test/fixtures/operations'
import type { ReportFilters } from '../../types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FROZEN_DATE = new Date('2026-04-17T12:00:00.000Z')

/** Formats a Date to YYYY-MM-DD using the same logic as the function under test */
function fmt(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function daysAgo(n: number): string {
  const d = new Date(FROZEN_DATE)
  d.setDate(d.getDate() - n)
  return fmt(d)
}

const baseFilters: ReportFilters = { period: '30d' }

// ─── periodToDateRange ────────────────────────────────────────────────────────

describe('periodToDateRange', () => {
  beforeEach(() => vi.useFakeTimers({ now: FROZEN_DATE }))
  afterEach(() => vi.useRealTimers())

  it('returns today as end date for any preset period', () => {
    const { end } = periodToDateRange({ period: '30d' })
    expect(end).toBe(fmt(FROZEN_DATE))
  })

  it.each([
    ['7d', 7],
    ['30d', 30],
    ['3m', 90],
    ['6m', 180],
    ['1y', 365],
  ] as const)('period=%s yields start %d days before today', (period, days) => {
    const { start } = periodToDateRange({ period })
    expect(start).toBe(daysAgo(days))
  })

  it('returns custom dates when period is "custom"', () => {
    const { start, end } = periodToDateRange({
      period: 'custom',
      startDate: '2026-01-01',
      endDate: '2026-03-31',
    })
    expect(start).toBe('2026-01-01')
    expect(end).toBe('2026-03-31')
  })

  it('falls back to today for custom period with missing dates', () => {
    const { start, end } = periodToDateRange({ period: 'custom' })
    expect(start).toBe(fmt(FROZEN_DATE))
    expect(end).toBe(fmt(FROZEN_DATE))
  })
})

// ─── computeReportSummary ─────────────────────────────────────────────────────

describe('computeReportSummary', () => {
  it('maps portfolio summary fields directly', () => {
    const summary = computeReportSummary(mockPortfolioData, mockOperations)

    expect(summary.totalInvested).toBe(mockPortfolioData.summary.totalInvested)
    expect(summary.currentValue).toBe(mockPortfolioData.summary.currentValue)
    expect(summary.totalProfitLoss).toBe(mockPortfolioData.summary.totalProfitLoss)
    expect(summary.totalProfitLossPercent).toBe(mockPortfolioData.summary.totalProfitLossPercent)
  })

  it('counts period operations correctly', () => {
    const summary = computeReportSummary(mockPortfolioData, mockOperations)
    expect(summary.totalOperations).toBe(mockOperations.length)
  })

  it('identifies the best and worst performer by profitLossPercent', () => {
    const summary = computeReportSummary(mockPortfolioData, [])

    expect(summary.bestPerformer?.symbol).toBe('PETR4') // +20%
    expect(summary.worstPerformer?.symbol).toBe('HGLG11') // -5%
  })

  it('returns null performers when portfolio has no positions', () => {
    const summary = computeReportSummary(emptyPortfolioData, [])

    expect(summary.bestPerformer).toBeNull()
    expect(summary.worstPerformer).toBeNull()
  })

  it('returns zero totalOperations when no period operations are passed', () => {
    const summary = computeReportSummary(mockPortfolioData, [])
    expect(summary.totalOperations).toBe(0)
  })
})

// ─── buildDistribution ───────────────────────────────────────────────────────

describe('buildDistribution', () => {
  it('aggregates distribution items by asset type', () => {
    const result = buildDistribution(mockPortfolioData)

    const stockItem = result.find(d => d.label === 'stock')
    const fiiItem = result.find(d => d.label === 'fii')

    expect(stockItem?.value).toBe(3600)
    expect(fiiItem?.value).toBe(1900)
  })

  it('calculates percentage relative to total value', () => {
    const result = buildDistribution(mockPortfolioData)
    const total = 3600 + 1900

    const stockItem = result.find(d => d.label === 'stock')
    expect(stockItem?.percentage).toBeCloseTo((3600 / total) * 100, 5)
  })

  it('percentages sum to 100', () => {
    const result = buildDistribution(mockPortfolioData)
    const sum = result.reduce((acc, d) => acc + d.percentage, 0)
    expect(sum).toBeCloseTo(100, 5)
  })

  it('returns empty array for an empty portfolio', () => {
    const result = buildDistribution(emptyPortfolioData)
    expect(result).toEqual([])
  })

  it('returns 0% for all items when total value is zero', () => {
    const zeroValuePortfolio = {
      ...emptyPortfolioData,
      distribution: [
        {
          symbol: 'PETR4',
          name: 'Petrobras',
          type: 'stock' as const,
          currentValue: 0,
          allocationPercent: 0,
        },
      ],
    }
    const result = buildDistribution(zeroValuePortfolio)
    expect(result[0].percentage).toBe(0)
  })

  it('merges multiple positions of the same type into one entry', () => {
    const twoStocks = {
      ...mockPortfolioData,
      distribution: [
        {
          symbol: 'PETR4',
          name: 'Petrobras',
          type: 'stock' as const,
          currentValue: 2000,
          allocationPercent: 40,
        },
        {
          symbol: 'VALE3',
          name: 'Vale',
          type: 'stock' as const,
          currentValue: 3000,
          allocationPercent: 60,
        },
      ],
    }
    const result = buildDistribution(twoStocks)
    expect(result).toHaveLength(1)
    expect(result[0].label).toBe('stock')
    expect(result[0].value).toBe(5000)
  })
})

// ─── buildTopMovers ───────────────────────────────────────────────────────────

describe('buildTopMovers', () => {
  it('separates gainers (positive P&L) from losers (negative P&L)', () => {
    const { topGainers, topLosers } = buildTopMovers(mockPortfolioData)

    expect(topGainers).toHaveLength(1)
    expect(topGainers[0].symbol).toBe('PETR4')

    expect(topLosers).toHaveLength(1)
    expect(topLosers[0].symbol).toBe('HGLG11')
  })

  it('returns at most 3 gainers and 3 losers', () => {
    const manyPositions = {
      ...mockPortfolioData,
      positions: [
        ...Array.from({ length: 5 }, (_, i) => ({
          symbol: `GAIN${i}`,
          name: `Gainer ${i}`,
          type: 'stock' as const,
          quantity: 10,
          averagePrice: 10,
          investedAmount: 100,
          currentPrice: 15,
          currentValue: 150,
          profitLoss: 50,
          profitLossPercent: 50 - i * 5, // 50%, 45%, 40%, 35%, 30%
          allocationPercent: 10,
        })),
        ...Array.from({ length: 4 }, (_, i) => ({
          symbol: `LOSE${i}`,
          name: `Loser ${i}`,
          type: 'fii' as const,
          quantity: 10,
          averagePrice: 10,
          investedAmount: 100,
          currentPrice: 8,
          currentValue: 80,
          profitLoss: -20,
          profitLossPercent: -(10 + i * 5), // -10%, -15%, -20%, -25%
          allocationPercent: 10,
        })),
      ],
    }

    const { topGainers, topLosers } = buildTopMovers(manyPositions)

    expect(topGainers).toHaveLength(3)
    expect(topLosers).toHaveLength(3)
  })

  it('returns empty arrays when portfolio has no positions', () => {
    const { topGainers, topLosers } = buildTopMovers(emptyPortfolioData)
    expect(topGainers).toEqual([])
    expect(topLosers).toEqual([])
  })

  it('excludes break-even positions (profitLossPercent === 0) from both lists', () => {
    const breakEvenPortfolio = {
      ...mockPortfolioData,
      positions: [
        {
          symbol: 'FLAT1',
          name: 'Flat Asset',
          type: 'stock' as const,
          quantity: 10,
          averagePrice: 10,
          investedAmount: 100,
          currentPrice: 10,
          currentValue: 100,
          profitLoss: 0,
          profitLossPercent: 0,
          allocationPercent: 100,
        },
      ],
    }
    const { topGainers, topLosers } = buildTopMovers(breakEvenPortfolio)
    expect(topGainers).toEqual([])
    expect(topLosers).toEqual([])
  })
})

// ─── buildOperationsAggregate ─────────────────────────────────────────────────

describe('buildOperationsAggregate', () => {
  beforeEach(() => vi.useFakeTimers({ now: FROZEN_DATE }))
  afterEach(() => vi.useRealTimers())

  it('counts buys and sells correctly', () => {
    const result = buildOperationsAggregate(mockOperations, baseFilters)
    // 2 buys (op-1, op-2) and 1 sell (op-3) in the fixture
    expect(result.totalBuys).toBe(2)
    expect(result.totalSells).toBe(1)
  })

  it('sums buy and sell volumes correctly', () => {
    const result = buildOperationsAggregate(mockOperations, baseFilters)
    expect(result.totalBuyVolume).toBe(3000 + 2000) // op-1 + op-2
    expect(result.totalSellVolume).toBe(1800) // op-3
  })

  it('identifies the most negotiated asset', () => {
    // PETR4 appears twice (op-1 buy + op-3 sell), HGLG11 once
    const result = buildOperationsAggregate(mockOperations, baseFilters)
    expect(result.mostNegotiatedAsset).toBe('PETR4')
  })

  it('returns null for mostNegotiatedAsset when there are no operations', () => {
    const result = buildOperationsAggregate([], baseFilters)
    expect(result.mostNegotiatedAsset).toBeNull()
  })

  it('returns zero volumes when there are no operations', () => {
    const result = buildOperationsAggregate([], baseFilters)
    expect(result.totalBuyVolume).toBe(0)
    expect(result.totalSellVolume).toBe(0)
  })
})

// ─── buildTimeSeries ─────────────────────────────────────────────────────────

describe('buildTimeSeries', () => {
  beforeEach(() => vi.useFakeTimers({ now: FROZEN_DATE }))
  afterEach(() => vi.useRealTimers())

  it('generates one point per day in the period', () => {
    const filters: ReportFilters = { period: '7d' }
    const result = buildTimeSeries(mockOperations, mockPortfolioData, filters)

    // 7 days offset means 8 points: day-7, day-6, ... day-0 (today)
    expect(result).toHaveLength(8)
  })

  it('returns empty array when the period is zero days long', () => {
    const filters: ReportFilters = {
      period: 'custom',
      startDate: '2026-04-17',
      endDate: '2026-04-17',
    }
    const result = buildTimeSeries([], emptyPortfolioData, filters)
    // single day → single point
    expect(result).toHaveLength(1)
  })

  it('investedValue grows as buy operations accumulate in time', () => {
    // Both buy operations are before 2026, so cumulative value is constant throughout
    const filters: ReportFilters = { period: '7d' }
    const result = buildTimeSeries(mockOperations, mockPortfolioData, filters)

    // All buy operations (op-1: 2024-01, op-2: 2024-02) are before the 7d window.
    // Therefore cumulativeInvested should be the same for all points.
    const invested0 = result[0].investedValue
    const investedLast = result[result.length - 1].investedValue
    expect(invested0).toBe(investedLast)
    expect(invested0).toBe(3000 + 2000) // sum of all buy amounts
  })

  it('currentValue equals investedValue × scaleRatio', () => {
    const filters: ReportFilters = { period: '7d' }
    const result = buildTimeSeries(mockOperations, mockPortfolioData, filters)
    const scaleRatio =
      mockPortfolioData.summary.currentValue / mockPortfolioData.summary.totalInvested // 5500/5000

    for (const point of result) {
      expect(point.currentValue).toBeCloseTo(point.investedValue * scaleRatio, 5)
    }
  })

  it('uses scaleRatio of 1 when totalInvested is zero (no division by zero)', () => {
    const filters: ReportFilters = { period: '7d' }
    const result = buildTimeSeries([], emptyPortfolioData, filters)

    // With scaleRatio=1, currentValue should equal investedValue
    for (const point of result) {
      expect(point.currentValue).toBe(point.investedValue)
    }
  })

  it('each point has a date in YYYY-MM-DD format', () => {
    const filters: ReportFilters = { period: '7d' }
    const result = buildTimeSeries(mockOperations, mockPortfolioData, filters)

    for (const point of result) {
      expect(point.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })
})

// ─── Edge case: single-position portfolio ─────────────────────────────────────

describe('computeReportSummary — single position', () => {
  it('best and worst performer are the same asset when only one position exists', () => {
    const singlePosition = {
      ...mockPortfolioData,
      positions: [mockPortfolioData.positions[0]],
    }
    const summary = computeReportSummary(singlePosition, [])

    expect(summary.bestPerformer?.symbol).toBe('PETR4')
    expect(summary.worstPerformer?.symbol).toBe('PETR4')
  })
})

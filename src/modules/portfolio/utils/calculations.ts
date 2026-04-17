/**
 * Pure financial calculation functions for the portfolio module.
 *
 * Rules:
 * - No React, no side effects, no I/O
 * - All functions are deterministic — same input always produces same output
 * - Safe division: never throws on zero denominators
 * - Easy to unit test in isolation
 *
 * Components must NEVER perform arithmetic.
 * These functions are called exclusively in the service layer.
 */

import type { Position, PortfolioData, PortfolioDistributionItem, PortfolioSummary } from '../types'

// ─── Primitive calculations ───────────────────────────────────────────────────

export function computeInvestedAmount(quantity: number, averagePrice: number): number {
  return quantity * averagePrice
}

export function computeCurrentValue(quantity: number, currentPrice: number): number {
  return quantity * currentPrice
}

export function computeProfitLoss(investedAmount: number, currentValue: number): number {
  return currentValue - investedAmount
}

/** Returns 0 when investedAmount is 0 to prevent division by zero. */
export function computeProfitLossPercent(profitLoss: number, investedAmount: number): number {
  if (investedAmount === 0) return 0
  return (profitLoss / investedAmount) * 100
}

/** Returns 0 when totalValue is 0 to prevent division by zero. */
export function computeAllocationPercent(currentValue: number, totalCurrentValue: number): number {
  if (totalCurrentValue === 0) return 0
  return (currentValue / totalCurrentValue) * 100
}

// ─── Portfolio aggregation ────────────────────────────────────────────────────

/**
 * Computes a fully enriched Position from raw seed data plus a current price.
 *
 * The allocation percent requires the total portfolio value, so it is set to 0
 * here and recalculated after all positions are built (two-pass approach).
 */
export function buildPosition(seed: {
  symbol: string
  name: string
  type: Position['type']
  quantity: number
  averagePrice: number
  currentPrice: number
}): Omit<Position, 'allocationPercent'> {
  const investedAmount = computeInvestedAmount(seed.quantity, seed.averagePrice)
  const currentValue = computeCurrentValue(seed.quantity, seed.currentPrice)
  const profitLoss = computeProfitLoss(investedAmount, currentValue)
  const profitLossPercent = computeProfitLossPercent(profitLoss, investedAmount)

  return {
    symbol: seed.symbol,
    name: seed.name,
    type: seed.type,
    quantity: seed.quantity,
    averagePrice: seed.averagePrice,
    currentPrice: seed.currentPrice,
    investedAmount,
    currentValue,
    profitLoss,
    profitLossPercent,
  }
}

/**
 * Final pass: assigns allocationPercent to each position based on total value.
 * Must be called after all positions are built.
 */
export function assignAllocations(positions: Omit<Position, 'allocationPercent'>[]): Position[] {
  const totalCurrentValue = positions.reduce((sum, p) => sum + p.currentValue, 0)
  return positions.map(p => ({
    ...p,
    allocationPercent: computeAllocationPercent(p.currentValue, totalCurrentValue),
  }))
}

// ─── Summary computation ──────────────────────────────────────────────────────

export function computePortfolioSummary(positions: Position[]): PortfolioSummary {
  if (positions.length === 0) {
    return {
      totalInvested: 0,
      currentValue: 0,
      totalProfitLoss: 0,
      totalProfitLossPercent: 0,
      totalAssets: 0,
      topPerformer: null,
      worstPerformer: null,
      largestAllocation: null,
    }
  }

  const totalInvested = positions.reduce((sum, p) => sum + p.investedAmount, 0)
  const currentValue = positions.reduce((sum, p) => sum + p.currentValue, 0)
  const totalProfitLoss = computeProfitLoss(totalInvested, currentValue)
  const totalProfitLossPercent = computeProfitLossPercent(totalProfitLoss, totalInvested)

  const sorted = [...positions].sort((a, b) => b.profitLossPercent - a.profitLossPercent)
  const top = sorted[0]
  const worst = sorted[sorted.length - 1]
  const largest = [...positions].sort((a, b) => b.allocationPercent - a.allocationPercent)[0]

  return {
    totalInvested,
    currentValue,
    totalProfitLoss,
    totalProfitLossPercent,
    totalAssets: positions.length,
    topPerformer: { symbol: top.symbol, name: top.name, profitLossPercent: top.profitLossPercent },
    worstPerformer: {
      symbol: worst.symbol,
      name: worst.name,
      profitLossPercent: worst.profitLossPercent,
    },
    largestAllocation: {
      symbol: largest.symbol,
      name: largest.name,
      allocationPercent: largest.allocationPercent,
    },
  }
}

// ─── Distribution ─────────────────────────────────────────────────────────────

export function computeDistribution(positions: Position[]): PortfolioDistributionItem[] {
  return [...positions]
    .sort((a, b) => b.allocationPercent - a.allocationPercent)
    .map(p => ({
      symbol: p.symbol,
      name: p.name,
      type: p.type,
      currentValue: p.currentValue,
      allocationPercent: p.allocationPercent,
    }))
}

// ─── Full portfolio computation ───────────────────────────────────────────────

/**
 * Builds a complete PortfolioData from raw position seeds + current prices.
 *
 * This is the entry point used by portfolioService in DEV mock and
 * will be used to transform API responses in production.
 */
export function computePortfolioData(seeds: Parameters<typeof buildPosition>[0][]): PortfolioData {
  const partial = seeds.map(buildPosition)
  const positions = assignAllocations(partial)
  const summary = computePortfolioSummary(positions)
  const distribution = computeDistribution(positions)
  return { positions, summary, distribution }
}

/**
 * Portfolio fixtures for tests.
 *
 * One stock position (PETR4, in profit) and one FII (HGLG11, at a loss).
 * Covers the most common test scenario: mixed portfolio with both gains and losses.
 */
import type { PortfolioData } from '@/modules/portfolio/types'

export const mockPortfolioData: PortfolioData = {
  positions: [
    {
      symbol: 'PETR4',
      name: 'Petrobras',
      type: 'stock',
      quantity: 100,
      averagePrice: 30,
      investedAmount: 3000,
      currentPrice: 36,
      currentValue: 3600,
      profitLoss: 600,
      profitLossPercent: 20,
      allocationPercent: 65.45,
    },
    {
      symbol: 'HGLG11',
      name: 'CSHG Logística',
      type: 'fii',
      quantity: 20,
      averagePrice: 100,
      investedAmount: 2000,
      currentPrice: 95,
      currentValue: 1900,
      profitLoss: -100,
      profitLossPercent: -5,
      allocationPercent: 34.55,
    },
  ],
  summary: {
    totalInvested: 5000,
    currentValue: 5500,
    totalProfitLoss: 500,
    totalProfitLossPercent: 10,
    totalAssets: 2,
    topPerformer: { symbol: 'PETR4', name: 'Petrobras', profitLossPercent: 20 },
    worstPerformer: { symbol: 'HGLG11', name: 'CSHG Logística', profitLossPercent: -5 },
    largestAllocation: { symbol: 'PETR4', name: 'Petrobras', allocationPercent: 65.45 },
  },
  distribution: [
    {
      symbol: 'PETR4',
      name: 'Petrobras',
      type: 'stock',
      currentValue: 3600,
      allocationPercent: 65.45,
    },
    {
      symbol: 'HGLG11',
      name: 'CSHG Logística',
      type: 'fii',
      currentValue: 1900,
      allocationPercent: 34.55,
    },
  ],
}

/** Portfolio with no positions — for empty state tests */
export const emptyPortfolioData: PortfolioData = {
  positions: [],
  summary: {
    totalInvested: 0,
    currentValue: 0,
    totalProfitLoss: 0,
    totalProfitLossPercent: 0,
    totalAssets: 0,
    topPerformer: null,
    worstPerformer: null,
    largestAllocation: null,
  },
  distribution: [],
}

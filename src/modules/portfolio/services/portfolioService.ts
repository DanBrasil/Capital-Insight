import { apiClient } from '@/services/api/client'
import { ENDPOINTS } from '@/services/api/constants'

import type { PortfolioData } from '../types'
import { computePortfolioData } from '../utils/calculations'

// ─── Dev mock seed data ───────────────────────────────────────────────────────
// Simulates positions as if they had been built from registered operations.
// Seeds reflect a realistic Brazilian equity + FII portfolio.

const MOCK_SEEDS: Parameters<typeof computePortfolioData>[0] = [
  {
    symbol: 'PETR4',
    name: 'Petrobras PN',
    type: 'stock',
    quantity: 200,
    averagePrice: 32.5,
    currentPrice: 38.2,
  },
  {
    symbol: 'VALE3',
    name: 'Vale ON',
    type: 'stock',
    quantity: 150,
    averagePrice: 68.0,
    currentPrice: 62.4,
  },
  {
    symbol: 'ITUB4',
    name: 'Itaú Unibanco PN',
    type: 'stock',
    quantity: 300,
    averagePrice: 26.8,
    currentPrice: 31.5,
  },
  {
    symbol: 'WEGE3',
    name: 'WEG ON',
    type: 'stock',
    quantity: 100,
    averagePrice: 42.0,
    currentPrice: 55.9,
  },
  {
    symbol: 'HGLG11',
    name: 'CSHG Logística',
    type: 'fii',
    quantity: 50,
    averagePrice: 158.0,
    currentPrice: 163.5,
  },
]

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Portfolio API service — pure async functions, no React dependencies.
 *
 * In development: returns mock data computed entirely in the client,
 * so the module works without a backend.
 *
 * In production: fetches consolidated positions from the API.
 * The API is expected to return raw position data; enrichment with
 * current prices happens either server-side or in a subsequent call.
 */
export const portfolioService = {
  async getPortfolio(): Promise<PortfolioData> {
    if (import.meta.env.DEV) {
      return computePortfolioData(MOCK_SEEDS)
    }

    const response = await apiClient.get<PortfolioData>(ENDPOINTS.portfolio.positions)
    return response.data
  },
}

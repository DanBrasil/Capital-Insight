import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/services/api/constants'

import { portfolioService } from '../services/portfolioService'

/**
 * Fetches the consolidated portfolio data: positions, summary, and distribution.
 *
 * staleTime 2min — portfolio data changes only when new operations are registered.
 * A manual refresh button in PortfolioHeader can call refetch() directly.
 */
export function usePortfolio() {
  return useQuery({
    queryKey: QUERY_KEYS.portfolio(),
    queryFn: portfolioService.getPortfolio,
    staleTime: 2 * 60 * 1000,
  })
}

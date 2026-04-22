import { useQuery, useQueryClient } from '@tanstack/react-query'

import { operationService } from '@/modules/operations/services/operationService'
import { portfolioService } from '@/modules/portfolio/services/portfolioService'
import { QUERY_KEYS } from '@/services/api/constants'
import { STALE_TIMES } from '@/domain'

import { reportService } from '../services/reportService'
import type { ReportFilters } from '../types'

/**
 * Fetches the full ReportData composite for the given filters.
 *
 * KEY IMPROVEMENT: Instead of calling portfolioService/operationService directly
 * (which bypassed React Query cache), this hook uses `ensureQueryData` to
 * reuse existing cached data. If the user already visited Portfolio or Operations,
 * those requests are NOT repeated.
 *
 * In production, tries the dedicated /reports API first; in DEV (or on API failure),
 * composes from cached portfolio + operations data.
 */
export function useReportData(filters: ReportFilters) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: QUERY_KEYS.reportData(filters),
    queryFn: async () => {
      // In production, try the dedicated reports endpoint first
      if (!import.meta.env.DEV) {
        try {
          return await reportService.getReportDataFromAPI(filters)
        } catch {
          // Fall through to composed data
        }
      }

      // Reuse React Query cache — no duplicate requests
      const [portfolio, allOperations] = await Promise.all([
        queryClient.ensureQueryData({
          queryKey: QUERY_KEYS.portfolio(),
          queryFn: portfolioService.getPortfolio,
          staleTime: STALE_TIMES.derived,
        }),
        queryClient.ensureQueryData({
          queryKey: QUERY_KEYS.operations(),
          queryFn: operationService.listAll,
          staleTime: STALE_TIMES.realtime,
        }),
      ])

      return reportService.buildReportData(portfolio, allOperations, filters)
    },
    staleTime: STALE_TIMES.analytical,
    retry: 1,
  })
}

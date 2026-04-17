import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/services/api/constants'

import { reportService } from '../services/reportService'
import type { ReportFilters } from '../types'

/**
 * Fetches the full ReportData composite for the given filters.
 *
 * staleTime: 5 minutes — report data does not need real-time updates.
 * Each filter combination has its own cache entry via QUERY_KEYS.reportData(filters).
 */
export function useReportData(filters: ReportFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.reportData(filters),
    queryFn: () => reportService.getReportData(filters),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

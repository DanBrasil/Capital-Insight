import { ENDPOINTS } from '@/services/api/constants'
import { apiClient } from '@/services/api/client'

import { buildReportData } from '../analytics/reportCalculations'
import type { ReportData, ReportFilters } from '../types'

/**
 * Reports service — fetches report data from the backend or composes it
 * from cached portfolio + operations data.
 *
 * IMPORTANT: This service no longer calls portfolioService/operationService
 * directly. The `useReportData` hook uses `queryClient.ensureQueryData` to
 * reuse React Query cache, preventing duplicate network requests when the
 * user navigates between Portfolio → Reports pages.
 */
export const reportService = {
  /**
   * Production-only: calls the dedicated /reports endpoint.
   * In DEV or as fallback, `useReportData` composes from cached data.
   */
  async getReportDataFromAPI(filters: ReportFilters): Promise<ReportData> {
    const response = await apiClient.get<ReportData>(ENDPOINTS.reports.summary, {
      params: {
        period: filters.period,
        startDate: filters.startDate,
        endDate: filters.endDate,
      },
    })
    return response.data
  },

  /** Pure computation — no I/O. Used by the hook to compose cached data. */
  buildReportData,
}

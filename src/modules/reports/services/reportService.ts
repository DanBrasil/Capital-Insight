import { operationService } from '@/modules/operations/services/operationService'
import { portfolioService } from '@/modules/portfolio/services/portfolioService'
import { ENDPOINTS } from '@/services/api/constants'
import { apiClient } from '@/services/api/client'

import { buildReportData } from '../analytics/reportCalculations'
import type { ReportData, ReportFilters } from '../types'

/**
 * Reports service — orchestrates portfolio and operations data sources
 * into a single ReportData composite.
 *
 * In development:
 *   - Reuses existing portfolioService and operationService mocks
 *   - No additional mock data needed
 *
 * In production:
 *   - May call a dedicated /reports endpoint if the backend pre-computes analytics,
 *     otherwise composes the same two sources as in DEV
 */
export const reportService = {
  async getReportData(filters: ReportFilters): Promise<ReportData> {
    if (import.meta.env.DEV) {
      const [portfolio, allOperations] = await Promise.all([
        portfolioService.getPortfolio(),
        operationService.listAll(),
      ])

      return buildReportData(portfolio, allOperations, filters)
    }

    // Production: if the backend provides a pre-computed summary, use it.
    // Otherwise, fall back to the same composition used in DEV.
    try {
      const response = await apiClient.get<ReportData>(ENDPOINTS.reports.summary, {
        params: {
          period: filters.period,
          startDate: filters.startDate,
          endDate: filters.endDate,
        },
      })
      return response.data
    } catch {
      // Graceful degradation: compose from individual sources
      const [portfolio, allOperations] = await Promise.all([
        portfolioService.getPortfolio(),
        operationService.listAll(),
      ])
      return buildReportData(portfolio, allOperations, filters)
    }
  },
}

import { useState } from 'react'

import type { ReportFilters } from '../types'
import { DEFAULT_REPORT_FILTERS } from '../types'

/**
 * Manages the global filter state for the Reports page.
 *
 * Kept as local state (not URL params) in the MVP.
 * Evolution: replace useState with useSearchParams for bookmarkable URLs.
 */
export function useReportFilters() {
  const [filters, setFilters] = useState<ReportFilters>(DEFAULT_REPORT_FILTERS)

  function setPeriod(period: ReportFilters['period']) {
    setFilters(prev => ({
      ...prev,
      period,
      // Clear custom dates when switching to a preset
      startDate: period === 'custom' ? prev.startDate : undefined,
      endDate: period === 'custom' ? prev.endDate : undefined,
    }))
  }

  function setCustomRange(startDate: string, endDate: string) {
    setFilters({ period: 'custom', startDate, endDate })
  }

  function resetFilters() {
    setFilters(DEFAULT_REPORT_FILTERS)
  }

  return { filters, setPeriod, setCustomRange, resetFilters } as const
}

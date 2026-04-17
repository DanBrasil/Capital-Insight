import { useQuery } from '@tanstack/react-query'

import { dashboardService } from '../services/dashboardService'
import type { DashboardPeriod } from '../types'

export function useDashboardSummary(period: DashboardPeriod) {
  return useQuery({
    queryKey: ['dashboard', 'summary', period],
    queryFn: () => dashboardService.getSummary(period),
    staleTime: 1000 * 60 * 2, // 2 minutes — summary data is moderately fresh
  })
}

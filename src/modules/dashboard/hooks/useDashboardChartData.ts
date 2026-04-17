import { useQuery } from '@tanstack/react-query'

import { dashboardService } from '../services/dashboardService'
import type { DashboardPeriod } from '../types'

export function useDashboardChartData(period: DashboardPeriod) {
  return useQuery({
    queryKey: ['dashboard', 'chart', period],
    queryFn: () => dashboardService.getChartData(period),
    staleTime: 1000 * 60 * 5, // 5 minutes — chart data changes less frequently
  })
}

import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/services/api/constants'
import { STALE_TIMES } from '@/domain'

import { dashboardService } from '../services/dashboardService'
import type { DashboardPeriod } from '../types'

export function useDashboardChartData(period: DashboardPeriod) {
  return useQuery({
    queryKey: QUERY_KEYS.dashboardChart(period),
    queryFn: () => dashboardService.getChartData(period),
    staleTime: STALE_TIMES.analytical,
  })
}

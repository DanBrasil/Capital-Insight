import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/services/api/constants'
import { STALE_TIMES } from '@/domain'

import { dashboardService } from '../services/dashboardService'
import type { DashboardPeriod } from '../types'

export function useRecentTransactions(period: DashboardPeriod) {
  return useQuery({
    queryKey: QUERY_KEYS.dashboardRecentTransactions(period),
    queryFn: () => dashboardService.getRecentTransactions(period),
    staleTime: STALE_TIMES.realtime,
  })
}

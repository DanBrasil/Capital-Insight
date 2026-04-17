import { useQuery } from '@tanstack/react-query'

import { dashboardService } from '../services/dashboardService'
import type { DashboardPeriod } from '../types'

export function useRecentTransactions(period: DashboardPeriod) {
  return useQuery({
    queryKey: ['dashboard', 'transactions', period],
    queryFn: () => dashboardService.getRecentTransactions(period),
    staleTime: 1000 * 60 * 1, // 1 minute — transactions are the most live data
  })
}

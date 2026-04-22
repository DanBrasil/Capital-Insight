import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/services/api/constants'
import { STALE_TIMES } from '@/domain'

import { transactionService } from '../services/transactionService'
import type { TransactionFilters } from '../types'

export function useTransactions(filters: TransactionFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.transactionsList(filters),
    queryFn: () => transactionService.list(filters),
    staleTime: STALE_TIMES.realtime,
  })
}

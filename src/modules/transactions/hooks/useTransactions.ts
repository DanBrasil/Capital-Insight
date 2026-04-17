import { useQuery } from '@tanstack/react-query'

import { transactionService } from '../services/transactionService'
import type { TransactionFilters } from '../types'

export const TRANSACTIONS_QUERY_KEY = 'transactions'

export function useTransactions(filters: TransactionFilters) {
  return useQuery({
    queryKey: [TRANSACTIONS_QUERY_KEY, filters],
    queryFn: () => transactionService.list(filters),
    staleTime: 1000 * 60, // 1 minute
  })
}

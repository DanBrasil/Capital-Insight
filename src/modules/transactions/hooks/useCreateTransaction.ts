import { useMutation, useQueryClient } from '@tanstack/react-query'

import { transactionService } from '../services/transactionService'
import { TRANSACTIONS_QUERY_KEY } from './useTransactions'
import type { CreateTransactionPayload } from '../types'

export function useCreateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateTransactionPayload) => transactionService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_QUERY_KEY] })
    },
  })
}

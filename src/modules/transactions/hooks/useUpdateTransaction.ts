import { useMutation, useQueryClient } from '@tanstack/react-query'

import { transactionService } from '../services/transactionService'
import { TRANSACTIONS_QUERY_KEY } from './useTransactions'
import type { UpdateTransactionPayload } from '../types'

export function useUpdateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateTransactionPayload) => transactionService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_QUERY_KEY] })
    },
  })
}

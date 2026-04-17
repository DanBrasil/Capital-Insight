import { useMutation, useQueryClient } from '@tanstack/react-query'

import { transactionService } from '../services/transactionService'
import { TRANSACTIONS_QUERY_KEY } from './useTransactions'

export function useDeleteTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => transactionService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_QUERY_KEY] })
    },
  })
}

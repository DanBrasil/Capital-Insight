import { useMutation, useQueryClient } from '@tanstack/react-query'

import { invalidate } from '@/services/api/invalidationRules'

import { transactionService } from '../services/transactionService'

export function useDeleteTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => transactionService.remove(id),
    onSuccess: () => {
      invalidate.transactions(queryClient)
    },
  })
}

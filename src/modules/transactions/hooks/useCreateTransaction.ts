import { useMutation, useQueryClient } from '@tanstack/react-query'

import { invalidate } from '@/services/api/invalidationRules'

import { transactionService } from '../services/transactionService'
import type { CreateTransactionPayload } from '../types'

export function useCreateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateTransactionPayload) => transactionService.create(payload),
    onSuccess: () => {
      invalidate.transactions(queryClient)
    },
  })
}

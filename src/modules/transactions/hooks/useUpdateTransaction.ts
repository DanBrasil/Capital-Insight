import { useMutation, useQueryClient } from '@tanstack/react-query'

import { invalidate } from '@/services/api/invalidationRules'

import { transactionService } from '../services/transactionService'
import type { UpdateTransactionPayload } from '../types'

export function useUpdateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateTransactionPayload) => transactionService.update(payload),
    onSuccess: () => {
      invalidate.transactions(queryClient)
    },
  })
}

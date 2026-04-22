import { useMutation, useQueryClient } from '@tanstack/react-query'

import { invalidate } from '@/services/api/invalidationRules'

import { operationService } from '../services/operationService'
import type { CreateOperationPayload } from '../types'

export function useCreateOperation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateOperationPayload) => operationService.create(payload),
    onSuccess: () => {
      invalidate.operations(queryClient)
    },
  })
}

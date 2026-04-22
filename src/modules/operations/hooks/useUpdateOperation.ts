import { useMutation, useQueryClient } from '@tanstack/react-query'

import { invalidate } from '@/services/api/invalidationRules'

import { operationService } from '../services/operationService'
import type { UpdateOperationPayload } from '../types'

export function useUpdateOperation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateOperationPayload) => operationService.update(payload),
    onSuccess: () => {
      invalidate.operations(queryClient)
    },
  })
}

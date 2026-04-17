import { useMutation, useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/services/api/constants'

import { operationService } from '../services/operationService'
import type { CreateOperationPayload } from '../types'

export function useCreateOperation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateOperationPayload) => operationService.create(payload),
    onSuccess: () => {
      // Invalidate both operations list and portfolio (portfolio derives from operations)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.operations() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.portfolio() })
    },
  })
}

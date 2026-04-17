import { useMutation, useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/services/api/constants'

import { operationService } from '../services/operationService'
import type { UpdateOperationPayload } from '../types'

export function useUpdateOperation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateOperationPayload) => operationService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.operations() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.portfolio() })
    },
  })
}

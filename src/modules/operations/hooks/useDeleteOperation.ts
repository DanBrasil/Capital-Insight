import { useMutation, useQueryClient } from '@tanstack/react-query'

import { invalidate } from '@/services/api/invalidationRules'

import { operationService } from '../services/operationService'

export function useDeleteOperation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => operationService.remove(id),
    onSuccess: () => {
      invalidate.operations(queryClient)
    },
  })
}

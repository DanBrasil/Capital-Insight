import { useMutation, useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/services/api/constants'

import { operationService } from '../services/operationService'

export function useDeleteOperation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => operationService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.operations() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.portfolio() })
    },
  })
}

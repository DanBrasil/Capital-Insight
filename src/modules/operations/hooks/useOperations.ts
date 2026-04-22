import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/services/api/constants'
import { STALE_TIMES } from '@/domain'

import { operationService } from '../services/operationService'
import type { OperationFilters } from '../types'

export function useOperations(filters: OperationFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.operationsList(filters),
    queryFn: () => operationService.list(filters),
    staleTime: STALE_TIMES.realtime,
  })
}

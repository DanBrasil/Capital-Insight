import { useState } from 'react'

import { DEFAULT_OPERATION_FILTERS } from '../types'
import type { OperationFilters } from '../types'

interface UseOperationFiltersReturn {
  filters: OperationFilters
  setFilter: <K extends keyof OperationFilters>(key: K, value: OperationFilters[K]) => void
  resetFilters: () => void
  hasActiveFilters: boolean
}

/**
 * Owns the filter state for the operations page.
 * Isolated so OperationsView stays clean and migration to useSearchParams
 * requires changing only this hook.
 */
export function useOperationFilters(): UseOperationFiltersReturn {
  const [filters, setFilters] = useState<OperationFilters>(DEFAULT_OPERATION_FILTERS)

  function setFilter<K extends keyof OperationFilters>(key: K, value: OperationFilters[K]) {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  function resetFilters() {
    setFilters(DEFAULT_OPERATION_FILTERS)
  }

  const hasActiveFilters =
    filters.search !== '' ||
    filters.operationType !== 'all' ||
    filters.assetType !== 'all' ||
    filters.startDate !== '' ||
    filters.endDate !== ''

  return { filters, setFilter, resetFilters, hasActiveFilters }
}

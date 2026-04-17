import { useState } from 'react'

import { DEFAULT_FILTERS } from '../types'
import type { TransactionFilters } from '../types'

interface UseTransactionFiltersReturn {
  filters: TransactionFilters
  setFilter: <K extends keyof TransactionFilters>(key: K, value: TransactionFilters[K]) => void
  resetFilters: () => void
  hasActiveFilters: boolean
}

/**
 * Owns the filter state for the transactions page.
 *
 * Isolated here so:
 * - TransactionsView stays clean
 * - All filter logic is in one place
 * - Can be migrated to useSearchParams with minimal changes
 */
export function useTransactionFilters(): UseTransactionFiltersReturn {
  const [filters, setFilters] = useState<TransactionFilters>(DEFAULT_FILTERS)

  function setFilter<K extends keyof TransactionFilters>(key: K, value: TransactionFilters[K]) {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS)
  }

  const hasActiveFilters =
    filters.search !== '' ||
    filters.type !== 'all' ||
    filters.category !== '' ||
    filters.dateFrom !== '' ||
    filters.dateTo !== ''

  return { filters, setFilter, resetFilters, hasActiveFilters }
}

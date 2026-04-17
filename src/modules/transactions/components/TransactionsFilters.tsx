import { Button } from '@/components/ui'
import { Input, Select } from '@/components/form'

import { getCategoryOptions } from '../utils/categories'
import type { TransactionFilters } from '../types'

const TYPE_OPTIONS = [
  { value: 'all', label: 'Todos os tipos' },
  { value: 'income', label: 'Receitas' },
  { value: 'expense', label: 'Despesas' },
]

const ORDER_OPTIONS = [
  { value: 'date', label: 'Data' },
  { value: 'amount', label: 'Valor' },
  { value: 'title', label: 'Título' },
]

const ORDER_DIR_OPTIONS = [
  { value: 'desc', label: 'Mais recentes primeiro' },
  { value: 'asc', label: 'Mais antigos primeiro' },
]

interface TransactionsFiltersProps {
  filters: TransactionFilters
  hasActiveFilters: boolean
  onFilterChange: <K extends keyof TransactionFilters>(key: K, value: TransactionFilters[K]) => void
  onReset: () => void
}

/**
 * Pure UI panel — emits changes upward via callbacks.
 * Has no knowledge of React Query or the transaction list.
 */
export function TransactionsFilters({
  filters,
  hasActiveFilters,
  onFilterChange,
  onReset,
}: TransactionsFiltersProps) {
  const categoryOptions = [{ value: '', label: 'Todas as categorias' }, ...getCategoryOptions()]

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Input
          id="tx-search"
          placeholder="Buscar por título ou categoria..."
          value={filters.search}
          onChange={e => onFilterChange('search', e.target.value)}
          type="search"
        />

        <Select
          id="tx-type"
          options={TYPE_OPTIONS}
          value={filters.type}
          onChange={e => onFilterChange('type', e.target.value as TransactionFilters['type'])}
        />

        <Select
          id="tx-category"
          options={categoryOptions}
          value={filters.category}
          onChange={e => onFilterChange('category', e.target.value)}
        />

        <div className="flex gap-2">
          <Select
            id="tx-order"
            options={ORDER_OPTIONS}
            value={filters.orderBy}
            onChange={e =>
              onFilterChange('orderBy', e.target.value as TransactionFilters['orderBy'])
            }
            className="flex-1"
          />
          <Select
            id="tx-dir"
            options={ORDER_DIR_OPTIONS}
            value={filters.orderDir}
            onChange={e =>
              onFilterChange('orderDir', e.target.value as TransactionFilters['orderDir'])
            }
            className="flex-1"
          />
        </div>
      </div>

      {/* Date range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
        <Input
          id="tx-date-from"
          type="date"
          label="De"
          value={filters.dateFrom}
          onChange={e => onFilterChange('dateFrom', e.target.value)}
        />
        <Input
          id="tx-date-to"
          type="date"
          label="Até"
          value={filters.dateTo}
          onChange={e => onFilterChange('dateTo', e.target.value)}
        />
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          Limpar filtros
        </Button>
      )}
    </div>
  )
}

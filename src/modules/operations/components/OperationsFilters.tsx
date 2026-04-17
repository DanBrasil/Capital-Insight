import { Input, Select } from '@/components/form'

import type { OperationFilters } from '../types'
import { formatAssetType, formatOperationType } from '../utils/formatters'

const OPERATION_TYPE_OPTIONS = [
  { value: 'all', label: 'Todos os tipos' },
  { value: 'buy', label: formatOperationType('buy') },
  { value: 'sell', label: formatOperationType('sell') },
]

const ASSET_TYPE_OPTIONS = [
  { value: 'all', label: 'Todos os ativos' },
  { value: 'stock', label: formatAssetType('stock') },
  { value: 'fii', label: formatAssetType('fii') },
  { value: 'bdr', label: formatAssetType('bdr') },
  { value: 'etf', label: formatAssetType('etf') },
  { value: 'fixed-income', label: formatAssetType('fixed-income') },
  { value: 'crypto', label: formatAssetType('crypto') },
]

const ORDER_OPTIONS = [
  { value: 'date', label: 'Data' },
  { value: 'totalAmount', label: 'Valor total' },
  { value: 'symbol', label: 'Ativo' },
]

const ORDER_DIR_OPTIONS = [
  { value: 'desc', label: 'Mais recentes primeiro' },
  { value: 'asc', label: 'Mais antigos primeiro' },
]

interface OperationsFiltersProps {
  filters: OperationFilters
  hasActiveFilters: boolean
  onFilterChange: <K extends keyof OperationFilters>(key: K, value: OperationFilters[K]) => void
  onReset: () => void
}

/**
 * Pure filter panel — all state lives in OperationsView via useOperationFilters.
 * Emits changes upward; has no knowledge of the operations list.
 */
export function OperationsFilters({
  filters,
  hasActiveFilters,
  onFilterChange,
  onReset,
}: OperationsFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Input
          id="op-search"
          placeholder="Buscar por ativo..."
          value={filters.search}
          onChange={e => onFilterChange('search', e.target.value)}
          type="search"
        />

        <Select
          id="op-type"
          options={OPERATION_TYPE_OPTIONS}
          value={filters.operationType}
          onChange={e =>
            onFilterChange('operationType', e.target.value as OperationFilters['operationType'])
          }
        />

        <Select
          id="op-asset-type"
          options={ASSET_TYPE_OPTIONS}
          value={filters.assetType}
          onChange={e =>
            onFilterChange('assetType', e.target.value as OperationFilters['assetType'])
          }
        />

        <div className="flex gap-2">
          <Select
            id="op-order"
            options={ORDER_OPTIONS}
            value={filters.orderBy}
            onChange={e => onFilterChange('orderBy', e.target.value as OperationFilters['orderBy'])}
          />
          <Select
            id="op-order-dir"
            options={ORDER_DIR_OPTIONS}
            value={filters.orderDirection}
            onChange={e =>
              onFilterChange('orderDirection', e.target.value as OperationFilters['orderDirection'])
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:max-w-sm">
        <Input
          id="op-start-date"
          type="date"
          label="De"
          value={filters.startDate}
          onChange={e => onFilterChange('startDate', e.target.value)}
        />
        <Input
          id="op-end-date"
          type="date"
          label="Até"
          value={filters.endDate}
          onChange={e => onFilterChange('endDate', e.target.value)}
        />
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onReset}
          className="text-sm text-muted-foreground underline-offset-2 hover:underline"
        >
          Limpar filtros
        </button>
      )}
    </div>
  )
}

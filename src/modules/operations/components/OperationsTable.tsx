import { useOperations } from '../hooks/useOperations'
import type { Operation, OperationFilters } from '../types'
import { EmptyState, ErrorState } from '@/components/ui'
import { OperationsEmptyState } from './OperationsEmptyState'
import { OperationsSkeleton } from './OperationsSkeleton'
import { OperationsTableRow } from './OperationsTableRow'

const SKELETON_ROWS = 6

interface OperationsTableProps {
  filters: OperationFilters
  hasActiveFilters: boolean
  locale: string
  currencyCode: string
  onEdit: (operation: Operation) => void
  onDelete: (operation: Operation) => void
  onClearFilters: () => void
  onAddNew: () => void
}

/**
 * Owns data fetching (useOperations) so OperationsView doesn't hold query state.
 * Handles all internal states: loading, error, empty, data.
 */
export function OperationsTable({
  filters,
  hasActiveFilters,
  locale,
  currencyCode,
  onEdit,
  onDelete,
  onClearFilters,
  onAddNew,
}: OperationsTableProps) {
  const { data, isLoading, isError, refetch } = useOperations(filters)

  if (isLoading) {
    return <OperationsSkeleton rows={SKELETON_ROWS} />
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-error/30 bg-error/5">
        <ErrorState title="Erro ao carregar operações" onRetry={() => void refetch()} size="sm" />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return hasActiveFilters ? (
      <div className="rounded-lg border border-border bg-card">
        <EmptyState
          variant="filter"
          title="Nenhuma operação encontrada"
          description="Tente ajustar os filtros ou limpe a busca."
          size="sm"
          action={{ label: 'Limpar filtros', onClick: onClearFilters }}
        />
      </div>
    ) : (
      <OperationsEmptyState onNew={onAddNew} />
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left">
          <thead className="bg-muted/40 border-b border-border">
            <tr>
              <th className="hidden sm:table-cell px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Data
              </th>
              <th className="px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Ativo
              </th>
              <th className="px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Tipo
              </th>
              <th className="hidden md:table-cell px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Classe
              </th>
              <th className="hidden sm:table-cell px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Qtd.
              </th>
              <th className="hidden lg:table-cell px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Preço Unit.
              </th>
              <th className="hidden lg:table-cell px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Taxas
              </th>
              <th className="px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Total
              </th>
              <th className="px-4 py-2.5 w-20">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map(operation => (
              <OperationsTableRow
                key={operation.id}
                operation={operation}
                locale={locale}
                currencyCode={currencyCode}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

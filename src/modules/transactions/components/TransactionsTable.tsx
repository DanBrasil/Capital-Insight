import { Button } from '@/components/ui'

import { TransactionRow } from './TransactionRow'
import { TransactionsSkeleton } from './TransactionsSkeleton'
import { useTransactions } from '../hooks/useTransactions'
import type { Transaction, TransactionFilters } from '../types'

const SKELETON_ROWS = 8

interface TransactionsTableProps {
  filters: TransactionFilters
  hasActiveFilters: boolean
  locale: string
  currencyCode: string
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
  onClearFilters: () => void
  onAddNew: () => void
}

export function TransactionsTable({
  filters,
  hasActiveFilters,
  locale,
  currencyCode,
  onEdit,
  onDelete,
  onClearFilters,
  onAddNew,
}: TransactionsTableProps) {
  const { data, isLoading, isError, refetch } = useTransactions(filters)

  return (
    <div className="rounded-lg border border-border overflow-hidden bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden sm:table-cell w-28">
                Data
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Título
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden md:table-cell">
                Categoria
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden sm:table-cell">
                Tipo
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground text-right">
                Valor
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden lg:table-cell">
                Status
              </th>
              <th className="px-4 py-3 w-28">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {/* Loading skeleton */}
            {isLoading && <TransactionsSkeleton rows={SKELETON_ROWS} />}

            {/* Error state */}
            {isError && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <p className="text-sm text-error mb-3">Erro ao carregar transações.</p>
                  <Button variant="ghost" size="sm" onClick={() => refetch()}>
                    Tentar novamente
                  </Button>
                </td>
              </tr>
            )}

            {/* Empty — no filters active */}
            {!isLoading && !isError && data?.length === 0 && !hasActiveFilters && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <p className="text-sm font-medium text-foreground mb-1">
                    Nenhuma transação registrada
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Adicione sua primeira transação para começar.
                  </p>
                  <Button variant="primary" size="sm" onClick={onAddNew}>
                    Nova transação
                  </Button>
                </td>
              </tr>
            )}

            {/* Empty — with active filters */}
            {!isLoading && !isError && data?.length === 0 && hasActiveFilters && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <p className="text-sm font-medium text-foreground mb-1">
                    Nenhum resultado encontrado
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Tente ajustar os filtros ou limpe a busca.
                  </p>
                  <Button variant="ghost" size="sm" onClick={onClearFilters}>
                    Limpar filtros
                  </Button>
                </td>
              </tr>
            )}

            {/* Data rows */}
            {!isLoading &&
              !isError &&
              data?.map(transaction => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  locale={locale}
                  currencyCode={currencyCode}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
          </tbody>
        </table>
      </div>

      {/* Row count footer */}
      {!isLoading && !isError && data && data.length > 0 && (
        <div className="border-t border-border px-4 py-2">
          <p className="text-xs text-muted-foreground">
            {data.length} {data.length === 1 ? 'transação' : 'transações'} encontrada
            {data.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  )
}

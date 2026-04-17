import { Badge } from '@/components/ui'

import { formatCurrency, formatDate, getLabelForStatus, getLabelForType } from '../utils/formatters'
import type { Transaction } from '../types'

const statusVariant: Record<Transaction['status'], 'success' | 'warning' | 'error' | 'secondary'> =
  {
    completed: 'success',
    pending: 'warning',
    cancelled: 'error',
  }

interface TransactionRowProps {
  transaction: Transaction
  locale: string
  currencyCode: string
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
}

/**
 * Pure presentational row.
 * Has no knowledge of React Query, routing, or tenant.
 */
export function TransactionRow({
  transaction,
  locale,
  currencyCode,
  onEdit,
  onDelete,
}: TransactionRowProps) {
  const isIncome = transaction.type === 'income'

  return (
    <tr className="border-b border-border hover:bg-muted/40 transition-colors">
      {/* Date */}
      <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap hidden sm:table-cell">
        {formatDate(transaction.date, locale)}
      </td>

      {/* Title + mobile date */}
      <td className="px-4 py-3">
        <p className="text-sm font-medium text-foreground">{transaction.title}</p>
        {transaction.description && (
          <p className="text-xs text-muted-foreground truncate max-w-xs">
            {transaction.description}
          </p>
        )}
        {/* Date shown only on mobile */}
        <p className="text-xs text-muted-foreground sm:hidden mt-0.5">
          {formatDate(transaction.date, locale)}
        </p>
      </td>

      {/* Category */}
      <td className="px-4 py-3 hidden md:table-cell">
        <span className="text-sm text-muted-foreground">{transaction.category}</span>
      </td>

      {/* Type */}
      <td className="px-4 py-3 hidden sm:table-cell">
        <Badge variant={isIncome ? 'success' : 'error'}>{getLabelForType(transaction.type)}</Badge>
      </td>

      {/* Amount */}
      <td className="px-4 py-3 text-right whitespace-nowrap">
        <span
          className={`text-sm font-semibold tabular-nums ${
            isIncome ? 'text-success' : 'text-error'
          }`}
        >
          {isIncome ? '+' : '−'}
          {formatCurrency(transaction.amount, locale, currencyCode)}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-3 hidden lg:table-cell">
        <Badge variant={statusVariant[transaction.status]}>
          {getLabelForStatus(transaction.status)}
        </Badge>
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onEdit(transaction)}
            className="rounded px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => onDelete(transaction.id)}
            className="rounded px-2 py-1 text-xs font-medium text-error/70 hover:text-error hover:bg-error/10 transition-colors"
          >
            Excluir
          </button>
        </div>
      </td>
    </tr>
  )
}

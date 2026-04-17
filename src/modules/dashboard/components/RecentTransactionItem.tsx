import { Badge } from '@/components/ui'

import { formatCurrency, formatShortDate } from '../utils/formatters'
import type { RecentTransaction } from '../types'

interface RecentTransactionItemProps {
  transaction: RecentTransaction
  locale: string
  currencyCode: string
}

/** Pure presentational row for a single transaction */
export function RecentTransactionItem({
  transaction,
  locale,
  currencyCode,
}: RecentTransactionItemProps) {
  const isIncome = transaction.type === 'income'
  const formattedAmount = formatCurrency(transaction.amount, locale, currencyCode)
  const formattedDate = formatShortDate(transaction.date, locale)

  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
      {/* Direction indicator */}
      <span
        className={[
          'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold',
          isIncome ? 'bg-success/10 text-success' : 'bg-error/10 text-error',
        ].join(' ')}
        aria-hidden="true"
      >
        {isIncome ? '+' : '−'}
      </span>

      {/* Description + category */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{transaction.description}</p>
        <Badge variant="secondary" size="sm">
          {transaction.category}
        </Badge>
      </div>

      {/* Amount + date — right-aligned */}
      <div className="text-right flex-shrink-0">
        <p
          className={`text-sm font-semibold tabular-nums ${
            isIncome ? 'text-success' : 'text-error'
          }`}
        >
          {isIncome ? '+' : '−'}
          {formattedAmount}
        </p>
        <p className="text-xs text-muted-foreground">{formattedDate}</p>
      </div>
    </div>
  )
}

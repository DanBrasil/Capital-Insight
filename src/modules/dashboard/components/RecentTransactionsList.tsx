import { Link } from 'react-router-dom'

import { Card, ErrorState } from '@/components/ui'
import { ROUTES } from '@/router/routes'

import { EmptyState } from './EmptyState'
import { RecentTransactionItem } from './RecentTransactionItem'
import { useRecentTransactions } from '../hooks/useRecentTransactions'
import type { DashboardPeriod } from '../types'

const MAX_ITEMS = 7

interface RecentTransactionsListProps {
  period: DashboardPeriod
  locale: string
  currencyCode: string
}

export function RecentTransactionsList({
  period,
  locale,
  currencyCode,
}: RecentTransactionsListProps) {
  const { data, isLoading, isError } = useRecentTransactions(period)

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Últimas transações</h2>
          <Link to={ROUTES.transactions} className="text-xs text-primary hover:underline">
            Ver todas
          </Link>
        </div>
      </Card.Header>

      <Card.Body>
        {/* Loading skeleton */}
        {isLoading && (
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-muted flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-32 rounded bg-muted" />
                  <div className="h-3 w-16 rounded bg-muted" />
                </div>
                <div className="text-right space-y-1.5">
                  <div className="h-3 w-20 rounded bg-muted" />
                  <div className="h-3 w-12 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && <ErrorState title="Erro ao carregar transações" size="sm" />}

        {data && data.length === 0 && (
          <EmptyState
            title="Nenhuma transação no período"
            description="Adicione sua primeira transação para começar."
          />
        )}

        {data && data.length > 0 && (
          <div>
            {data.slice(0, MAX_ITEMS).map(transaction => (
              <RecentTransactionItem
                key={transaction.id}
                transaction={transaction}
                locale={locale}
                currencyCode={currencyCode}
              />
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

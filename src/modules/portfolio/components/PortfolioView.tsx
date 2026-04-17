import { useTenant } from '@/tenants'

import type { AppError } from '@/services/api/errors'
import { ErrorState } from '@/components/ui'

import { usePortfolio } from '../hooks/usePortfolio'
import { PortfolioDistribution } from './PortfolioDistribution'
import { PortfolioEmptyState } from './PortfolioEmptyState'
import { PortfolioHeader } from './PortfolioHeader'
import { PortfolioHighlights } from './PortfolioHighlights'
import { PortfolioPositionTable } from './PortfolioPositionTable'
import { PortfolioSkeleton } from './PortfolioSkeleton'
import { PortfolioSummaryCards } from './PortfolioSummaryCards'

/**
 * Portfolio module orchestrator.
 *
 * Responsibilities:
 * - Owns the data-fetching hook
 * - Distributes data to pure child components
 * - Manages all render states (loading, error, empty, data)
 * - Reads locale/currencyCode from tenant for formatting
 *
 * Does NOT: perform calculations, format values, know about routing.
 */
export function PortfolioView() {
  const { tenant } = useTenant()
  const { locale, currencyCode } = tenant.appConfig

  const { data, isLoading, isError, error, isFetching, refetch } = usePortfolio()

  if (isLoading) {
    return <PortfolioSkeleton />
  }

  if (isError) {
    const appError = error as unknown as AppError
    return (
      <div className="space-y-4">
        <PortfolioHeader />
        <div className="rounded-lg border border-error/30 bg-error/5">
          <ErrorState
            title="Erro ao carregar carteira"
            description={appError?.message ?? 'Tente novamente em instantes.'}
            onRetry={() => void refetch()}
          />
        </div>
      </div>
    )
  }

  if (!data || data.positions.length === 0) {
    return (
      <div className="space-y-6">
        <PortfolioHeader />
        <PortfolioEmptyState />
      </div>
    )
  }

  const { positions, summary, distribution } = data

  return (
    <div className="space-y-6">
      <PortfolioHeader onRefresh={refetch} isRefreshing={isFetching} />

      <PortfolioSummaryCards summary={summary} locale={locale} currencyCode={currencyCode} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PortfolioPositionTable
            positions={positions}
            locale={locale}
            currencyCode={currencyCode}
          />
        </div>

        <div className="space-y-4">
          <PortfolioHighlights summary={summary} />
          <PortfolioDistribution
            distribution={distribution}
            locale={locale}
            currencyCode={currencyCode}
          />
        </div>
      </div>
    </div>
  )
}

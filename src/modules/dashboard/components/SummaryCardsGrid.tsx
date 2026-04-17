import { SummaryCard } from './SummaryCard'
import { SummaryCardSkeleton } from './SummaryCardSkeleton'
import { useDashboardSummary } from '../hooks/useDashboardSummary'
import { formatCurrency, formatVariation } from '../utils/formatters'
import type { DashboardPeriod } from '../types'

// ─── Inline icons (no external dependency) ───────────────────────────────────

function BalanceIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm.75 9.5V11a.75.75 0 0 1-1.5 0v-.5H6a.75.75 0 0 1 0-1.5h2.25a.25.25 0 0 0 0-.5H7A1.75 1.75 0 1 1 7 5h.25v-.5a.75.75 0 0 1 1.5 0V5H10a.75.75 0 0 1 0 1.5H7.75a.25.25 0 0 0 0 .5H9a1.75 1.75 0 0 1 0 3.5Z" />
    </svg>
  )
}

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M6 1 11 7H8v4H4V7H1Z" />
    </svg>
  )
}

function ArrowDownIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M6 11 1 5h3V1h4v4h3Z" />
    </svg>
  )
}

function HashIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M3 4h1.5L3 10H1.5L3 4Zm4 0h1.5L7 10H5.5L7 4Zm-4 4h9v1.5H3V8Zm0-3h9v1.5H3V5Z" />
    </svg>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

interface SummaryCardsGridProps {
  period: DashboardPeriod
  locale: string
  currencyCode: string
}

/**
 * Reads the dashboard summary for the current period and renders 4 SummaryCards.
 * Handles its own loading and error states independently of other sections.
 */
export function SummaryCardsGrid({ period, locale, currencyCode }: SummaryCardsGridProps) {
  const { data, isLoading, isError } = useDashboardSummary(period)

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SummaryCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="rounded-lg border border-error/30 bg-error/5 px-4 py-3">
        <p className="text-sm text-error">Erro ao carregar métricas. Tente recarregar a página.</p>
      </div>
    )
  }

  const currency = (value: number) => formatCurrency(value, locale, currencyCode)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <SummaryCard
        label={data.balance.label}
        formattedValue={currency(data.balance.value)}
        variation={formatVariation(data.balance.value, data.balance.previousValue)}
        icon={<BalanceIcon />}
      />
      <SummaryCard
        label={data.income.label}
        formattedValue={currency(data.income.value)}
        variation={formatVariation(data.income.value, data.income.previousValue)}
        icon={<ArrowUpIcon />}
      />
      <SummaryCard
        label={data.expenses.label}
        formattedValue={currency(data.expenses.value)}
        variation={formatVariation(data.expenses.value, data.expenses.previousValue)}
        icon={<ArrowDownIcon />}
        inverseVariation
      />
      <SummaryCard
        label={data.transactionCount.label}
        formattedValue={String(data.transactionCount.value)}
        variation={formatVariation(
          data.transactionCount.value,
          data.transactionCount.previousValue,
        )}
        icon={<HashIcon />}
      />
    </div>
  )
}

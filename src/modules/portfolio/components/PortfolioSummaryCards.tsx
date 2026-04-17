import type { PortfolioSummary } from '../types'
import { formatCurrency, formatProfitLossPercent } from '../utils/formatters'
import { PortfolioSummaryCard } from './PortfolioSummaryCard'

interface PortfolioSummaryCardsProps {
  summary: PortfolioSummary
  locale: string
  currencyCode: string
}

/**
 * Renders the 4 main portfolio metrics as a responsive card grid.
 * Pure component — receives pre-computed summary, formats values, renders cards.
 */
export function PortfolioSummaryCards({
  summary,
  locale,
  currencyCode,
}: PortfolioSummaryCardsProps) {
  const fmt = (v: number) => formatCurrency(v, locale, currencyCode)
  const plSentiment = summary.totalProfitLoss >= 0 ? 'positive' : 'negative'

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <PortfolioSummaryCard
        label="Total Investido"
        formattedValue={fmt(summary.totalInvested)}
        sentiment="neutral"
      />
      <PortfolioSummaryCard
        label="Valor Atual"
        formattedValue={fmt(summary.currentValue)}
        sentiment="neutral"
      />
      <PortfolioSummaryCard
        label="Lucro / Prejuízo"
        formattedValue={fmt(summary.totalProfitLoss)}
        sentiment={plSentiment}
        secondary={formatProfitLossPercent(summary.totalProfitLossPercent)}
      />
      <PortfolioSummaryCard
        label="Ativos em Carteira"
        formattedValue={String(summary.totalAssets)}
        sentiment="neutral"
      />
    </div>
  )
}

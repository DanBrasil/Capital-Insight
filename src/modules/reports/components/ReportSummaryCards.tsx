import type { ReportSummary } from '../types'
import { ReportSummaryCard } from './ReportSummaryCard'

const currencyFmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const percentFmt = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function fmtCurrency(value: number): string {
  return currencyFmt.format(value)
}

function fmtPercent(value: number): string {
  return percentFmt.format(value / 100)
}

interface ReportSummaryCardsProps {
  summary: ReportSummary
}

export function ReportSummaryCards({ summary }: ReportSummaryCardsProps) {
  const plSentiment =
    summary.totalProfitLoss > 0 ? 'positive' : summary.totalProfitLoss < 0 ? 'negative' : 'neutral'

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <ReportSummaryCard
        label="Valor Atual"
        value={fmtCurrency(summary.currentValue)}
        subValue={`Investido: ${fmtCurrency(summary.totalInvested)}`}
        sentiment="neutral"
      />
      <ReportSummaryCard
        label="Lucro / Prejuízo"
        value={fmtCurrency(summary.totalProfitLoss)}
        subValue={fmtPercent(summary.totalProfitLossPercent)}
        sentiment={plSentiment}
      />
      <ReportSummaryCard
        label="Operações no período"
        value={String(summary.totalOperations)}
        sentiment="neutral"
      />
      <ReportSummaryCard
        label="Melhor ativo"
        value={summary.bestPerformer?.symbol ?? '—'}
        subValue={
          summary.bestPerformer
            ? `${fmtPercent(summary.bestPerformer.profitLossPercent)}`
            : undefined
        }
        sentiment={summary.bestPerformer ? 'positive' : 'neutral'}
      />
    </div>
  )
}

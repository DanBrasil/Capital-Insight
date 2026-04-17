import type { PortfolioSummary } from '../types'
import { formatAllocationPercent, formatProfitLossPercent } from '../utils/formatters'

interface PortfolioHighlightsProps {
  summary: PortfolioSummary
}

/**
 * Shows the three quick-glance highlights:
 * - Top performer (best return %)
 * - Worst performer (lowest return %)
 * - Largest position by allocation weight
 */
export function PortfolioHighlights({ summary }: PortfolioHighlightsProps) {
  const { topPerformer, worstPerformer, largestAllocation } = summary

  if (!topPerformer && !worstPerformer && !largestAllocation) return null

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="px-5 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Destaques</h2>
      </div>
      <div className="divide-y divide-border">
        {topPerformer && (
          <HighlightRow
            label="Melhor desempenho"
            symbol={topPerformer.symbol}
            name={topPerformer.name}
            badge={formatProfitLossPercent(topPerformer.profitLossPercent)}
            badgeColor="text-success"
          />
        )}
        {worstPerformer && worstPerformer.symbol !== topPerformer?.symbol && (
          <HighlightRow
            label="Pior desempenho"
            symbol={worstPerformer.symbol}
            name={worstPerformer.name}
            badge={formatProfitLossPercent(worstPerformer.profitLossPercent)}
            badgeColor="text-error"
          />
        )}
        {largestAllocation && (
          <HighlightRow
            label="Maior peso"
            symbol={largestAllocation.symbol}
            name={largestAllocation.name}
            badge={formatAllocationPercent(largestAllocation.allocationPercent)}
            badgeColor="text-muted-foreground"
          />
        )}
      </div>
    </div>
  )
}

// ─── Internal subcomponent ────────────────────────────────────────────────────

interface HighlightRowProps {
  label: string
  symbol: string
  name: string
  badge: string
  badgeColor: string
}

function HighlightRow({ label, symbol, name, badge, badgeColor }: HighlightRowProps) {
  return (
    <div className="flex items-center justify-between px-5 py-3">
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">
          {symbol}
          <span className="ml-1 font-normal text-muted-foreground text-xs">· {name}</span>
        </p>
      </div>
      <span className={['text-sm font-bold tabular-nums', badgeColor].join(' ')}>{badge}</span>
    </div>
  )
}

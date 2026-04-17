import type { PortfolioDistributionItem } from '../types'
import { formatAllocationPercent, formatCurrency } from '../utils/formatters'

interface PortfolioDistributionProps {
  distribution: PortfolioDistributionItem[]
  locale: string
  currencyCode: string
}

/**
 * Visualises portfolio allocation as horizontal percentage bars.
 *
 * Uses pure CSS (no chart library) for the MVP.
 * When a DonutChart is added to the Design System, only this component's
 * internals need to change — props stay the same.
 *
 * Items arrive pre-sorted by allocation (largest first) from the service.
 */
export function PortfolioDistribution({
  distribution,
  locale,
  currencyCode,
}: PortfolioDistributionProps) {
  if (distribution.length === 0) return null

  const fmt = (v: number) => formatCurrency(v, locale, currencyCode)

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="px-5 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Distribuição</h2>
      </div>

      <ul className="divide-y divide-border">
        {distribution.map(item => (
          <li key={item.symbol} className="px-5 py-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">{item.symbol}</span>
              <span className="text-sm font-bold tabular-nums text-foreground">
                {formatAllocationPercent(item.allocationPercent)}
              </span>
            </div>

            {/* Allocation bar */}
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${item.allocationPercent}%` }}
              />
            </div>

            <p className="text-xs text-muted-foreground tabular-nums">{fmt(item.currentValue)}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

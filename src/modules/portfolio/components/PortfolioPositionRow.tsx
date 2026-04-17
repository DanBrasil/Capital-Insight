import type { Position } from '../types'
import {
  formatAllocationPercent,
  formatAssetType,
  formatCurrency,
  formatPrice,
  formatProfitLossPercent,
  formatQuantity,
} from '../utils/formatters'

interface PortfolioPositionRowProps {
  position: Position
  locale: string
  currencyCode: string
}

/**
 * Pure presentational row for the portfolio table.
 * Receives a fully computed Position — performs zero arithmetic.
 * Column visibility is controlled via responsive Tailwind classes.
 */
export function PortfolioPositionRow({
  position: p,
  locale,
  currencyCode,
}: PortfolioPositionRowProps) {
  const fmt = (v: number) => formatCurrency(v, locale, currencyCode)
  const fmtPrice = (v: number) => formatPrice(v, locale, currencyCode)
  const plPositive = p.profitLoss >= 0
  const plColor = plPositive ? 'text-success' : 'text-error'

  return (
    <tr className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
      {/* Ativo — always visible */}
      <td className="px-4 py-3">
        <p className="font-semibold text-foreground text-sm">{p.symbol}</p>
        <p className="text-xs text-muted-foreground">{p.name}</p>
      </td>

      {/* Tipo — hidden on mobile */}
      <td className="hidden md:table-cell px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
        {formatAssetType(p.type)}
      </td>

      {/* Quantidade — hidden on mobile */}
      <td className="hidden md:table-cell px-4 py-3 text-sm text-right tabular-nums text-foreground">
        {formatQuantity(p.quantity)}
      </td>

      {/* Preço Médio — hidden on mobile + tablet */}
      <td className="hidden lg:table-cell px-4 py-3 text-sm text-right tabular-nums text-muted-foreground">
        {fmtPrice(p.averagePrice)}
      </td>

      {/* Preço Atual — hidden on mobile */}
      <td className="hidden md:table-cell px-4 py-3 text-sm text-right tabular-nums text-foreground">
        {fmtPrice(p.currentPrice)}
      </td>

      {/* Valor Investido — hidden on mobile + tablet */}
      <td className="hidden lg:table-cell px-4 py-3 text-sm text-right tabular-nums text-muted-foreground">
        {fmt(p.investedAmount)}
      </td>

      {/* Valor Atual — always visible */}
      <td className="px-4 py-3 text-sm text-right tabular-nums font-medium text-foreground">
        {fmt(p.currentValue)}
      </td>

      {/* L/P R$ — hidden on mobile */}
      <td
        className={[
          'hidden md:table-cell px-4 py-3 text-sm text-right tabular-nums font-medium',
          plColor,
        ].join(' ')}
      >
        {fmt(p.profitLoss)}
      </td>

      {/* L/P % — always visible */}
      <td className={['px-4 py-3 text-sm text-right tabular-nums font-bold', plColor].join(' ')}>
        {formatProfitLossPercent(p.profitLossPercent)}
      </td>

      {/* Peso — hidden on mobile */}
      <td className="hidden md:table-cell px-4 py-3 text-sm text-right tabular-nums text-muted-foreground">
        {formatAllocationPercent(p.allocationPercent)}
      </td>
    </tr>
  )
}

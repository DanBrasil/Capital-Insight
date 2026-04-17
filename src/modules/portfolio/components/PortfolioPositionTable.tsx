import type { Position } from '../types'
import { PortfolioPositionRow } from './PortfolioPositionRow'

interface PortfolioPositionTableProps {
  positions: Position[]
  locale: string
  currencyCode: string
}

/**
 * Responsive table of all open positions.
 * Columns are progressively revealed as viewport grows.
 * Zero business logic — delegates row rendering to PortfolioPositionRow.
 */
export function PortfolioPositionTable({
  positions,
  locale,
  currencyCode,
}: PortfolioPositionTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-5 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Posições</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px]">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Ativo
              </th>
              <th className="hidden md:table-cell px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Tipo
              </th>
              <th className="hidden md:table-cell px-4 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Qtd.
              </th>
              <th className="hidden lg:table-cell px-4 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Preço Médio
              </th>
              <th className="hidden md:table-cell px-4 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Preço Atual
              </th>
              <th className="hidden lg:table-cell px-4 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Valor Invest.
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Valor Atual
              </th>
              <th className="hidden md:table-cell px-4 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                L/P R$
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                L/P %
              </th>
              <th className="hidden md:table-cell px-4 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Peso
              </th>
            </tr>
          </thead>
          <tbody>
            {positions.map(position => (
              <PortfolioPositionRow
                key={position.symbol}
                position={position}
                locale={locale}
                currencyCode={currencyCode}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

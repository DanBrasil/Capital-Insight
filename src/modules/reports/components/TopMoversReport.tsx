import { Card } from '@/components/ui/Card'
import { Text } from '@/components/ui/Typography'
import { Badge } from '@/components/ui/Badge'

import type { ReportTopMover } from '../types'

const percentFmt = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
const currencyFmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

interface TopMoverRowProps {
  mover: ReportTopMover
  type: 'gainer' | 'loser'
}

function TopMoverRow({ mover, type }: TopMoverRowProps) {
  const sentiment = type === 'gainer' ? 'success' : 'error'
  const sign = type === 'gainer' ? '+' : ''

  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <div className="flex flex-col">
        <Text className="text-sm font-semibold text-foreground">{mover.symbol}</Text>
        <Text className="text-xs text-foreground/50 truncate max-w-[120px]">{mover.name}</Text>
      </div>
      <div className="flex flex-col items-end gap-1">
        <Badge variant={sentiment}>
          {sign}
          {percentFmt.format(mover.profitLossPercent / 100)}
        </Badge>
        <Text className="text-xs text-foreground/60">{currencyFmt.format(mover.currentValue)}</Text>
      </div>
    </div>
  )
}

interface TopMoversReportProps {
  gainers: ReportTopMover[]
  losers: ReportTopMover[]
}

/**
 * Compact table showing top-performing and worst-performing assets.
 * Receives pre-sorted arrays — applies no sorting internally.
 */
export function TopMoversReport({ gainers, losers }: TopMoversReportProps) {
  return (
    <Card>
      <Card.Header>
        <Text className="text-sm font-semibold text-foreground">Top Movers</Text>
      </Card.Header>
      <Card.Body className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
        <div>
          <Text className="mb-2 text-xs font-medium text-foreground/60 uppercase tracking-wide">
            Maiores Ganhos
          </Text>
          {gainers.length > 0 ? (
            gainers.map(m => <TopMoverRow key={m.symbol} mover={m} type="gainer" />)
          ) : (
            <Text className="text-xs text-foreground/40">Nenhum ativo em alta no período</Text>
          )}
        </div>
        <div>
          <Text className="mb-2 text-xs font-medium text-foreground/60 uppercase tracking-wide">
            Maiores Perdas
          </Text>
          {losers.length > 0 ? (
            losers.map(m => <TopMoverRow key={m.symbol} mover={m} type="loser" />)
          ) : (
            <Text className="text-xs text-foreground/40">Nenhum ativo em baixa no período</Text>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}

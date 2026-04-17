import { Card } from '@/components/ui/Card'
import { Text } from '@/components/ui/Typography'

import type { ReportOperationsAggregate } from '../types'

const currencyFmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <Text className="text-xs font-medium text-foreground/60 uppercase tracking-wide">
        {label}
      </Text>
      <p className="text-lg font-bold text-foreground leading-tight">{value}</p>
    </div>
  )
}

interface OperationsSummaryPanelProps {
  aggregate: ReportOperationsAggregate
}

/**
 * Displays a compact operational summary for the filtered period.
 * Purely presentational — receives pre-aggregated data.
 */
export function OperationsSummaryPanel({ aggregate }: OperationsSummaryPanelProps) {
  return (
    <Card>
      <Card.Header>
        <Text className="text-sm font-semibold text-foreground">Resumo Operacional</Text>
      </Card.Header>
      <Card.Body className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-4">
        <StatItem label="Compras" value={String(aggregate.totalBuys)} />
        <StatItem label="Vendas" value={String(aggregate.totalSells)} />
        <StatItem label="Volume comprado" value={currencyFmt.format(aggregate.totalBuyVolume)} />
        <StatItem label="Volume vendido" value={currencyFmt.format(aggregate.totalSellVolume)} />
        {aggregate.mostNegotiatedAsset && (
          <div className="col-span-2 sm:col-span-4 pt-2 border-t border-border">
            <Text className="text-xs text-foreground/60">
              Ativo mais negociado:{' '}
              <span className="font-semibold text-foreground">{aggregate.mostNegotiatedAsset}</span>
            </Text>
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

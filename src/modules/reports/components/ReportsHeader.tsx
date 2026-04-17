import { Heading, Text } from '@/components/ui/Typography'

import type { ReportPeriod } from '../types'

const PERIOD_LABELS: Record<ReportPeriod, string> = {
  '7d': '7 dias',
  '30d': '30 dias',
  '3m': '3 meses',
  '6m': '6 meses',
  '1y': '1 ano',
  custom: 'Período personalizado',
}

interface ReportsHeaderProps {
  activePeriod: ReportPeriod
}

export function ReportsHeader({ activePeriod }: ReportsHeaderProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Heading level="h1" className="text-2xl font-bold text-foreground">
          Relatórios
        </Heading>
        <Text className="text-sm text-foreground/60">
          Análise consolidada da carteira e operações
        </Text>
      </div>

      <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
        {PERIOD_LABELS[activePeriod]}
      </span>
    </div>
  )
}

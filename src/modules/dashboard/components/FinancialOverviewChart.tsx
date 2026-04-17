import { Card, ErrorState } from '@/components/ui'

import { BarChart } from './BarChart'
import { EmptyState } from './EmptyState'
import { useDashboardChartData } from '../hooks/useDashboardChartData'
import type { DashboardPeriod } from '../types'

interface FinancialOverviewChartProps {
  period: DashboardPeriod
}

/** Fetches chart data for the given period and renders the BarChart or an appropriate fallback */
export function FinancialOverviewChart({ period }: FinancialOverviewChartProps) {
  const { data, isLoading, isError } = useDashboardChartData(period)

  const hasData = data && data.some(d => d.income > 0 || d.expenses > 0)

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Visão geral financeira</h2>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-success opacity-80" />
              Receitas
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-error opacity-80" />
              Despesas
            </span>
          </div>
        </div>
      </Card.Header>

      <Card.Body>
        {isLoading && <div className="h-40 rounded animate-pulse bg-muted" />}

        {isError && <ErrorState title="Erro ao carregar o gráfico" size="sm" />}

        {data && !hasData && (
          <EmptyState
            title="Sem dados no período"
            description="Registre transações para visualizar o gráfico."
          />
        )}

        {hasData && <BarChart data={data} />}
      </Card.Body>
    </Card>
  )
}

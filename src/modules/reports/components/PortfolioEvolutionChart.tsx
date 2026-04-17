import { useMemo } from 'react'

import {
  AreaChart,
  ChartContainer,
  fmtBRLCompact,
  fmtDateShort,
  useChartTheme,
} from '@/components/data-visualization'
import type { ChartRecord, ChartSeries } from '@/components/data-visualization'

import type { ReportTimeSeriesPoint } from '../types'
import { sampleSeries } from '../utils/chartUtils'

interface PortfolioEvolutionChartProps {
  series: ReportTimeSeriesPoint[]
}

/**
 * Portfolio value area chart.
 *
 * Transforms ReportTimeSeriesPoint[] into ChartRecord[] and delegates
 * rendering to the shared AreaChart component.
 * No analytics or calculations performed here.
 */
export function PortfolioEvolutionChart({ series }: PortfolioEvolutionChartProps) {
  const theme = useChartTheme()

  const chartData = useMemo<ChartRecord[]>(
    () =>
      sampleSeries(series, 60).map(p => ({
        label: fmtDateShort(p.date),
        currentValue: p.currentValue,
        investedValue: p.investedValue,
      })),
    [series],
  )

  const chartSeries: ChartSeries[] = [
    { dataKey: 'currentValue', name: 'Valor Atual', color: theme.colors[0] },
    { dataKey: 'investedValue', name: 'Investido', color: theme.colors[1] },
  ]

  return (
    <ChartContainer title="Evolução da Carteira" height={220}>
      <AreaChart
        data={chartData}
        series={chartSeries}
        config={{
          height: 220,
          showLegend: true,
          formatValue: fmtBRLCompact,
        }}
      />
    </ChartContainer>
  )
}

import { useMemo } from 'react'

import { ChartContainer, HorizontalBarChart, fmtPct } from '@/components/data-visualization'
import type { SingleSeriesPoint } from '@/components/data-visualization'

import type { ReportDistributionItem } from '../types'

const ASSET_TYPE_LABELS: Record<string, string> = {
  stock: 'Ações',
  fii: 'FIIs',
  etf: 'ETFs',
  bdr: 'BDRs',
  'fixed-income': 'Renda Fixa',
  crypto: 'Cripto',
}

interface AssetTypeDistributionChartProps {
  distribution: ReportDistributionItem[]
}

/**
 * Asset class distribution chart.
 *
 * Transforms ReportDistributionItem[] into SingleSeriesPoint[] and delegates
 * rendering to the shared HorizontalBarChart component.
 * No analytics or calculations performed here.
 */
export function AssetTypeDistributionChart({ distribution }: AssetTypeDistributionChartProps) {
  const chartData = useMemo<SingleSeriesPoint[]>(
    () =>
      distribution.map(d => ({
        label: ASSET_TYPE_LABELS[d.label] ?? d.label,
        value: d.percentage,
      })),
    [distribution],
  )

  const chartHeight = Math.max(distribution.length * 48 + 24, 120)

  return (
    <ChartContainer title="Distribuição por Classe" height={chartHeight}>
      <HorizontalBarChart
        data={chartData}
        seriesName="Alocação"
        config={{
          height: chartHeight,
          formatValue: fmtPct,
        }}
      />
    </ChartContainer>
  )
}

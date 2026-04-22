import { useMemo } from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import { useChartTheme } from '../hooks/useChartTheme'
import { ChartTooltipContent } from '../shared/ChartTooltipContent'
import type { ChartConfig, SingleSeriesPoint } from '../types'

interface DonutChartProps {
  data: SingleSeriesPoint[]
  /** Override specific colors per slice. Falls back to theme palette. */
  colors?: string[]
  config?: ChartConfig
  className?: string
  /** Accessible label describing the chart content. Important for screen readers. */
  'aria-label'?: string
}

/**
 * Donut chart wrapper over Recharts PieChart.
 *
 * Best used for: portfolio allocation by asset type or by position (≤ 7 slices).
 * For > 7 categories, use HorizontalBarChart instead — it is more legible.
 * Receives pre-transformed SingleSeriesPoint[].
 *
 * The tooltip shows the percentage of total automatically computed here,
 * since this is a purely visual transformation (not analytics).
 */
export function DonutChart({
  data,
  colors: colorOverrides,
  config = {},
  className = '',
  'aria-label': ariaLabel,
}: DonutChartProps) {
  const theme = useChartTheme()
  const { height = 240, showLegend = true, showTooltip = true, formatValue } = config

  const colors = colorOverrides ?? theme.colors

  // Compute total for percentage display in tooltip
  const total = useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data])

  const formatPieValue = (value: number) => {
    const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0'
    const base = formatValue ? formatValue(value) : String(value)
    return `${base} (${pct}%)`
  }

  // Recharts Pie needs { name, value } shape
  const pieData = data.map(d => ({ name: d.label, value: d.value }))

  return (
    <div
      className={['w-full', className].join(' ')}
      style={{ height }}
      role="img"
      aria-label={ariaLabel}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            innerRadius="55%"
            outerRadius="78%"
            paddingAngle={2}
            strokeWidth={0}
          >
            {pieData.map((_, idx) => (
              <Cell key={idx} fill={colors[idx % colors.length]} />
            ))}
          </Pie>
          {showTooltip && (
            <Tooltip
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              content={({ active, payload }: any) => (
                <ChartTooltipContent
                  active={active}
                  payload={payload}
                  formatValue={formatPieValue}
                />
              )}
            />
          )}
          {showLegend && (
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

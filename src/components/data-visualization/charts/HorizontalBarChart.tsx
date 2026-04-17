import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { useChartTheme } from '../hooks/useChartTheme'
import { ChartTooltipContent } from '../shared/ChartTooltipContent'
import type { ChartConfig, SingleSeriesPoint } from '../types'

interface HorizontalBarChartProps {
  data: SingleSeriesPoint[]
  /** Override the single series color. Defaults to tenant primary. */
  seriesColor?: string
  /** Display name shown in the tooltip for the value series. */
  seriesName?: string
  config?: ChartConfig
  className?: string
}

/**
 * Horizontal bar chart (layout="vertical" in Recharts terms).
 *
 * Best used for: asset class distribution %, ranking with long category labels.
 * More legible on mobile than a donut chart for > 4 categories.
 * Receives pre-transformed SingleSeriesPoint[].
 *
 * Note: In Recharts, layout="vertical" means bars grow horizontally (left → right).
 * Y axis holds the category labels; X axis holds the numeric scale.
 */
export function HorizontalBarChart({
  data,
  seriesColor,
  seriesName = 'Valor',
  config = {},
  className = '',
}: HorizontalBarChartProps) {
  const theme = useChartTheme()
  const { height = Math.max(data.length * 44 + 16, 120), showTooltip = true, formatValue } = config

  const color = seriesColor ?? theme.primaryColor

  // Derive per-bar colors cycling through the theme palette
  const barColors = data.map((_, idx) => theme.colors[idx % theme.colors.length])

  return (
    <div className={['w-full', className].join(' ')} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 4, right: 8, left: 0, bottom: 4 }}
          barCategoryGap="25%"
        >
          <XAxis
            type="number"
            tick={{ fontSize: 10, fill: theme.mutedColor }}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatValue}
          />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fontSize: 11, fill: theme.foregroundColor }}
            tickLine={false}
            axisLine={false}
            width={80}
          />
          {showTooltip && (
            <Tooltip
              cursor={{ fill: theme.borderColor, fillOpacity: 0.3 }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              content={({ active, payload, label }: any) => (
                <ChartTooltipContent
                  active={active}
                  payload={payload}
                  label={String(label ?? '')}
                  formatValue={formatValue}
                />
              )}
            />
          )}
          <Bar dataKey="value" name={seriesName} fill={color} radius={[0, 3, 3, 0]}>
            {data.map((_, idx) => (
              <Cell key={idx} fill={barColors[idx]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

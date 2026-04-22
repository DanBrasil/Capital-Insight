import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { useChartTheme } from '../hooks/useChartTheme'
import { ChartTooltipContent } from '../shared/ChartTooltipContent'
import type { ChartConfig, ChartRecord, ChartSeries } from '../types'

interface BarChartProps {
  data: ChartRecord[]
  series: ChartSeries[]
  xAxisKey?: string
  config?: ChartConfig
  className?: string
  /** Accessible label describing the chart content. Important for screen readers. */
  'aria-label'?: string
}

/**
 * Vertical bar chart wrapper over Recharts.
 *
 * Best used for: ranking by period, buy vs sell volume comparison,
 * discrete category comparison where temporal order matters.
 * Receives pre-transformed ChartRecord[].
 */
export function BarChart({
  data,
  series,
  xAxisKey = 'label',
  config = {},
  className = '',
  'aria-label': ariaLabel,
}: BarChartProps) {
  const theme = useChartTheme()
  const {
    height = 200,
    showGrid = true,
    showLegend = false,
    showTooltip = true,
    formatValue,
    formatLabel,
  } = config

  const resolveColor = (s: ChartSeries, idx: number) =>
    s.color ?? theme.colors[idx % theme.colors.length]

  return (
    <div
      className={['w-full', className].join(' ')}
      style={{ height }}
      role="img"
      aria-label={ariaLabel}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{ top: 8, right: 4, left: 0, bottom: 0 }}
          barCategoryGap="30%"
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme.borderColor}
              strokeOpacity={0.6}
              vertical={false}
            />
          )}
          <XAxis
            dataKey={xAxisKey}
            tick={{ fontSize: 10, fill: theme.mutedColor }}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatLabel}
          />
          <YAxis
            tick={{ fontSize: 10, fill: theme.mutedColor }}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatValue}
            width={68}
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
          {showLegend && (
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
            />
          )}
          {series.map((s, idx) => (
            <Bar
              key={s.dataKey}
              dataKey={s.dataKey}
              name={s.name}
              fill={resolveColor(s, idx)}
              radius={[3, 3, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}

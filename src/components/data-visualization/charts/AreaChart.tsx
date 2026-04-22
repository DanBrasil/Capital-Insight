import {
  Area,
  AreaChart as RechartsAreaChart,
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

interface AreaChartProps {
  data: ChartRecord[]
  series: ChartSeries[]
  /** Key in each ChartRecord to use as the X axis. Defaults to 'label'. */
  xAxisKey?: string
  config?: ChartConfig
  className?: string
  /** Accessible label describing the chart content. Important for screen readers. */
  'aria-label'?: string
}

/**
 * Area chart wrapper over Recharts.
 *
 * Best used for: temporal portfolio evolution, trend visualisation.
 * Receives pre-transformed ChartRecord[] — performs no analytics internally.
 *
 * Multiple series are supported; each series renders as a stacked transparent fill.
 */
export function AreaChart({
  data,
  series,
  xAxisKey = 'label',
  config = {},
  className = '',
  'aria-label': ariaLabel,
}: AreaChartProps) {
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
        <RechartsAreaChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
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
            interval="preserveStartEnd"
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
              cursor={{ stroke: theme.borderColor, strokeWidth: 1, strokeDasharray: '4 2' }}
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
            <Area
              key={s.dataKey}
              type="monotone"
              dataKey={s.dataKey}
              name={s.name}
              stroke={resolveColor(s, idx)}
              fill={resolveColor(s, idx)}
              fillOpacity={0.12}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  )
}

import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts'

import { useChartTheme } from '../hooks/useChartTheme'
import { ChartTooltipContent } from '../shared/ChartTooltipContent'

interface SparklineProps {
  /** Raw numeric values in chronological order. */
  data: number[]
  /** Override the line/fill color. Defaults to tenant primary. */
  color?: string
  height?: number
  /** When true, renders a minimal tooltip on hover. */
  showTooltip?: boolean
  /** Optional value formatter for the tooltip. */
  formatValue?: (v: number) => string
  className?: string
}

/**
 * Minimal sparkline chart — no axes, no grid, no labels.
 *
 * Best used for: trend indicators inline in summary cards,
 * compact visual context without detailed analysis.
 * Accepts raw number[] for maximum ergonomics.
 *
 * Is intentionally not wrapped by ChartContainer — sparklines
 * are embedded inside other UI elements.
 */
export function Sparkline({
  data,
  color,
  height = 48,
  showTooltip = false,
  formatValue,
  className = '',
}: SparklineProps) {
  const theme = useChartTheme()
  const strokeColor = color ?? theme.primaryColor

  // Recharts needs an array of objects
  const chartData = data.map((value, i) => ({ i, value }))

  return (
    <div className={['w-full', className].join(' ')} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          {showTooltip && (
            <Tooltip
              cursor={false}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              content={({ active, payload }: any) => (
                <ChartTooltipContent active={active} payload={payload} formatValue={formatValue} />
              )}
            />
          )}
          <Area
            type="monotone"
            dataKey="value"
            stroke={strokeColor}
            fill={strokeColor}
            fillOpacity={0.12}
            strokeWidth={1.5}
            dot={false}
            activeDot={showTooltip ? { r: 3, strokeWidth: 0 } : false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

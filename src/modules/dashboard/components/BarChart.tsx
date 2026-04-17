import type { ChartDataPoint } from '../types'

// SVG canvas constants
const VW = 560
const VH = 160
const PAD = { top: 16, bottom: 32, left: 8, right: 8 }
const CHART_H = VH - PAD.top - PAD.bottom // 112
const CHART_W = VW - PAD.left - PAD.right // 544
const CHART_Y0 = PAD.top + CHART_H // baseline Y

interface BarChartProps {
  data: ChartDataPoint[]
  className?: string
}

/**
 * Pure SVG bar chart — no hooks, no side effects.
 * Renders grouped bars (income vs expenses) for each data point.
 * Colours come from CSS custom properties so tenant theming works automatically.
 */
export function BarChart({ data, className = '' }: BarChartProps) {
  if (data.length === 0) return null

  const maxValue = Math.max(...data.flatMap(d => [d.income, d.expenses]), 1)
  const groupW = CHART_W / data.length
  const barW = Math.min(groupW * 0.28, 18)
  const barGap = 3

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      className={`w-full ${className}`}
      role="img"
      aria-label="Gráfico de receitas e despesas"
    >
      {/* Horizontal grid lines at 25%, 50%, 75%, 100% */}
      {[0.25, 0.5, 0.75, 1].map(ratio => {
        const y = PAD.top + CHART_H * (1 - ratio)
        return (
          <line
            key={ratio}
            x1={PAD.left}
            y1={y}
            x2={VW - PAD.right}
            y2={y}
            stroke="var(--color-border)"
            strokeWidth={0.5}
            strokeDasharray="4 3"
          />
        )
      })}

      {/* Bar groups */}
      {data.map((point, i) => {
        const cx = PAD.left + (i + 0.5) * groupW
        const incomeH = (point.income / maxValue) * CHART_H
        const expenseH = (point.expenses / maxValue) * CHART_H

        return (
          <g key={point.label}>
            {/* Income bar */}
            {incomeH > 0 && (
              <rect
                x={cx - barW - barGap / 2}
                y={CHART_Y0 - incomeH}
                width={barW}
                height={incomeH}
                fill="var(--color-success)"
                opacity={0.82}
                rx={2}
              />
            )}

            {/* Expense bar */}
            {expenseH > 0 && (
              <rect
                x={cx + barGap / 2}
                y={CHART_Y0 - expenseH}
                width={barW}
                height={expenseH}
                fill="var(--color-error)"
                opacity={0.82}
                rx={2}
              />
            )}

            {/* X-axis label */}
            <text
              x={cx}
              y={VH - 6}
              textAnchor="middle"
              fontSize={9}
              fill="var(--color-muted-foreground)"
            >
              {point.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

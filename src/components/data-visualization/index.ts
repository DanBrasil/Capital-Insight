// ─── Types ────────────────────────────────────────────────────────────────────
export type { ChartConfig, ChartRecord, ChartSeries, SingleSeriesPoint } from './types'

// ─── Formatters ───────────────────────────────────────────────────────────────
export {
  fmtBRL,
  fmtBRLCompact,
  fmtBRLPrecise,
  fmtDateMonth,
  fmtDateShort,
  fmtInt,
  fmtPct,
  fmtPctPrecise,
  fmtPctRatio,
  fmtPctRatioPrecise,
} from './utils/formatters'

// ─── Theme hook ───────────────────────────────────────────────────────────────
export type { ChartTheme } from './hooks/useChartTheme'
export { useChartTheme } from './hooks/useChartTheme'

// ─── Shared building blocks ───────────────────────────────────────────────────
export { ChartContainer } from './shared/ChartContainer'
export { ChartEmptyState } from './shared/ChartEmptyState'
export { ChartLoadingState } from './shared/ChartLoadingState'
export { ChartTooltipContent } from './shared/ChartTooltipContent'
export type { ChartTooltipContentProps } from './shared/ChartTooltipContent'

// ─── Chart components ─────────────────────────────────────────────────────────
export { AreaChart } from './charts/AreaChart'
export { BarChart } from './charts/BarChart'
export { DonutChart } from './charts/DonutChart'
export { HorizontalBarChart } from './charts/HorizontalBarChart'
export { Sparkline } from './charts/Sparkline'

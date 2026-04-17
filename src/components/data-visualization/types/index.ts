/**
 * Standardised data model for all chart components.
 *
 * Rules:
 * - Charts never receive raw domain data (Operation[], Position[], etc.)
 * - All data must be pre-transformed by the module's analytics layer
 * - Charts receive only data ready for rendering
 */

/**
 * Multi-series data point (AreaChart, LineChart, BarChart).
 * Each record represents one point on the X axis.
 * Numeric keys map to series values; the X axis key is typically 'label'.
 *
 * Example: { label: '10 jan.', currentValue: 45000, investedValue: 42000 }
 */
export type ChartRecord = Record<string, string | number | undefined>

/**
 * Single-series data point (HorizontalBarChart, DonutChart).
 */
export interface SingleSeriesPoint {
  label: string
  value: number
}

/**
 * Defines one data series inside a multi-series chart.
 * `dataKey` must match a key present in ChartRecord.
 */
export interface ChartSeries {
  /** Key in ChartRecord that holds this series' numeric values */
  dataKey: string
  /** Display name shown in legend and tooltip */
  name: string
  /** Hex color string. Falls back to useChartTheme palette at this series index. */
  color?: string
}

/**
 * Display configuration passed to all chart components.
 * All properties are optional — each chart defines sensible defaults.
 */
export interface ChartConfig {
  /** Chart body height in px (default: 200) */
  height?: number
  showGrid?: boolean
  showLegend?: boolean
  showTooltip?: boolean
  /** Formats numeric values in tooltip and Y axis ticks */
  formatValue?: (value: number) => string
  /** Formats X axis tick labels */
  formatLabel?: (label: string) => string
}

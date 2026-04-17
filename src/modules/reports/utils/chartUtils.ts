/**
 * Time-series sampling utility for the Reports module.
 *
 * SVG path-building functions previously in this file were replaced by the
 * shared Recharts-based architecture at src/components/data-visualization/.
 * Only sampleSeries is retained since it is a domain-level decision specific
 * to time series data (how many points to render for a given period).
 */

import type { ReportTimeSeriesPoint } from '../types'

/**
 * Samples a time series to at most maxPoints evenly-spaced entries.
 * Prevents Recharts from rendering hundreds of SVG nodes for long periods.
 * Always includes the first and last points.
 */
export function sampleSeries(
  series: ReportTimeSeriesPoint[],
  maxPoints = 60,
): ReportTimeSeriesPoint[] {
  if (series.length <= maxPoints) return series
  const step = Math.ceil(series.length / maxPoints)
  return series.filter((_, i) => i % step === 0 || i === series.length - 1)
}

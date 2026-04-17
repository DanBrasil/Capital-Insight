/**
 * Unit tests for chartUtils — sampleSeries
 *
 * sampleSeries is a domain-level decision: it controls how many data points
 * reach Recharts for rendering. A bug here affects every time-series chart
 * in the Reports module.
 *
 * Key invariants:
 * - Never returns more than maxPoints entries
 * - Always preserves the first point
 * - Always preserves the last point
 * - Returns the original array unchanged when length <= maxPoints
 */
import { describe, expect, it } from 'vitest'

import { sampleSeries } from '../chartUtils'
import type { ReportTimeSeriesPoint } from '../../types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makePoints(count: number): ReportTimeSeriesPoint[] {
  return Array.from({ length: count }, (_, i) => ({
    date: `2026-01-${String(i + 1).padStart(2, '0')}`,
    investedValue: 1000 * (i + 1),
    currentValue: 1100 * (i + 1),
  }))
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('sampleSeries', () => {
  it('returns the original array when length is below the limit', () => {
    const points = makePoints(30)
    const result = sampleSeries(points, 60)
    expect(result).toBe(points) // same reference — no copy made
    expect(result).toHaveLength(30)
  })

  it('returns the original array when length exactly equals the limit', () => {
    const points = makePoints(60)
    const result = sampleSeries(points, 60)
    expect(result).toBe(points)
  })

  it('returns at most maxPoints entries when the series is longer', () => {
    const points = makePoints(365)
    const result = sampleSeries(points, 60)
    expect(result.length).toBeLessThanOrEqual(60)
  })

  it('always includes the first point of the original series', () => {
    const points = makePoints(365)
    const result = sampleSeries(points, 60)
    expect(result[0]).toBe(points[0])
  })

  it('always includes the last point of the original series', () => {
    const points = makePoints(365)
    const result = sampleSeries(points, 60)
    expect(result[result.length - 1]).toBe(points[points.length - 1])
  })

  it('returns an empty array unchanged', () => {
    const result = sampleSeries([], 60)
    expect(result).toEqual([])
  })

  it('returns a single-element array unchanged', () => {
    const points = makePoints(1)
    const result = sampleSeries(points, 60)
    expect(result).toBe(points)
  })

  it('handles a very large series without throwing', () => {
    const points = makePoints(10_000)
    expect(() => sampleSeries(points, 60)).not.toThrow()
  })

  it('uses default maxPoints of 60 when not specified', () => {
    const points = makePoints(365)
    const result = sampleSeries(points)
    expect(result.length).toBeLessThanOrEqual(60)
  })
})

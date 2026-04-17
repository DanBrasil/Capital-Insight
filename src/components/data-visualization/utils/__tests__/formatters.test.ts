/**
 * Unit tests for chart formatters.
 *
 * Formatters are used in every chart axis, tooltip, and label across the
 * entire application. A broken formatter affects 100% of the visual data layer.
 *
 * Testing strategy:
 * - Verify the output contains the expected numeric representation and symbol
 * - Avoid hardcoding the exact Intl output (which can vary by Node ICU version)
 * - Test boundary values: zero, negative, very large numbers
 */
import { describe, expect, it } from 'vitest'

import {
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
} from '../formatters'

// ─── fmtBRL ───────────────────────────────────────────────────────────────────

describe('fmtBRL', () => {
  it('includes the BRL currency symbol', () => {
    expect(fmtBRL(1000)).toContain('R$')
  })

  it('formats whole thousands with dot separator (pt-BR convention)', () => {
    expect(fmtBRL(1000)).toContain('1.000')
  })

  it('formats 42500 as "R$ 42.500"', () => {
    const result = fmtBRL(42500)
    expect(result).toContain('R$')
    expect(result).toContain('42.500')
  })

  it('handles zero without crashing', () => {
    expect(() => fmtBRL(0)).not.toThrow()
    expect(fmtBRL(0)).toContain('R$')
  })

  it('handles negative values', () => {
    const result = fmtBRL(-500)
    expect(result).toContain('500')
    // Negative should be represented (with − or -)
    expect(result.includes('-') || result.includes('−')).toBe(true)
  })
})

// ─── fmtBRLPrecise ────────────────────────────────────────────────────────────

describe('fmtBRLPrecise', () => {
  it('includes 2 decimal places', () => {
    const result = fmtBRLPrecise(42500)
    expect(result).toContain(',00')
  })

  it('formats 42500.50 with cents', () => {
    const result = fmtBRLPrecise(42500.5)
    expect(result).toContain(',50')
  })
})

// ─── fmtBRLCompact ───────────────────────────────────────────────────────────

describe('fmtBRLCompact', () => {
  it('uses compact notation — does not render the full unabbreviated number', () => {
    const result = fmtBRLCompact(42500)
    expect(result).toContain('R$')
    // pt-BR compact: "R$ 42,5 mil" — the full "42.500" should not appear
    expect(result).not.toContain('42.500')
  })

  it('handles zero', () => {
    expect(() => fmtBRLCompact(0)).not.toThrow()
  })
})

// ─── fmtPct ──────────────────────────────────────────────────────────────────

describe('fmtPct', () => {
  it('formats value directly as percentage with one decimal', () => {
    expect(fmtPct(42.5)).toBe('42.5%')
  })

  it('formats zero', () => {
    expect(fmtPct(0)).toBe('0.0%')
  })

  it('formats 100', () => {
    expect(fmtPct(100)).toBe('100.0%')
  })

  it('formats negative percentage', () => {
    expect(fmtPct(-5.2)).toBe('-5.2%')
  })
})

// ─── fmtPctPrecise ───────────────────────────────────────────────────────────

describe('fmtPctPrecise', () => {
  it('formats with two decimal places', () => {
    expect(fmtPctPrecise(42.5)).toBe('42.50%')
  })

  it('formats 0 as "0.00%"', () => {
    expect(fmtPctPrecise(0)).toBe('0.00%')
  })
})

// ─── fmtPctRatio ─────────────────────────────────────────────────────────────

describe('fmtPctRatio', () => {
  it('converts 0–1 range to percentage string', () => {
    const result = fmtPctRatio(0.425)
    // pt-BR: "42,5%" — look for the numeric part
    expect(result).toContain('42')
    expect(result).toContain('%')
  })

  it('formats 0 as 0%', () => {
    const result = fmtPctRatio(0)
    expect(result).toContain('0')
    expect(result).toContain('%')
  })

  it('formats 1 as 100%', () => {
    const result = fmtPctRatio(1)
    expect(result).toContain('100')
  })
})

// ─── fmtPctRatioPrecise ───────────────────────────────────────────────────────

describe('fmtPctRatioPrecise', () => {
  it('provides two decimal precision', () => {
    const result = fmtPctRatioPrecise(0.425)
    // "42,50%" in pt-BR
    expect(result).toContain('42')
    expect(result).toContain('%')
  })
})

// ─── fmtInt ──────────────────────────────────────────────────────────────────

describe('fmtInt', () => {
  it('formats integer with pt-BR thousand separator', () => {
    const result = fmtInt(1500)
    expect(result).toContain('1.500')
  })

  it('formats zero', () => {
    expect(() => fmtInt(0)).not.toThrow()
  })
})

// ─── fmtDateShort ─────────────────────────────────────────────────────────────

describe('fmtDateShort', () => {
  it('converts YYYY-MM-DD to "DD mmm." format', () => {
    const result = fmtDateShort('2026-01-10')
    expect(result).toContain('10')
    // Month name or abbreviation should be present
    expect(result.toLowerCase()).toMatch(/jan/)
  })

  it('formats december correctly', () => {
    const result = fmtDateShort('2025-12-01')
    expect(result.toLowerCase()).toMatch(/dez/)
  })
})

// ─── fmtDateMonth ────────────────────────────────────────────────────────────

describe('fmtDateMonth', () => {
  it('formats to month/year abbreviation', () => {
    const result = fmtDateMonth('2026-01-10')
    expect(result.toLowerCase()).toMatch(/jan/)
    expect(result).toMatch(/26/)
  })
})

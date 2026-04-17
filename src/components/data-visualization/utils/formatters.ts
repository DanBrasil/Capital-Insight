/**
 * Shared formatters for chart axes, tooltips, and labels.
 *
 * Rules:
 * - Pure functions, no React imports
 * - Locale: pt-BR
 * - Used by chart components and the analytics layers of modules
 */

// ─── Currency ─────────────────────────────────────────────────────────────────

const _brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

const _brlCompact = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const _brlPrecise = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** R$ 42.500 — best for tooltips */
export function fmtBRL(value: number): string {
  return _brl.format(value)
}

/** R$ 42,5K — best for Y axis ticks */
export function fmtBRLCompact(value: number): string {
  return _brlCompact.format(value)
}

/** R$ 42.500,00 — best for precise financial values */
export function fmtBRLPrecise(value: number): string {
  return _brlPrecise.format(value)
}

// ─── Percentage ───────────────────────────────────────────────────────────────

const _pct1 = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

const _pct2 = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** 42,5% — best for chart labels (value already as %, e.g. 42.5 → 42.5%) */
export function fmtPct(value: number): string {
  return `${value.toFixed(1)}%`
}

/** 42,50% — precise, for tooltips */
export function fmtPctPrecise(value: number): string {
  return `${value.toFixed(2)}%`
}

/** Accepts 0–1 range: fmtPctRatio(0.425) → "42,5%" */
export function fmtPctRatio(value: number): string {
  return _pct1.format(value)
}

/** Accepts 0–1 range, precise: fmtPctRatioPrecise(0.425) → "42,50%" */
export function fmtPctRatioPrecise(value: number): string {
  return _pct2.format(value)
}

// ─── Numbers ──────────────────────────────────────────────────────────────────

/** 1.234 — integer with thousand separator */
export function fmtInt(value: number): string {
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(value)
}

// ─── Dates ───────────────────────────────────────────────────────────────────

/**
 * YYYY-MM-DD → "10 jan." — best for dense X axis ticks
 */
export function fmtDateShort(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('pt-BR', {
    month: 'short',
    day: 'numeric',
  })
}

/**
 * YYYY-MM-DD → "jan./26" — best for monthly-granularity X axis
 */
export function fmtDateMonth(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('pt-BR', {
    month: 'short',
    year: '2-digit',
  })
}

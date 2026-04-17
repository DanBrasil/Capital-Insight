/**
 * Pure formatting utilities for the dashboard module.
 * No React, no state, no side effects — easy to unit test.
 */

export function formatCurrency(value: number, locale: string, currencyCode: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
  }).format(value)
}

/**
 * Returns the percentage change between two values.
 * Returns 0 when previousValue is 0 to avoid division by zero.
 */
export function formatVariation(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / Math.abs(previous)) * 100
}

/** Formats a variation number as "+12.3%" or "-4.5%" */
export function formatPercent(value: number): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}

/** Formats an ISO date string as "15 abr." or "Apr 15" depending on locale */
export function formatShortDate(isoString: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
  }).format(new Date(isoString))
}

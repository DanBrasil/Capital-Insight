/**
 * Pure formatting utilities for the portfolio module.
 * No React, no state, no side effects.
 */

import type { AssetType } from '../types'

export function formatCurrency(value: number, locale: string, currencyCode: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
  }).format(value)
}

/**
 * Formats a profit/loss percent as "+12.34%" or "-4.56%".
 * Always includes the sign for clarity.
 */
export function formatProfitLossPercent(value: number): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export function formatQuantity(value: number): string {
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 4 }).format(value)
}

export function formatPrice(value: number, locale: string, currencyCode: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
  }).format(value)
}

export function formatAllocationPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  stock: 'Ação',
  fii: 'FII',
  bdr: 'BDR',
  etf: 'ETF',
  'fixed-income': 'Renda Fixa',
  crypto: 'Cripto',
}

export function formatAssetType(type: AssetType): string {
  return ASSET_TYPE_LABELS[type]
}

/**
 * Pure formatting utilities for the operations module.
 * No React, no state, no side effects.
 */

import type { AssetType } from '@/modules/portfolio/types'

import type { OperationType } from '../types'

export function formatCurrency(value: number, locale: string, currencyCode: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
  }).format(value)
}

export function formatDate(isoString: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(isoString))
}

export function formatQuantity(value: number): string {
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 4 }).format(value)
}

const OPERATION_TYPE_LABELS: Record<OperationType, string> = {
  buy: 'Compra',
  sell: 'Venda',
}

export function formatOperationType(type: OperationType): string {
  return OPERATION_TYPE_LABELS[type]
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

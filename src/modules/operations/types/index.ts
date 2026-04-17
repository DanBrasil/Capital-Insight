import type { AssetType } from '@/modules/portfolio/types'

export type { AssetType }

export type OperationType = 'buy' | 'sell'

export type OperationOrderBy = 'date' | 'totalAmount' | 'symbol'
export type OrderDirection = 'asc' | 'desc'

// ─── Core entity ──────────────────────────────────────────────────────────────

/**
 * A single registered operation (buy or sell).
 *
 * totalAmount is always computed by the service as (quantity × unitPrice) + fees.
 * assetName is resolved by the service from the symbol — not provided by the user.
 * Components never compute totalAmount — they only display it.
 */
export interface Operation {
  id: string
  symbol: string
  assetName: string
  assetType: AssetType
  operationType: OperationType
  quantity: number
  unitPrice: number
  /** (quantity × unitPrice) + fees — computed by the service */
  totalAmount: number
  fees: number
  operationDate: string // ISO 8601
  broker?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

// ─── Payloads ─────────────────────────────────────────────────────────────────

/**
 * What the caller sends to create an operation.
 * assetName and totalAmount are omitted — the service resolves and computes them.
 */
export interface CreateOperationPayload {
  symbol: string
  assetType: AssetType
  operationType: OperationType
  quantity: number
  unitPrice: number
  fees: number
  operationDate: string
  broker?: string
  notes?: string
}

export type UpdateOperationPayload = CreateOperationPayload & { id: string }

// ─── Filters ──────────────────────────────────────────────────────────────────

export interface OperationFilters {
  search: string
  operationType: OperationType | 'all'
  assetType: AssetType | 'all'
  startDate: string
  endDate: string
  orderBy: OperationOrderBy
  orderDirection: OrderDirection
}

export const DEFAULT_OPERATION_FILTERS: OperationFilters = {
  search: '',
  operationType: 'all',
  assetType: 'all',
  startDate: '',
  endDate: '',
  orderBy: 'date',
  orderDirection: 'desc',
}

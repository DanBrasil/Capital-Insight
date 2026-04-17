import { apiClient } from '@/services/api/client'
import { ENDPOINTS } from '@/services/api/constants'

import type {
  CreateOperationPayload,
  Operation,
  OperationFilters,
  UpdateOperationPayload,
} from '../types'

// ─── Asset name resolution (DEV) ─────────────────────────────────────────────

const ASSET_NAME_MAP: Record<string, string> = {
  PETR4: 'Petrobras PN',
  VALE3: 'Vale ON',
  ITUB4: 'Itaú Unibanco PN',
  WEGE3: 'WEG ON',
  HGLG11: 'CSHG Logística',
  BBDC4: 'Bradesco PN',
  MGLU3: 'Magazine Luiza ON',
  RENT3: 'Localiza ON',
}

function resolveAssetName(symbol: string): string {
  return ASSET_NAME_MAP[symbol.toUpperCase()] ?? symbol
}

function computeTotalAmount(quantity: number, unitPrice: number, fees: number): number {
  return quantity * unitPrice + fees
}

// ─── Mutable mock store ───────────────────────────────────────────────────────

let MOCK_STORE: Operation[] = [
  {
    id: '1',
    symbol: 'PETR4',
    assetName: 'Petrobras PN',
    assetType: 'stock',
    operationType: 'buy',
    quantity: 200,
    unitPrice: 32.5,
    totalAmount: 6510.0,
    fees: 10.0,
    operationDate: '2026-01-10T10:00:00Z',
    broker: 'XP Investimentos',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: '2',
    symbol: 'VALE3',
    assetName: 'Vale ON',
    assetType: 'stock',
    operationType: 'buy',
    quantity: 150,
    unitPrice: 68.0,
    totalAmount: 10207.5,
    fees: 7.5,
    operationDate: '2026-01-15T14:00:00Z',
    broker: 'XP Investimentos',
    createdAt: '2026-01-15T14:00:00Z',
    updatedAt: '2026-01-15T14:00:00Z',
  },
  {
    id: '3',
    symbol: 'ITUB4',
    assetName: 'Itaú Unibanco PN',
    assetType: 'stock',
    operationType: 'buy',
    quantity: 300,
    unitPrice: 26.8,
    totalAmount: 8047.5,
    fees: 7.5,
    operationDate: '2026-02-03T09:30:00Z',
    broker: 'Clear',
    createdAt: '2026-02-03T09:30:00Z',
    updatedAt: '2026-02-03T09:30:00Z',
  },
  {
    id: '4',
    symbol: 'WEGE3',
    assetName: 'WEG ON',
    assetType: 'stock',
    operationType: 'buy',
    quantity: 100,
    unitPrice: 42.0,
    totalAmount: 4207.5,
    fees: 7.5,
    operationDate: '2026-02-20T11:00:00Z',
    broker: 'Clear',
    createdAt: '2026-02-20T11:00:00Z',
    updatedAt: '2026-02-20T11:00:00Z',
  },
  {
    id: '5',
    symbol: 'HGLG11',
    assetName: 'CSHG Logística',
    assetType: 'fii',
    operationType: 'buy',
    quantity: 50,
    unitPrice: 158.0,
    totalAmount: 7907.5,
    fees: 7.5,
    operationDate: '2026-03-05T10:00:00Z',
    broker: 'XP Investimentos',
    createdAt: '2026-03-05T10:00:00Z',
    updatedAt: '2026-03-05T10:00:00Z',
  },
  {
    id: '6',
    symbol: 'VALE3',
    assetName: 'Vale ON',
    assetType: 'stock',
    operationType: 'sell',
    quantity: 30,
    unitPrice: 71.5,
    totalAmount: 2137.5,
    fees: 7.5,
    operationDate: '2026-03-18T15:30:00Z',
    broker: 'XP Investimentos',
    notes: 'Realização parcial de lucro',
    createdAt: '2026-03-18T15:30:00Z',
    updatedAt: '2026-03-18T15:30:00Z',
  },
]

let nextId = MOCK_STORE.length + 1

// ─── Filter / sort helpers ────────────────────────────────────────────────────

function applyFilters(list: Operation[], filters: OperationFilters): Operation[] {
  let result = [...list]

  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      op => op.symbol.toLowerCase().includes(q) || op.assetName.toLowerCase().includes(q),
    )
  }

  if (filters.operationType !== 'all') {
    result = result.filter(op => op.operationType === filters.operationType)
  }

  if (filters.assetType !== 'all') {
    result = result.filter(op => op.assetType === filters.assetType)
  }

  if (filters.startDate) {
    result = result.filter(op => op.operationDate >= filters.startDate)
  }

  if (filters.endDate) {
    result = result.filter(op => op.operationDate <= filters.endDate + 'T23:59:59Z')
  }

  result.sort((a, b) => {
    let comparison = 0
    if (filters.orderBy === 'date') {
      comparison = a.operationDate.localeCompare(b.operationDate)
    } else if (filters.orderBy === 'totalAmount') {
      comparison = a.totalAmount - b.totalAmount
    } else if (filters.orderBy === 'symbol') {
      comparison = a.symbol.localeCompare(b.symbol)
    }
    return filters.orderDirection === 'asc' ? comparison : -comparison
  })

  return result
}

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Operations API service — pure async functions, no React dependencies.
 *
 * In development: uses an in-memory mutable store so CRUD is fully functional.
 * In production: delegates to the API via apiClient.
 *
 * This service is the primary data source for the Portfolio module.
 * Any mutation here must be reflected in the portfolio cache (handled by hooks).
 */
export const operationService = {
  async list(filters: OperationFilters): Promise<Operation[]> {
    if (import.meta.env.DEV) {
      return applyFilters(MOCK_STORE, filters)
    }
    const response = await apiClient.get<Operation[]>(ENDPOINTS.operations.list, {
      params: filters,
    })
    return response.data
  },

  async create(payload: CreateOperationPayload): Promise<Operation> {
    if (import.meta.env.DEV) {
      const now = new Date().toISOString()
      const operation: Operation = {
        id: String(nextId++),
        ...payload,
        assetName: resolveAssetName(payload.symbol),
        totalAmount: computeTotalAmount(payload.quantity, payload.unitPrice, payload.fees),
        createdAt: now,
        updatedAt: now,
      }
      MOCK_STORE = [operation, ...MOCK_STORE]
      return operation
    }
    const response = await apiClient.post<Operation>(ENDPOINTS.operations.create, payload)
    return response.data
  },

  async update(payload: UpdateOperationPayload): Promise<Operation> {
    if (import.meta.env.DEV) {
      const now = new Date().toISOString()
      MOCK_STORE = MOCK_STORE.map(op =>
        op.id === payload.id
          ? {
              ...op,
              ...payload,
              assetName: resolveAssetName(payload.symbol),
              totalAmount: computeTotalAmount(payload.quantity, payload.unitPrice, payload.fees),
              updatedAt: now,
            }
          : op,
      )
      return MOCK_STORE.find(op => op.id === payload.id)!
    }
    const response = await apiClient.put<Operation>(
      ENDPOINTS.operations.update(payload.id),
      payload,
    )
    return response.data
  },

  async remove(id: string): Promise<void> {
    if (import.meta.env.DEV) {
      MOCK_STORE = MOCK_STORE.filter(op => op.id !== id)
      return
    }
    await apiClient.delete(ENDPOINTS.operations.delete(id))
  },

  /** Returns all operations unfiltered — used by portfolio calculations */
  async listAll(): Promise<Operation[]> {
    if (import.meta.env.DEV) {
      return [...MOCK_STORE]
    }
    const response = await apiClient.get<Operation[]>(ENDPOINTS.operations.list)
    return response.data
  },
}

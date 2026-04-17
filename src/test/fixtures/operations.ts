/**
 * Operation fixtures for tests.
 *
 * `makeOperation` is a factory that lets tests declare only the fields they care
 * about — safe defaults fill the rest. This avoids brittle tests tied to
 * unrelated field values.
 */
import type { Operation } from '@/modules/operations/types'

export function makeOperation(overrides: Partial<Operation> = {}): Operation {
  return {
    id: 'op-1',
    symbol: 'PETR4',
    assetName: 'Petrobras',
    assetType: 'stock',
    operationType: 'buy',
    quantity: 100,
    unitPrice: 30,
    totalAmount: 3000,
    fees: 0,
    operationDate: '2024-01-15T00:00:00.000Z',
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
    ...overrides,
  }
}

/** A realistic set of mixed buy/sell operations across two assets */
export const mockOperations: Operation[] = [
  makeOperation({
    id: 'op-1',
    symbol: 'PETR4',
    assetType: 'stock',
    operationType: 'buy',
    operationDate: '2024-01-15T00:00:00.000Z',
    totalAmount: 3000,
  }),
  makeOperation({
    id: 'op-2',
    symbol: 'HGLG11',
    assetName: 'CSHG Logística',
    assetType: 'fii',
    operationType: 'buy',
    quantity: 20,
    unitPrice: 100,
    operationDate: '2024-02-10T00:00:00.000Z',
    totalAmount: 2000,
  }),
  makeOperation({
    id: 'op-3',
    symbol: 'PETR4',
    operationType: 'sell',
    quantity: 50,
    unitPrice: 36,
    operationDate: '2024-03-01T00:00:00.000Z',
    totalAmount: 1800,
  }),
]

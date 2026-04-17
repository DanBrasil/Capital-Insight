import { apiClient } from '@/services/api/client'

import type {
  CreateTransactionPayload,
  Transaction,
  TransactionFilters,
  UpdateTransactionPayload,
} from '../types'

// ─── Dev mock store ───────────────────────────────────────────────────────────

let MOCK_STORE: Transaction[] = [
  {
    id: '1',
    title: 'Salário',
    type: 'income',
    amount: 5000,
    category: 'Trabalho',
    date: '2026-04-15T10:00:00Z',
    status: 'completed',
    description: 'Salário mensal',
    createdAt: '2026-04-15T10:00:00Z',
    updatedAt: '2026-04-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Aluguel',
    type: 'expense',
    amount: 1800,
    category: 'Moradia',
    date: '2026-04-14T09:00:00Z',
    status: 'completed',
    createdAt: '2026-04-14T09:00:00Z',
    updatedAt: '2026-04-14T09:00:00Z',
  },
  {
    id: '3',
    title: 'Freelance',
    type: 'income',
    amount: 1200,
    category: 'Trabalho',
    date: '2026-04-13T14:00:00Z',
    status: 'completed',
    createdAt: '2026-04-13T14:00:00Z',
    updatedAt: '2026-04-13T14:00:00Z',
  },
  {
    id: '4',
    title: 'Supermercado',
    type: 'expense',
    amount: 380,
    category: 'Alimentação',
    date: '2026-04-12T18:00:00Z',
    status: 'completed',
    createdAt: '2026-04-12T18:00:00Z',
    updatedAt: '2026-04-12T18:00:00Z',
  },
  {
    id: '5',
    title: 'Plano de internet',
    type: 'expense',
    amount: 120,
    category: 'Serviços',
    date: '2026-04-11T08:00:00Z',
    status: 'pending',
    createdAt: '2026-04-11T08:00:00Z',
    updatedAt: '2026-04-11T08:00:00Z',
  },
  {
    id: '6',
    title: 'Academia',
    type: 'expense',
    amount: 90,
    category: 'Saúde',
    date: '2026-04-10T07:00:00Z',
    status: 'completed',
    createdAt: '2026-04-10T07:00:00Z',
    updatedAt: '2026-04-10T07:00:00Z',
  },
  {
    id: '7',
    title: 'Dividendos',
    type: 'income',
    amount: 350,
    category: 'Investimentos',
    date: '2026-04-09T12:00:00Z',
    status: 'completed',
    createdAt: '2026-04-09T12:00:00Z',
    updatedAt: '2026-04-09T12:00:00Z',
  },
  {
    id: '8',
    title: 'Curso online',
    type: 'expense',
    amount: 250,
    category: 'Educação',
    date: '2026-04-08T11:00:00Z',
    status: 'cancelled',
    createdAt: '2026-04-08T11:00:00Z',
    updatedAt: '2026-04-08T11:00:00Z',
  },
]

function applyFilters(list: Transaction[], filters: TransactionFilters): Transaction[] {
  let result = [...list]

  if (filters.search) {
    const term = filters.search.toLowerCase()
    result = result.filter(
      t => t.title.toLowerCase().includes(term) || t.category.toLowerCase().includes(term),
    )
  }

  if (filters.type !== 'all') {
    result = result.filter(t => t.type === filters.type)
  }

  if (filters.category) {
    result = result.filter(t => t.category === filters.category)
  }

  if (filters.dateFrom) {
    result = result.filter(t => t.date >= filters.dateFrom)
  }

  if (filters.dateTo) {
    result = result.filter(t => t.date <= filters.dateTo + 'T23:59:59Z')
  }

  result.sort((a, b) => {
    const dir = filters.orderDir === 'asc' ? 1 : -1
    if (filters.orderBy === 'amount') return (a.amount - b.amount) * dir
    if (filters.orderBy === 'title') return a.title.localeCompare(b.title) * dir
    return (a.date < b.date ? -1 : 1) * dir
  })

  return result
}

let mockIdCounter = MOCK_STORE.length + 1

// ─── Service ──────────────────────────────────────────────────────────────────

export const transactionService = {
  async list(filters: TransactionFilters): Promise<Transaction[]> {
    if (import.meta.env.DEV) return applyFilters(MOCK_STORE, filters)
    const response = await apiClient.get<Transaction[]>('/transactions', { params: filters })
    return response.data
  },

  async create(payload: CreateTransactionPayload): Promise<Transaction> {
    if (import.meta.env.DEV) {
      const now = new Date().toISOString()
      const newItem: Transaction = {
        ...payload,
        id: String(mockIdCounter++),
        createdAt: now,
        updatedAt: now,
      }
      MOCK_STORE = [newItem, ...MOCK_STORE]
      return newItem
    }
    const response = await apiClient.post<Transaction>('/transactions', payload)
    return response.data
  },

  async update(payload: UpdateTransactionPayload): Promise<Transaction> {
    if (import.meta.env.DEV) {
      const now = new Date().toISOString()
      MOCK_STORE = MOCK_STORE.map(t =>
        t.id === payload.id ? { ...t, ...payload, updatedAt: now } : t,
      )
      const updated = MOCK_STORE.find(t => t.id === payload.id)
      if (!updated) throw new Error('Transaction not found')
      return updated
    }
    const response = await apiClient.put<Transaction>(`/transactions/${payload.id}`, payload)
    return response.data
  },

  async remove(id: string): Promise<void> {
    if (import.meta.env.DEV) {
      MOCK_STORE = MOCK_STORE.filter(t => t.id !== id)
      return
    }
    await apiClient.delete(`/transactions/${id}`)
  },
}

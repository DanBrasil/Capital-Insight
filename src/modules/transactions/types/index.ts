export type TransactionType = 'income' | 'expense'
export type TransactionStatus = 'completed' | 'pending' | 'cancelled'

export type TransactionOrderBy = 'date' | 'amount' | 'title'
export type OrderDirection = 'asc' | 'desc'

export interface Transaction {
  id: string
  title: string
  type: TransactionType
  amount: number
  category: string
  date: string // ISO 8601
  status: TransactionStatus
  description?: string
  createdAt: string
  updatedAt: string
}

/** Payload sent to the API when creating a new transaction */
export type CreateTransactionPayload = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>

/** Payload sent when updating — all fields optional except id */
export type UpdateTransactionPayload = Partial<CreateTransactionPayload> & { id: string }

/** State for the filter panel — all optional to allow partial filtering */
export interface TransactionFilters {
  search: string
  type: TransactionType | 'all'
  category: string
  dateFrom: string
  dateTo: string
  orderBy: TransactionOrderBy
  orderDir: OrderDirection
}

export const DEFAULT_FILTERS: TransactionFilters = {
  search: '',
  type: 'all',
  category: '',
  dateFrom: '',
  dateTo: '',
  orderBy: 'date',
  orderDir: 'desc',
}

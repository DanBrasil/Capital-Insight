import type { TransactionStatus, TransactionType } from '../types'

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

export function getLabelForType(type: TransactionType): string {
  return type === 'income' ? 'Receita' : 'Despesa'
}

export function getLabelForStatus(status: TransactionStatus): string {
  const map: Record<TransactionStatus, string> = {
    completed: 'Concluída',
    pending: 'Pendente',
    cancelled: 'Cancelada',
  }
  return map[status]
}

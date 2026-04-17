export type DashboardPeriod = 'today' | '7d' | '30d' | 'current-month'

/**
 * A single KPI metric with the value for the current period
 * and the value for the previous period (used to compute variation).
 */
export interface SummaryMetric {
  label: string
  value: number
  previousValue: number
  /** When true, formatters should render the value as currency */
  isCurrency: boolean
}

export interface DashboardSummary {
  balance: SummaryMetric
  income: SummaryMetric
  expenses: SummaryMetric
  transactionCount: SummaryMetric
}

export interface RecentTransaction {
  id: string
  description: string
  /** Always a positive number — use `type` to determine direction */
  amount: number
  type: 'income' | 'expense'
  category: string
  /** ISO 8601 date string */
  date: string
}

export interface ChartDataPoint {
  /** X-axis label (e.g. "Seg", "Sem 1", "09h") */
  label: string
  income: number
  expenses: number
}

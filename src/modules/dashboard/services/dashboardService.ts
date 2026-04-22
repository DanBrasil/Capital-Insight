import { apiClient } from '@/services/api/client'
import { ENDPOINTS } from '@/services/api/constants'

import type { ChartDataPoint, DashboardPeriod, DashboardSummary, RecentTransaction } from '../types'

// ─── Dev mock data ────────────────────────────────────────────────────────────

const MOCK_SUMMARY: Record<DashboardPeriod, DashboardSummary> = {
  today: {
    balance: { label: 'Saldo atual', value: 12450.0, previousValue: 11200.0, isCurrency: true },
    income: { label: 'Receitas', value: 1200.0, previousValue: 980.0, isCurrency: true },
    expenses: { label: 'Despesas', value: 340.0, previousValue: 420.0, isCurrency: true },
    transactionCount: { label: 'Transações', value: 5, previousValue: 4, isCurrency: false },
  },
  '7d': {
    balance: { label: 'Saldo atual', value: 12450.0, previousValue: 10800.0, isCurrency: true },
    income: { label: 'Receitas', value: 6700.0, previousValue: 5900.0, isCurrency: true },
    expenses: { label: 'Despesas', value: 2180.0, previousValue: 2450.0, isCurrency: true },
    transactionCount: { label: 'Transações', value: 18, previousValue: 22, isCurrency: false },
  },
  '30d': {
    balance: { label: 'Saldo atual', value: 12450.0, previousValue: 9200.0, isCurrency: true },
    income: { label: 'Receitas', value: 18200.0, previousValue: 16300.0, isCurrency: true },
    expenses: { label: 'Despesas', value: 5750.0, previousValue: 5940.0, isCurrency: true },
    transactionCount: { label: 'Transações', value: 47, previousValue: 43, isCurrency: false },
  },
  'current-month': {
    balance: { label: 'Saldo atual', value: 12450.0, previousValue: 9200.0, isCurrency: true },
    income: { label: 'Receitas', value: 8400.0, previousValue: 18300.0, isCurrency: true },
    expenses: { label: 'Despesas', value: 3150.0, previousValue: 5940.0, isCurrency: true },
    transactionCount: { label: 'Transações', value: 23, previousValue: 43, isCurrency: false },
  },
}

const MOCK_TRANSACTIONS: RecentTransaction[] = [
  {
    id: '1',
    description: 'Salário',
    amount: 5000,
    type: 'income',
    category: 'Trabalho',
    date: '2026-04-15T10:00:00Z',
  },
  {
    id: '2',
    description: 'Aluguel',
    amount: 1800,
    type: 'expense',
    category: 'Moradia',
    date: '2026-04-14T09:00:00Z',
  },
  {
    id: '3',
    description: 'Freelance',
    amount: 1200,
    type: 'income',
    category: 'Trabalho',
    date: '2026-04-13T14:00:00Z',
  },
  {
    id: '4',
    description: 'Supermercado',
    amount: 380,
    type: 'expense',
    category: 'Alimentação',
    date: '2026-04-12T18:00:00Z',
  },
  {
    id: '5',
    description: 'Internet',
    amount: 120,
    type: 'expense',
    category: 'Serviços',
    date: '2026-04-11T08:00:00Z',
  },
  {
    id: '6',
    description: 'Academia',
    amount: 90,
    type: 'expense',
    category: 'Saúde',
    date: '2026-04-10T07:00:00Z',
  },
  {
    id: '7',
    description: 'Dividendos',
    amount: 350,
    type: 'income',
    category: 'Investimentos',
    date: '2026-04-09T12:00:00Z',
  },
]

const MOCK_CHART: Record<DashboardPeriod, ChartDataPoint[]> = {
  today: [
    { label: '00h', income: 0, expenses: 0 },
    { label: '06h', income: 0, expenses: 120 },
    { label: '09h', income: 5000, expenses: 0 },
    { label: '12h', income: 0, expenses: 380 },
    { label: '15h', income: 1200, expenses: 0 },
    { label: '18h', income: 0, expenses: 340 },
    { label: '21h', income: 0, expenses: 0 },
  ],
  '7d': [
    { label: 'Seg', income: 5000, expenses: 1800 },
    { label: 'Ter', income: 0, expenses: 500 },
    { label: 'Qua', income: 1200, expenses: 380 },
    { label: 'Qui', income: 350, expenses: 120 },
    { label: 'Sex', income: 0, expenses: 210 },
    { label: 'Sab', income: 0, expenses: 90 },
    { label: 'Dom', income: 150, expenses: 80 },
  ],
  '30d': [
    { label: 'Sem 1', income: 6200, expenses: 2300 },
    { label: 'Sem 2', income: 4100, expenses: 1200 },
    { label: 'Sem 3', income: 5800, expenses: 1500 },
    { label: 'Sem 4', income: 2100, expenses: 750 },
  ],
  'current-month': [
    { label: 'Sem 1', income: 5350, expenses: 1800 },
    { label: 'Sem 2', income: 2050, expenses: 1100 },
    { label: 'Atual', income: 1000, expenses: 250 },
  ],
}

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Dashboard API service — pure async functions, no React dependencies.
 * In development mode returns mock data so the UI works without a backend.
 */
export const dashboardService = {
  async getSummary(period: DashboardPeriod): Promise<DashboardSummary> {
    if (import.meta.env.DEV) return MOCK_SUMMARY[period]
    const response = await apiClient.get<DashboardSummary>(ENDPOINTS.dashboard.summary, {
      params: { period },
    })
    return response.data
  },

  async getRecentTransactions(period: DashboardPeriod): Promise<RecentTransaction[]> {
    if (import.meta.env.DEV) return MOCK_TRANSACTIONS
    const response = await apiClient.get<RecentTransaction[]>(
      ENDPOINTS.dashboard.recentTransactions,
      {
        params: { period },
      },
    )
    return response.data
  },

  async getChartData(period: DashboardPeriod): Promise<ChartDataPoint[]> {
    if (import.meta.env.DEV) return MOCK_CHART[period]
    const response = await apiClient.get<ChartDataPoint[]>(ENDPOINTS.dashboard.chart, {
      params: { period },
    })
    return response.data
  },
}

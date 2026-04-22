/**
 * Centralised API endpoint paths.
 *
 * Single source of truth — no path strings scattered across service files.
 * When a backend endpoint changes, only this file needs to be updated.
 *
 * Convention: values are relative paths without a leading /api prefix
 * (baseURL is set in the Axios client).
 */
export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  dashboard: {
    summary: '/dashboard/summary',
    chart: '/dashboard/chart',
    recentTransactions: '/dashboard/transactions/recent',
  },
  transactions: {
    list: '/transactions',
    create: '/transactions',
    update: (id: string) => `/transactions/${id}` as const,
    delete: (id: string) => `/transactions/${id}` as const,
  },
  reports: {
    summary: '/reports/summary',
    export: '/reports/export',
  },
  settings: {
    profile: '/settings/profile',
    preferences: '/settings/preferences',
    password: '/settings/password',
    platform: '/settings/platform',
  },
  portfolio: {
    positions: '/portfolio/positions',
  },
  operations: {
    list: '/operations',
    create: '/operations',
    update: (id: string) => `/operations/${id}` as const,
    delete: (id: string) => `/operations/${id}` as const,
  },
  tenant: {
    config: (tenantId: string) => `/tenants/${tenantId}/config` as const,
  },
} as const

// ─── React Query key factory ──────────────────────────────────────────────────

/**
 * Centralised query key definitions.
 *
 * Using factory functions guarantees:
 * - No string typos when invalidating caches
 * - Hierarchical invalidation works correctly
 *   e.g. invalidate(['transactions']) → also invalidates ['transactions', filters]
 */
export const QUERY_KEYS = {
  // Auth
  authMe: () => ['auth', 'me'] as const,

  // Dashboard
  dashboardSummary: (period: string) => ['dashboard', 'summary', period] as const,
  dashboardChart: (period: string) => ['dashboard', 'chart', period] as const,
  dashboardRecentTransactions: (period: string) => ['dashboard', 'transactions', period] as const,

  // Transactions
  transactions: () => ['transactions'] as const,
  transactionsList: (filters: object) => ['transactions', filters] as const,

  // Portfolio
  portfolio: () => ['portfolio'] as const,

  // Operations
  operations: () => ['operations'] as const,
  operationsList: (filters: object) => ['operations', filters] as const,

  // Reports
  reportData: (filters: object) => ['reports', filters] as const,

  // Settings
  settings: () => ['settings'] as const,

  // Tenant
  tenantConfig: (tenantId: string) => ['tenant', 'config', tenantId] as const,
} as const

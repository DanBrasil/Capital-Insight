/**
 * Centralised route path constants.
 * Import from here instead of writing path strings in components or hooks.
 * Adding a new route = one entry here, one entry in privateRoutes.tsx.
 */
export const ROUTES = {
  login: '/login',
  dashboard: '/dashboard',
  transactions: '/transactions',
  reports: '/reports',
  investments: '/investments',
  portfolio: '/portfolio',
  operations: '/operations',
  aiInsights: '/ai-insights',
  settings: '/settings',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]

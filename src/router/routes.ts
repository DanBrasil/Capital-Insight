import { lazy } from 'react'

import type { FeatureFlag } from '@/tenants'

/**
 * Centralised route path constants.
 * Import from here instead of writing path strings in components or hooks.
 */
export const ROUTES = {
  login: '/login',
  unauthorized: '/unauthorized',
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

// ─── Route definition type ───────────────────────────────────────────────────

export interface AppRouteDefinition {
  path: string
  component: React.LazyExoticComponent<React.ComponentType>
  /** If set, route is only accessible when this feature flag is active */
  requiredFeature?: FeatureFlag
}

// ─── Lazy page factories ─────────────────────────────────────────────────────

const LoginPage = lazy(() => import('@/pages/LoginPage').then(m => ({ default: m.LoginPage })))
const UnauthorizedPage = lazy(() =>
  import('@/pages/UnauthorizedPage').then(m => ({ default: m.UnauthorizedPage })),
)
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })),
)
const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then(m => ({ default: m.DashboardPage })),
)
const TransactionsPage = lazy(() =>
  import('@/pages/TransactionsPage').then(m => ({ default: m.TransactionsPage })),
)
const ReportsPage = lazy(() =>
  import('@/pages/ReportsPage').then(m => ({ default: m.ReportsPage })),
)
const InvestmentsPage = lazy(() =>
  import('@/pages/InvestmentsPage').then(m => ({ default: m.InvestmentsPage })),
)
const PortfolioPage = lazy(() =>
  import('@/pages/PortfolioPage').then(m => ({ default: m.PortfolioPage })),
)
const OperationsPage = lazy(() =>
  import('@/pages/OperationsPage').then(m => ({ default: m.OperationsPage })),
)
const AIInsightsPage = lazy(() =>
  import('@/pages/AIInsightsPage').then(m => ({ default: m.AIInsightsPage })),
)
const SettingsPage = lazy(() =>
  import('@/pages/SettingsPage').then(m => ({ default: m.SettingsPage })),
)

// ─── Public routes ───────────────────────────────────────────────────────────

export const publicRoutes: AppRouteDefinition[] = [
  { path: ROUTES.login, component: LoginPage },
  { path: ROUTES.unauthorized, component: UnauthorizedPage },
]

// ─── Private routes (organized by domain) ────────────────────────────────────

/** Core routes — always available */
const coreRoutes: AppRouteDefinition[] = [
  { path: ROUTES.dashboard, component: DashboardPage },
  { path: ROUTES.transactions, component: TransactionsPage },
  { path: ROUTES.settings, component: SettingsPage },
]

/** Finance module routes */
const financeRoutes: AppRouteDefinition[] = [
  { path: ROUTES.investments, component: InvestmentsPage, requiredFeature: 'investments' },
  { path: ROUTES.portfolio, component: PortfolioPage, requiredFeature: 'portfolio' },
  { path: ROUTES.operations, component: OperationsPage, requiredFeature: 'operations' },
]

/** Analytics module routes */
const analyticsRoutes: AppRouteDefinition[] = [
  { path: ROUTES.reports, component: ReportsPage, requiredFeature: 'reports' },
  { path: ROUTES.aiInsights, component: AIInsightsPage, requiredFeature: 'ai-insights' },
]

/** All private routes — composed from domain groups */
export const privateRoutes: AppRouteDefinition[] = [
  ...coreRoutes,
  ...financeRoutes,
  ...analyticsRoutes,
]

/** Fallback route */
export const fallbackRoute: AppRouteDefinition = {
  path: '*',
  component: NotFoundPage,
}

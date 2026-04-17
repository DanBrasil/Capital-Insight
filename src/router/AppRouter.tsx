import { AIInsightsPage } from '@/pages/AIInsightsPage'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { AuthProvider } from '@/modules/auth'
import { AppShell } from '@/layout/AppShell/AppShell'
import { DashboardPage } from '@/pages/DashboardPage'
import { InvestmentsPage } from '@/pages/InvestmentsPage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { OperationsPage } from '@/pages/OperationsPage'
import { PortfolioPage } from '@/pages/PortfolioPage'
import { ReportsPage } from '@/pages/ReportsPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { TransactionsPage } from '@/pages/TransactionsPage'

import { ProtectedRoute } from './ProtectedRoute'
import { ROUTES } from './routes'

/**
 * Application router.
 *
 * Provider hierarchy inside BrowserRouter:
 *   AuthProvider  — needs router context for useNavigate
 *   TenantProvider (in main.tsx, outside BrowserRouter) — no navigation needed
 *
 * Tree structure:
 *   Public routes  — accessible without authentication
 *   Private routes — wrapped by ProtectedRoute + AppShell
 *
 * To add a new module: add a <Route> inside the private section.
 * No other file needs to change.
 */
export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ── Public ────────────────────────────────────────────── */}
          <Route path={ROUTES.login} element={<LoginPage />} />

          {/* ── Private — requires auth ───────────────────────────── */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route index element={<Navigate to={ROUTES.dashboard} replace />} />
              <Route path={ROUTES.dashboard} element={<DashboardPage />} />
              <Route path={ROUTES.transactions} element={<TransactionsPage />} />
              <Route path={ROUTES.reports} element={<ReportsPage />} />
              <Route path={ROUTES.investments} element={<InvestmentsPage />} />
              <Route path={ROUTES.portfolio} element={<PortfolioPage />} />
              <Route path={ROUTES.operations} element={<OperationsPage />} />
              <Route path={ROUTES.aiInsights} element={<AIInsightsPage />} />
              <Route path={ROUTES.settings} element={<SettingsPage />} />
            </Route>
          </Route>

          {/* ── Fallback ──────────────────────────────────────────── */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

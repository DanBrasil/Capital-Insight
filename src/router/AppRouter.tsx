import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { ErrorBoundary } from '@/components/error'
import { AuthProvider } from '@/modules/auth'
import { AppShell } from '@/layout/AppShell/AppShell'

import { FeatureRoute } from './FeatureRoute'
import { PageSuspense } from './PageSuspense'
import { ProtectedRoute } from './ProtectedRoute'
import {
  ROUTES,
  fallbackRoute,
  privateRoutes,
  publicRoutes,
  type AppRouteDefinition,
} from './routes'

// ─── Route renderers ─────────────────────────────────────────────────────────

function renderPublicRoute(route: AppRouteDefinition) {
  const Component = route.component
  return (
    <Route
      key={route.path}
      path={route.path}
      element={
        <PageSuspense>
          <Component />
        </PageSuspense>
      }
    />
  )
}

function renderPrivateRoute(route: AppRouteDefinition) {
  const Component = route.component
  const element = route.requiredFeature ? (
    <FeatureRoute flag={route.requiredFeature}>
      <Component />
    </FeatureRoute>
  ) : (
    <Component />
  )

  return (
    <Route key={route.path} path={route.path} element={<PageSuspense>{element}</PageSuspense>} />
  )
}

// ─── Router ──────────────────────────────────────────────────────────────────

/**
 * Application router.
 *
 * Provider hierarchy:
 *   TenantProvider (main.tsx)
 *     QueryClientProvider (main.tsx)
 *       BrowserRouter
 *         ErrorBoundary
 *           AuthProvider
 *             Routes
 *
 * Route structure:
 *   Public routes  → no layout, no auth
 *   Private routes → ProtectedRoute guard + AppShell layout
 *   Fallback       → 404 page
 *
 * Adding a new module:
 *   1. Create the page component in src/pages/
 *   2. Add path to ROUTES in routes.ts
 *   3. Add entry to the appropriate domain group (coreRoutes/financeRoutes/analyticsRoutes)
 *   4. No changes to this file needed
 */
export function AppRouter() {
  const FallbackComponent = fallbackRoute.component

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <Routes>
            {/* ── Public ────────────────────────────────────────────── */}
            {publicRoutes.map(renderPublicRoute)}

            {/* ── Private — requires auth ───────────────────────────── */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppShell />}>
                <Route index element={<Navigate to={ROUTES.dashboard} replace />} />
                {privateRoutes.map(renderPrivateRoute)}
              </Route>
            </Route>

            {/* ── Fallback ──────────────────────────────────────────── */}
            <Route
              path={fallbackRoute.path}
              element={
                <PageSuspense>
                  <FallbackComponent />
                </PageSuspense>
              }
            />
          </Routes>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

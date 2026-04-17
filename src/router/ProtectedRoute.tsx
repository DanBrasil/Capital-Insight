import { Navigate, Outlet } from 'react-router-dom'

import { Spinner } from '@/components/ui'
import { useAuth } from '@/modules/auth'

import { ROUTES } from '@/router/routes'

/**
 * Authentication guard for all private routes.
 *
 * - idle / loading → render spinner (prevents flash-of-redirect on page refresh)
 * - authenticated  → render child routes via <Outlet>
 * - anything else  → redirect to /login
 */
export function ProtectedRoute() {
  const { status, isAuthenticated } = useAuth()

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner size="lg" aria-label="Verificando sessão" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />
  }

  return <Outlet />
}

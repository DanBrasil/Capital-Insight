import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/router/routes'

import { useAuth } from './useAuth'

/**
 * Imperative auth guard for use inside page-level hooks or effects.
 * Redirects to /login if the user is not authenticated.
 *
 * Prefer <ProtectedRoute> for route-level protection.
 * Use this hook when a component deep in the tree needs to react to auth loss.
 */
export function useRequireAuth(): void {
  const { isAuthenticated, status } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Only redirect after initial session check is complete
    if (status !== 'idle' && status !== 'loading' && !isAuthenticated) {
      navigate(ROUTES.login, { replace: true })
    }
  }, [isAuthenticated, status, navigate])
}

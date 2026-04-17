import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { useNavigate } from 'react-router-dom'

import { AUTH_UNAUTHORIZED_EVENT } from '@/services/api/client'
import { ROUTES } from '@/router/routes'

import { authService } from '../services/authService'
import { sessionStorage } from '../services/sessionStorage'
import { AuthContext, authReducer, initialAuthState } from '../store/authStore'
import type { LoginCredentials } from '../types'

interface AuthProviderProps {
  children: React.ReactNode
}

/**
 * Authentication provider.
 *
 * Responsibilities:
 * - Restore session on mount (checks localStorage for existing token)
 * - Expose login / logout actions to the component tree
 * - Keep AuthContext up to date
 *
 * Does NOT: render forms, know about pages, or contain business rules.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState)
  const navigate = useNavigate()

  // ── React to forced logout from API interceptor ─────────────────────────
  useEffect(() => {
    function handleUnauthorized() {
      sessionStorage.clearSession()
      dispatch({ type: 'AUTH_LOGOUT' })
      navigate(ROUTES.login, { replace: true })
    }

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
  }, [navigate])

  // ── Session restoration ───────────────────────────────────────────────────
  useEffect(() => {
    async function restoreSession() {
      const token = sessionStorage.getToken()
      const cachedUser = sessionStorage.getUser()

      if (!token || !cachedUser) {
        dispatch({ type: 'AUTH_LOGOUT' })
        return
      }

      dispatch({ type: 'AUTH_LOADING' })
      try {
        // Validate token with backend to ensure it hasn't expired
        const user = await authService.fetchCurrentUser()
        dispatch({ type: 'AUTH_SUCCESS', user, token })
      } catch {
        sessionStorage.clearSession()
        dispatch({ type: 'AUTH_LOGOUT' })
      }
    }

    restoreSession()
  }, [])

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      dispatch({ type: 'AUTH_LOADING' })
      try {
        const { user, token } = await authService.login(credentials)
        sessionStorage.saveSession(token, user)
        dispatch({ type: 'AUTH_SUCCESS', user, token })
        navigate(ROUTES.dashboard, { replace: true })
      } catch (error) {
        // parseApiError in the interceptor ensures error has a .message string
        const message =
          error != null && typeof error === 'object' && 'message' in error
            ? String((error as { message: unknown }).message)
            : 'Credenciais inválidas. Tente novamente.'
        dispatch({ type: 'AUTH_FAILURE', error: message })
      }
    },
    [navigate],
  )

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await authService.logout()
    sessionStorage.clearSession()
    dispatch({ type: 'AUTH_LOGOUT' })
    navigate(ROUTES.login, { replace: true })
  }, [navigate])

  // ── Context value — memoized to prevent unnecessary re-renders ────────────
  const contextValue = useMemo(
    () => ({
      ...state,
      login,
      logout,
      isAuthenticated: state.status === 'authenticated',
    }),
    [state, login, logout],
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

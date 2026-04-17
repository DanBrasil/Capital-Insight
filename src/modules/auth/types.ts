export interface AuthUser {
  id: string
  name: string
  email: string
  /** Role is informational on the frontend — real authorization lives in the backend */
  role: 'admin' | 'manager' | 'viewer'
  tenantId: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: AuthUser
  token: string
}

/**
 * Explicit status union — prevents impossible states like loading=true + user!=null.
 *
 * idle          → app just started, session not yet checked
 * loading       → async operation in progress (login or session restore)
 * authenticated → user is logged in, token is valid
 * unauthenticated → no session or session expired
 * error         → last auth operation failed (shows error message)
 */
export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error'

export interface AuthState {
  status: AuthStatus
  user: AuthUser | null
  token: string | null
  error: string | null
}

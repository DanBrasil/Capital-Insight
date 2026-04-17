import { createContext } from 'react'

import type { AuthState, AuthUser, LoginCredentials } from '../types'

// ─── Actions ─────────────────────────────────────────────────────────────────

export type AuthAction =
  | { type: 'AUTH_LOADING' }
  | { type: 'AUTH_SUCCESS'; user: AuthUser; token: string }
  | { type: 'AUTH_FAILURE'; error: string }
  | { type: 'AUTH_LOGOUT' }

// ─── Initial state ────────────────────────────────────────────────────────────

export const initialAuthState: AuthState = {
  status: 'idle',
  user: null,
  token: null,
  error: null,
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

/**
 * Pure function — easy to test without rendering anything.
 * Each action maps to exactly one valid state, preventing impossible combinations.
 */
export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_LOADING':
      return { ...state, status: 'loading', error: null }

    case 'AUTH_SUCCESS':
      return {
        status: 'authenticated',
        user: action.user,
        token: action.token,
        error: null,
      }

    case 'AUTH_FAILURE':
      return {
        status: 'error',
        user: null,
        token: null,
        error: action.error,
      }

    case 'AUTH_LOGOUT':
      return {
        status: 'unauthenticated',
        user: null,
        token: null,
        error: null,
      }

    default:
      return state
  }
}

// ─── Context contract ─────────────────────────────────────────────────────────

export interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextValue | null>(null)

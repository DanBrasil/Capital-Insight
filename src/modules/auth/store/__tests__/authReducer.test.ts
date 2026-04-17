/**
 * Unit tests for authReducer.
 *
 * The reducer is a pure function that manages every possible auth state
 * transition. Testing it in isolation (no DOM, no HTTP) is cheap and gives
 * high confidence because it covers the state machine at its core.
 *
 * A bug in the reducer can silently allow unauthenticated users into protected
 * routes or prevent valid users from completing login.
 */
import { describe, expect, it } from 'vitest'

import { authReducer, initialAuthState } from '../authStore'
import type { AuthAction } from '../authStore'
import type { AuthState, AuthUser } from '../../types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const mockUser: AuthUser = {
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'admin',
  tenantId: 'default',
}

function reduce(state: AuthState, action: AuthAction): AuthState {
  return authReducer(state, action)
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('authReducer — initial state', () => {
  it('starts with status "idle"', () => {
    expect(initialAuthState.status).toBe('idle')
  })

  it('starts with null user, token, and error', () => {
    expect(initialAuthState.user).toBeNull()
    expect(initialAuthState.token).toBeNull()
    expect(initialAuthState.error).toBeNull()
  })
})

describe('authReducer — AUTH_LOADING', () => {
  it('transitions status to "loading"', () => {
    const next = reduce(initialAuthState, { type: 'AUTH_LOADING' })
    expect(next.status).toBe('loading')
  })

  it('clears any previous error', () => {
    const errorState: AuthState = { ...initialAuthState, status: 'error', error: 'Wrong password' }
    const next = reduce(errorState, { type: 'AUTH_LOADING' })
    expect(next.error).toBeNull()
  })

  it('preserves existing user during loading (session restore scenario)', () => {
    const authedState: AuthState = {
      status: 'authenticated',
      user: mockUser,
      token: 'old-token',
      error: null,
    }
    const next = reduce(authedState, { type: 'AUTH_LOADING' })
    expect(next.user).toBe(mockUser)
  })
})

describe('authReducer — AUTH_SUCCESS', () => {
  it('transitions status to "authenticated"', () => {
    const next = reduce(initialAuthState, {
      type: 'AUTH_SUCCESS',
      user: mockUser,
      token: 'token-xyz',
    })
    expect(next.status).toBe('authenticated')
  })

  it('sets user and token from the action', () => {
    const next = reduce(initialAuthState, {
      type: 'AUTH_SUCCESS',
      user: mockUser,
      token: 'token-xyz',
    })
    expect(next.user).toBe(mockUser)
    expect(next.token).toBe('token-xyz')
  })

  it('clears any previous error', () => {
    const errorState: AuthState = { ...initialAuthState, status: 'error', error: 'Previous error' }
    const next = reduce(errorState, {
      type: 'AUTH_SUCCESS',
      user: mockUser,
      token: 'token-xyz',
    })
    expect(next.error).toBeNull()
  })
})

describe('authReducer — AUTH_FAILURE', () => {
  it('transitions status to "error"', () => {
    const loading: AuthState = { ...initialAuthState, status: 'loading' }
    const next = reduce(loading, { type: 'AUTH_FAILURE', error: 'Credenciais inválidas' })
    expect(next.status).toBe('error')
  })

  it('stores the error message', () => {
    const next = reduce(initialAuthState, { type: 'AUTH_FAILURE', error: 'Credenciais inválidas' })
    expect(next.error).toBe('Credenciais inválidas')
  })

  it('clears user and token on failure', () => {
    const authedState: AuthState = {
      status: 'authenticated',
      user: mockUser,
      token: 'token-xyz',
      error: null,
    }
    const next = reduce(authedState, { type: 'AUTH_FAILURE', error: 'Session expired' })
    expect(next.user).toBeNull()
    expect(next.token).toBeNull()
  })
})

describe('authReducer — AUTH_LOGOUT', () => {
  it('transitions status to "unauthenticated"', () => {
    const authedState: AuthState = {
      status: 'authenticated',
      user: mockUser,
      token: 'token-xyz',
      error: null,
    }
    const next = reduce(authedState, { type: 'AUTH_LOGOUT' })
    expect(next.status).toBe('unauthenticated')
  })

  it('clears user and token', () => {
    const authedState: AuthState = {
      status: 'authenticated',
      user: mockUser,
      token: 'token-xyz',
      error: null,
    }
    const next = reduce(authedState, { type: 'AUTH_LOGOUT' })
    expect(next.user).toBeNull()
    expect(next.token).toBeNull()
  })

  it('clears error', () => {
    const errorState: AuthState = {
      ...initialAuthState,
      status: 'error',
      error: 'Expired',
    }
    const next = reduce(errorState, { type: 'AUTH_LOGOUT' })
    expect(next.error).toBeNull()
  })
})

describe('authReducer — state machine completeness', () => {
  it('returns current state for an unrecognised action type', () => {
    // @ts-expect-error — intentionally passing an invalid action to test the default branch
    const next = reduce(initialAuthState, { type: 'UNKNOWN_ACTION' })
    expect(next).toBe(initialAuthState)
  })

  it('does not mutate the previous state object', () => {
    const prev = { ...initialAuthState }
    reduce(initialAuthState, { type: 'AUTH_LOADING' })
    expect(initialAuthState).toEqual(prev)
  })
})

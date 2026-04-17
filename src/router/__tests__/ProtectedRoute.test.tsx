/**
 * Behavior tests for ProtectedRoute.
 *
 * ProtectedRoute is the security boundary between public and private pages.
 * A bug here can either:
 * - Allow unauthenticated users into protected routes (security issue)
 * - Permanently block authenticated users from their dashboard (UX regression)
 *
 * Testing approach:
 * - Mock AuthContext directly — no need for real AuthProvider or HTTP calls
 * - Use MemoryRouter to simulate navigation
 * - Test observable behavior: what the user sees, not internal implementation
 */
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { AuthContext } from '@/modules/auth/store/authStore'
import type { AuthContextValue } from '@/modules/auth/store/authStore'
import { ProtectedRoute } from '@/router/ProtectedRoute'
import { ROUTES } from '@/router/routes'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const mockUser = {
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'admin' as const,
  tenantId: 'default',
}

function makeAuthContext(overrides: Partial<AuthContextValue>): AuthContextValue {
  return {
    status: 'authenticated',
    user: mockUser,
    token: 'test-token',
    error: null,
    isAuthenticated: true,
    login: async () => {},
    logout: async () => {},
    ...overrides,
  }
}

/**
 * Renders ProtectedRoute inside a test router that also has:
 * - A /dashboard route to land on if authenticated
 * - A /login route to redirect to if not authenticated
 */
function renderProtectedRoute(authValue: AuthContextValue, initialPath = '/dashboard') {
  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Dashboard Content</div>} />
          </Route>
          <Route path={ROUTES.login} element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  )
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('ProtectedRoute', () => {
  it('renders child route when user is authenticated', () => {
    renderProtectedRoute(makeAuthContext({ status: 'authenticated', isAuthenticated: true }))

    expect(screen.getByText('Dashboard Content')).toBeInTheDocument()
  })

  it('redirects to /login when user is unauthenticated', () => {
    renderProtectedRoute(
      makeAuthContext({
        status: 'unauthenticated',
        isAuthenticated: false,
        user: null,
        token: null,
      }),
    )

    // User sees the login page, not the protected content
    expect(screen.getByText('Login Page')).toBeInTheDocument()
    expect(screen.queryByText('Dashboard Content')).not.toBeInTheDocument()
  })

  it('shows a loading spinner when status is "loading" (prevents flash-of-redirect)', () => {
    renderProtectedRoute(
      makeAuthContext({
        status: 'loading',
        isAuthenticated: false,
        user: null,
        token: null,
      }),
    )

    // Should not redirect to login while session is being verified
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument()
    expect(screen.queryByText('Dashboard Content')).not.toBeInTheDocument()
    // Spinner is rendered — the Spinner component renders with its own aria-label
    expect(screen.getByRole('status')).toBeInTheDocument()
    // And the protected content + login page are both absent
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument()
  })

  it('shows a loading spinner when status is "idle" (app just started)', () => {
    renderProtectedRoute(
      makeAuthContext({
        status: 'idle',
        isAuthenticated: false,
        user: null,
        token: null,
      }),
    )

    expect(screen.queryByText('Login Page')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('redirects to /login when status is "error"', () => {
    renderProtectedRoute(
      makeAuthContext({
        status: 'error',
        isAuthenticated: false,
        user: null,
        token: null,
        error: 'Session expired',
      }),
    )

    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })
})

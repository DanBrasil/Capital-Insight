import { apiClient } from '@/services/api/client'

import type { LoginCredentials, LoginResponse } from '../types'

// ─── Dev mock ─────────────────────────────────────────────────────────────────

const DEV_CREDENTIALS = { email: 'admin@demo.com', password: 'admin123' }

const DEV_MOCK_RESPONSE: LoginResponse = {
  token: 'dev-token',
  user: {
    id: '1',
    name: 'Admin Demo',
    email: DEV_CREDENTIALS.email,
    role: 'admin',
    tenantId: 'default',
  },
}

function isDevMode() {
  return import.meta.env.DEV
}

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Auth API service — pure async functions with no React dependencies.
 * Testable in isolation; swappable without touching the provider or store.
 *
 * In development (no backend), use:
 *   email:    admin@demo.com
 *   password: admin123
 */
export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    if (
      isDevMode() &&
      credentials.email === DEV_CREDENTIALS.email &&
      credentials.password === DEV_CREDENTIALS.password
    ) {
      return DEV_MOCK_RESPONSE
    }

    const response = await apiClient.post<LoginResponse>('/auth/login', credentials)
    return response.data
  },

  async logout(): Promise<void> {
    if (isDevMode()) return
    await apiClient.post('/auth/logout').catch(() => undefined)
  },

  async fetchCurrentUser(): Promise<LoginResponse['user']> {
    if (isDevMode() && localStorage.getItem('auth_token') === 'dev-token') {
      return DEV_MOCK_RESPONSE.user
    }

    const response = await apiClient.get<LoginResponse['user']>('/auth/me')
    return response.data
  },
}

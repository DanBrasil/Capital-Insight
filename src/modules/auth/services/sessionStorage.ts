import type { AuthUser } from '../types'

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

/**
 * Isolated persistence layer for auth session.
 *
 * Centralising all localStorage access here means:
 * - Migrating to httpOnly cookies requires changes only in this file
 * - The rest of the auth module stays untouched
 * - Easy to mock in tests
 */
export const sessionStorage = {
  saveSession(token: string, user: AuthUser): void {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },

  getUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(USER_KEY)
      if (!raw) return null
      return JSON.parse(raw) as AuthUser
    } catch {
      return null
    }
  },

  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },

  hasSession(): boolean {
    return Boolean(localStorage.getItem(TOKEN_KEY))
  },
}

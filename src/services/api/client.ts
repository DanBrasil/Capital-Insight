import axios from 'axios'

import { notificationService } from '@/notifications'

import { parseApiError } from './errors'

/**
 * Custom DOM event dispatched when the API returns 401.
 * AuthProvider listens for this and triggers logout + navigation
 * without the HTTP client needing to know about React Router.
 */
export const AUTH_UNAUTHORIZED_EVENT = 'auth:unauthorized'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 15_000, // 15 s — prevents requests hanging indefinitely
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Request interceptor ──────────────────────────────────────────────────────

apiClient.interceptors.request.use(config => {
  // Inject Bearer token
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // Inject tenant ID header so the backend can scope data correctly
  const tenantId = localStorage.getItem('tenant_id') ?? import.meta.env.VITE_TENANT_ID
  if (tenantId) {
    config.headers['X-Tenant-ID'] = tenantId
  }

  return config
})

// ─── Response interceptor ─────────────────────────────────────────────────────

apiClient.interceptors.response.use(
  response => response,
  error => {
    const status: number | undefined = error.response?.status

    if (status === 401) {
      // Dispatch a DOM event instead of redirecting directly.
      // This keeps the HTTP client decoupled from React Router.
      // AuthProvider listens for this event and handles logout + navigation.
      window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT))
    } else if (status === undefined) {
      // Network error / timeout — no HTTP response received
      notificationService.error(
        'Não foi possível conectar ao servidor. Verifique sua conexão.',
      )
    } else if (status >= 500) {
      // Server errors — unexpected; surface a generic message globally.
      // Specific 4xx errors (400, 422) are handled by each mutation's onError.
      notificationService.error(
        'Ocorreu um erro no servidor. Tente novamente em instantes.',
      )
    }

    // Normalise the error shape so every caller receives an AppError
    return Promise.reject(parseApiError(error))
  },
)

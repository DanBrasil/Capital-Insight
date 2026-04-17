/**
 * Integration tests for the apiClient interceptors.
 *
 * These tests verify the behavior of the Axios interceptors, which are
 * critical infrastructure:
 * - Request interceptor: injects auth token and tenant ID headers
 * - Response interceptor: dispatches auth:unauthorized event on 401
 *
 * MSW is used to intercept HTTP at the network level, ensuring the
 * interceptors themselves are fully exercised (unlike mocking axios directly).
 *
 * Note: import.meta.env.DEV is true in Vitest. The authService uses DEV mocks.
 * These tests target the apiClient directly to bypass that layer.
 */
import { http, HttpResponse } from 'msw'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { apiClient, AUTH_UNAUTHORIZED_EVENT } from '../client'
import { server } from '@/test/mocks/server'

describe('apiClient — request interceptor', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('attaches Authorization header when token is in localStorage', async () => {
    localStorage.setItem('auth_token', 'my-test-token')

    let capturedAuthHeader: string | null = null

    server.use(
      http.get('/api/test-auth', ({ request }) => {
        capturedAuthHeader = request.headers.get('Authorization')
        return HttpResponse.json({ ok: true })
      }),
    )

    await apiClient.get('/test-auth')

    expect(capturedAuthHeader).toBe('Bearer my-test-token')
  })

  it('omits Authorization header when no token is stored', async () => {
    let capturedAuthHeader: string | null = null

    server.use(
      http.get('/api/test-no-auth', ({ request }) => {
        capturedAuthHeader = request.headers.get('Authorization')
        return HttpResponse.json({ ok: true })
      }),
    )

    await apiClient.get('/test-no-auth')

    expect(capturedAuthHeader).toBeNull()
  })

  it('attaches X-Tenant-ID header when tenantId is in localStorage', async () => {
    localStorage.setItem('tenant_id', 'acme-corp')

    let capturedTenantHeader: string | null = null

    server.use(
      http.get('/api/test-tenant', ({ request }) => {
        capturedTenantHeader = request.headers.get('X-Tenant-ID')
        return HttpResponse.json({ ok: true })
      }),
    )

    await apiClient.get('/test-tenant')

    expect(capturedTenantHeader).toBe('acme-corp')
  })
})

describe('apiClient — response interceptor (401 handling)', () => {
  it('dispatches auth:unauthorized CustomEvent when API returns 401', async () => {
    server.use(
      http.get('/api/test-401', () => {
        return new HttpResponse(null, { status: 401 })
      }),
    )

    const handler = vi.fn()
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handler)

    // The interceptor dispatches the event and rejects the promise — we catch
    // to prevent the test from failing due to the expected error
    try {
      await apiClient.get('/test-401')
    } catch {
      // Expected — the response interceptor rejects with a normalized AppError
    }

    expect(handler).toHaveBeenCalledOnce()

    window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handler)
  })

  it('does NOT dispatch auth:unauthorized for non-401 errors', async () => {
    server.use(
      http.get('/api/test-500', () => {
        return new HttpResponse(null, { status: 500 })
      }),
    )

    const handler = vi.fn()
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handler)

    try {
      await apiClient.get('/test-500')
    } catch {
      // Expected
    }

    expect(handler).not.toHaveBeenCalled()

    window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handler)
  })

  it('rejects with a normalised error shape for API errors', async () => {
    server.use(
      http.get('/api/test-error', () => {
        return HttpResponse.json({ message: 'Resource not found' }, { status: 404 })
      }),
    )

    await expect(apiClient.get('/test-error')).rejects.toMatchObject({
      message: expect.any(String),
    })
  })
})

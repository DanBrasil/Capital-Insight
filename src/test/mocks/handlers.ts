/**
 * MSW request handlers — default happy-path responses.
 *
 * These are the baselines. Individual tests that need error or edge-case
 * responses call `server.use(http.post(...))` to override locally.
 *
 * All values here are intentionally minimal — just enough to satisfy the shape
 * expected by the application layer.
 */
import { http, HttpResponse } from 'msw'

// ─── Auth endpoints ───────────────────────────────────────────────────────────

export const handlers = [
  http.post('/api/auth/login', () => {
    return HttpResponse.json({
      token: 'test-token-xyz',
      user: {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin',
        tenantId: 'default',
      },
    })
  }),

  http.post('/api/auth/logout', () => {
    return new HttpResponse(null, { status: 204 })
  }),

  http.get('/api/auth/me', () => {
    return HttpResponse.json({
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'admin',
      tenantId: 'default',
    })
  }),

  // ─── Reports endpoints ────────────────────────────────────────────────────

  http.get('/api/reports/summary', () => {
    return HttpResponse.json({
      totalInvested: 50000,
      currentValue: 55000,
    })
  }),
]

/**
 * Test render helper with tenant context.
 *
 * Wraps the component-under-test with:
 * - TenantContext (synchronous mock — no async fetch)
 * - QueryClientProvider (fresh client per test to prevent state leakage)
 *
 * For tests that also need routing, pass `wrapper` in renderOptions or wrap
 * the ui argument in a MemoryRouter before passing it here.
 *
 * @example
 * // Basic usage
 * renderWithTenant(<MyComponent />)
 *
 * @example
 * // With specific feature flags
 * renderWithTenant(<ReportsView />, {
 *   tenantValue: makeTenantWithFeatures(['reports']),
 * })
 *
 * @example
 * // With routing
 * import { MemoryRouter } from 'react-router-dom'
 * renderWithTenant(
 *   <MemoryRouter initialEntries={['/dashboard']}>
 *     <Routes><Route path="/dashboard" element={<DashboardPage />} /></Routes>
 *   </MemoryRouter>
 * )
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { RenderOptions, RenderResult } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'

import { TenantContext } from '@/tenants/providers/TenantProvider'
import type { TenantContextValue } from '@/tenants/providers/TenantProvider'

import { makeTenantContextValue } from '../fixtures/tenant'

interface RenderWithTenantOptions extends Omit<RenderOptions, 'wrapper'> {
  /** Override parts of the TenantContextValue (tenant, isLoading, hasError) */
  tenantValue?: Partial<TenantContextValue> | TenantContextValue
}

function makeTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Disable retries in tests — errors should surface immediately
        retry: false,
        // Prevent stale closures from leaking between tests
        gcTime: 0,
      },
      mutations: { retry: false },
    },
  })
}

export function renderWithTenant(
  ui: ReactElement,
  { tenantValue, ...options }: RenderWithTenantOptions = {},
): RenderResult {
  const queryClient = makeTestQueryClient()
  const contextValue =
    tenantValue && 'tenant' in tenantValue && 'isLoading' in tenantValue
      ? (tenantValue as TenantContextValue)
      : makeTenantContextValue(tenantValue as Partial<TenantContextValue>)

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <TenantContext.Provider value={contextValue}>{children}</TenantContext.Provider>
      </QueryClientProvider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...options })
}

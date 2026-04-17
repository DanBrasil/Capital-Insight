import { loadTenantConfig } from './registry'
import type { TenantConfig } from './types'

/**
 * Resolves the active tenant ID using a priority chain:
 * 1. VITE_TENANT_ID env variable  → local development
 * 2. URL subdomain                → production (e.g. acme.app.com)
 * 3. Fallback "default"           → catch-all
 *
 * This function is pure and has no side-effects — easy to unit test.
 */
export function resolveTenantId(): string {
  const envTenantId = import.meta.env.VITE_TENANT_ID as string | undefined
  if (envTenantId) return envTenantId

  const hostname = window.location.hostname
  const subdomain = hostname.split('.')[0]
  const isRootOrLocal = subdomain === 'localhost' || subdomain === 'www' || subdomain === 'app'
  if (!isRootOrLocal) return subdomain

  return 'default'
}

/**
 * Resolves the tenant ID and loads its full configuration.
 * Throws on load failure so TenantProvider can catch and fall back gracefully.
 */
export async function fetchActiveTenantConfig(): Promise<TenantConfig> {
  const tenantId = resolveTenantId()
  return loadTenantConfig(tenantId)
}

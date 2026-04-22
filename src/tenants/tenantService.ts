import { apiClient } from '@/services/api'
import { ENDPOINTS } from '@/services/api/constants'

import { loadTenantConfig } from './registry'
import { cacheTenant, getCachedTenant } from './tenantCache'
import type { TenantConfig } from './types'

const TENANT_ID_STORAGE_KEY = 'tenant_id'

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
 * Persists the resolved tenant ID in localStorage so the API client
 * can inject it as X-Tenant-ID header on every request.
 */
export function persistTenantId(tenantId: string): void {
  localStorage.setItem(TENANT_ID_STORAGE_KEY, tenantId)
}

/**
 * Fetches tenant config from the backend API.
 * Returns null on failure — caller should fall back to local registry.
 */
async function fetchTenantConfigFromAPI(tenantId: string): Promise<TenantConfig | null> {
  try {
    const { data } = await apiClient.get<TenantConfig>(ENDPOINTS.tenant.config(tenantId))
    return data
  } catch {
    return null
  }
}

/**
 * Resolves the tenant ID and loads its full configuration.
 *
 * Resolution priority:
 * 1. sessionStorage cache (avoids re-fetch on navigation)
 * 2. Remote API (source of truth in production)
 * 3. Local registry (offline fallback / development)
 *
 * Side-effects: persists tenant ID to localStorage, caches config.
 */
export async function fetchActiveTenantConfig(): Promise<TenantConfig> {
  const tenantId = resolveTenantId()

  // 1. Check cache
  const cached = getCachedTenant(tenantId)
  if (cached) {
    persistTenantId(tenantId)
    return cached
  }

  // 2. Try remote API
  const remote = await fetchTenantConfigFromAPI(tenantId)
  if (remote) {
    persistTenantId(remote.id)
    cacheTenant(remote)
    return remote
  }

  // 3. Fall back to local registry
  const local = await loadTenantConfig(tenantId)
  persistTenantId(local.id)
  cacheTenant(local)
  return local
}

import type { TenantConfig } from './types'

const CACHE_KEY = 'tenant_config'
const CACHE_TTL_MS = 1000 * 60 * 30 // 30 minutes

interface CachedTenant {
  config: TenantConfig
  timestamp: number
}

/**
 * Reads cached tenant config from sessionStorage.
 * Returns null if cache is missing, expired, or corrupted.
 */
export function getCachedTenant(tenantId: string): TenantConfig | null {
  try {
    const raw = sessionStorage.getItem(`${CACHE_KEY}:${tenantId}`)
    if (!raw) return null

    const cached: CachedTenant = JSON.parse(raw)
    const isExpired = Date.now() - cached.timestamp > CACHE_TTL_MS

    if (isExpired) {
      sessionStorage.removeItem(`${CACHE_KEY}:${tenantId}`)
      return null
    }

    return cached.config
  } catch {
    return null
  }
}

/**
 * Stores tenant config in sessionStorage with a timestamp for TTL checks.
 */
export function cacheTenant(config: TenantConfig): void {
  try {
    const entry: CachedTenant = { config, timestamp: Date.now() }
    sessionStorage.setItem(`${CACHE_KEY}:${config.id}`, JSON.stringify(entry))
  } catch {
    // Quota exceeded or disabled — silently ignore
  }
}

/**
 * Clears cached config for a specific tenant (or all tenants).
 */
export function clearTenantCache(tenantId?: string): void {
  if (tenantId) {
    sessionStorage.removeItem(`${CACHE_KEY}:${tenantId}`)
    return
  }

  // Clear all tenant cache entries
  const keysToRemove: string[] = []
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i)
    if (key?.startsWith(CACHE_KEY)) {
      keysToRemove.push(key)
    }
  }
  keysToRemove.forEach(key => sessionStorage.removeItem(key))
}

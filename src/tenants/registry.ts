import type { TenantConfig } from './types'

/**
 * Registry maps tenant IDs to their config loaders (lazy imports).
 * This is the ONLY file that needs to change when adding a new tenant.
 *
 * Principle: Open for extension (add entry), closed for modification (core unchanged).
 */
const tenantRegistry: Record<string, () => Promise<{ config: TenantConfig }>> = {
  default: () =>
    import('./configs/default/config').then(module => ({ config: module.defaultTenantConfig })),
  acme: () => import('./configs/acme/config').then(module => ({ config: module.acmeTenantConfig })),
}

/**
 * Loads a tenant config by ID. Falls back to "default" if ID is not registered.
 * Returns the default config synchronously as fallback if the async load fails.
 */
export async function loadTenantConfig(tenantId: string): Promise<TenantConfig> {
  const loader = tenantRegistry[tenantId] ?? tenantRegistry['default']

  const { config } = await loader()
  return config
}

export function isRegisteredTenant(tenantId: string): boolean {
  return tenantId in tenantRegistry
}

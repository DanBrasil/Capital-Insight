/**
 * Shared tenant fixtures for tests.
 *
 * Use `makeTenantContextValue` instead of importing the real TenantProvider,
 * which would trigger async network calls. This keeps component tests
 * synchronous and isolated.
 */
import { defaultTenantConfig } from '@/tenants/configs/default/config'
import type { TenantContextValue } from '@/tenants/providers/TenantProvider'
import type { TenantConfig } from '@/tenants/types'

/**
 * Returns a stable, synchronous TenantContextValue.
 * Pass overrides to test feature-flag-specific or theme-specific behavior.
 */
export function makeTenantContextValue(
  overrides: Partial<TenantContextValue> = {},
): TenantContextValue {
  return {
    tenant: defaultTenantConfig,
    isLoading: false,
    hasError: false,
    ...overrides,
  }
}

/**
 * Returns a TenantConfig with specific features enabled.
 * Useful for testing FeatureGate and feature-conditional rendering.
 *
 * @example
 * makeTenantWithFeatures(['reports', 'portfolio'])
 */
export function makeTenantWithFeatures(features: TenantConfig['features']): TenantContextValue {
  return makeTenantContextValue({
    tenant: { ...defaultTenantConfig, features },
  })
}

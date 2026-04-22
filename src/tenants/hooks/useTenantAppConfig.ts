import type { TenantAppConfig } from '../types'
import { useTenant } from './useTenant'

/**
 * Convenience hook to access the active tenant's application config.
 * Useful for currency formatting, locale, and support email.
 *
 * @example
 * const { currencyCode, locale } = useTenantAppConfig()
 */
export function useTenantAppConfig(): TenantAppConfig {
  const { tenant } = useTenant()
  return tenant.appConfig
}

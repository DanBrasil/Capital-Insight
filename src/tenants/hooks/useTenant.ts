import { useContext } from 'react'

import { TenantContext } from '../providers/TenantProvider'
import type { TenantContextValue } from '../providers/TenantProvider'

/**
 * Access the active tenant context from any component.
 * Throws a descriptive error if used outside TenantProvider.
 */
export function useTenant(): TenantContextValue {
  const context = useContext(TenantContext)
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  return context
}

import { useContext } from 'react'

import { AuthContext } from '../store/authStore'
import type { AuthContextValue } from '../store/authStore'

/**
 * Access the authentication context from any component.
 * Throws a descriptive error if used outside AuthProvider.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

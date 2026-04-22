import { createContext, useEffect, useReducer } from 'react'

import { defaultTenantConfig } from '../configs/default/config'
import { fetchActiveTenantConfig } from '../tenantService'
import { applyTenantTheme } from '../themeService'
import type { TenantConfig } from '../types'

import { TenantBootstrap } from './TenantBootstrap'

// ─── Context contract ────────────────────────────────────────────────────────

export interface TenantContextValue {
  tenant: TenantConfig
  isLoading: boolean
  hasError: boolean
}

export const TenantContext = createContext<TenantContextValue | null>(null)

// ─── Reducer — avoids race conditions from multiple setState calls ────────────

type TenantState = Omit<TenantContextValue, never>

type TenantAction = { type: 'RESOLVED'; tenant: TenantConfig } | { type: 'FAILED' }

function tenantReducer(state: TenantState, action: TenantAction): TenantState {
  switch (action.type) {
    case 'RESOLVED':
      return { tenant: action.tenant, isLoading: false, hasError: false }
    case 'FAILED':
      return { tenant: defaultTenantConfig, isLoading: false, hasError: true }
    default:
      return state
  }
}

const initialState: TenantState = {
  tenant: defaultTenantConfig,
  isLoading: true,
  hasError: false,
}

// ─── Provider ────────────────────────────────────────────────────────────────

interface TenantProviderProps {
  children: React.ReactNode
}

/**
 * Thin provider: orchestrates services, holds state, exposes context.
 * Has no knowledge of how tenants are identified or how themes are applied.
 *
 * Loading gate: children are NOT rendered until tenant is resolved.
 * This prevents flash of default theme and ensures all downstream
 * components can safely read tenant data on first render.
 */
export function TenantProvider({ children }: TenantProviderProps) {
  const [state, dispatch] = useReducer(tenantReducer, initialState)

  useEffect(() => {
    let isCancelled = false

    async function initializeTenant() {
      try {
        const config = await fetchActiveTenantConfig()
        if (!isCancelled) {
          applyTenantTheme(config.theme)
          dispatch({ type: 'RESOLVED', tenant: config })
        }
      } catch {
        if (!isCancelled) {
          applyTenantTheme(defaultTenantConfig.theme)
          dispatch({ type: 'FAILED' })
        }
      }
    }

    initializeTenant()
    return () => {
      isCancelled = true
    }
  }, [])

  // Loading gate — show bootstrap screen while resolving tenant
  if (state.isLoading) {
    return <TenantBootstrap />
  }

  return <TenantContext.Provider value={state}>{children}</TenantContext.Provider>
}

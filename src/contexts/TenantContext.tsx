import { createContext, useContext, useEffect, useState } from 'react'

import { defaultTenantConfig } from '@/tenants/default/config'
import type { TenantConfig } from '@/tenants/types'

interface TenantContextValue {
  tenant: TenantConfig
  isLoading: boolean
}

const TenantContext = createContext<TenantContextValue | null>(null)

function applyTenantTheme(theme: TenantConfig['theme']): void {
  const root = document.documentElement
  root.style.setProperty('--color-primary', theme.colorPrimary)
  root.style.setProperty('--color-primary-foreground', theme.colorPrimaryForeground)
  root.style.setProperty('--color-secondary', theme.colorSecondary)
  root.style.setProperty('--color-secondary-foreground', theme.colorSecondaryForeground)
  root.style.setProperty('--color-background', theme.colorBackground)
  root.style.setProperty('--color-foreground', theme.colorForeground)
  root.style.setProperty('--color-muted', theme.colorMuted)
  root.style.setProperty('--color-muted-foreground', theme.colorMutedForeground)
  root.style.setProperty('--color-border', theme.colorBorder)
  root.style.setProperty('--color-input', theme.colorBorder)
  root.style.setProperty('font-family', theme.fontFamily)
}

function resolveTenantId(): string {
  const hostname = window.location.hostname
  const subdomain = hostname.split('.')[0]
  const isLocalOrDefault = subdomain === 'localhost' || subdomain === 'www'
  return isLocalOrDefault ? 'default' : subdomain
}

interface TenantProviderProps {
  children: React.ReactNode
}

export function TenantProvider({ children }: TenantProviderProps) {
  const [tenant, setTenant] = useState<TenantConfig>(defaultTenantConfig)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const tenantId = resolveTenantId()

    async function loadTenantConfig() {
      try {
        // In a real scenario: fetch from API based on tenantId
        // const config = await tenantService.fetchConfig(tenantId)
        const config = tenantId === 'default' ? defaultTenantConfig : defaultTenantConfig
        applyTenantTheme(config.theme)
        setTenant(config)
      } catch {
        applyTenantTheme(defaultTenantConfig.theme)
        setTenant(defaultTenantConfig)
      } finally {
        setIsLoading(false)
      }
    }

    loadTenantConfig()
  }, [])

  return <TenantContext.Provider value={{ tenant, isLoading }}>{children}</TenantContext.Provider>
}

export function useTenant(): TenantContextValue {
  const context = useContext(TenantContext)
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  return context
}

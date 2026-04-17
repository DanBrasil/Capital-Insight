import type { TenantConfig } from '../../types'

export const defaultTenantConfig: TenantConfig = {
  id: 'default',
  name: 'White Label Finance',
  theme: {
    colorPrimary: '#2563eb',
    colorPrimaryForeground: '#ffffff',
    colorSecondary: '#64748b',
    colorSecondaryForeground: '#ffffff',
    colorBackground: '#ffffff',
    colorForeground: '#0f172a',
    colorMuted: '#f8fafc',
    colorMutedForeground: '#64748b',
    colorBorder: '#e2e8f0',
    logoUrl: '/logo.svg',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  features: ['notifications', 'export-csv', 'portfolio', 'operations', 'ai-insights', 'reports'],
  appConfig: {
    currencyCode: 'BRL',
    locale: 'pt-BR',
    supportEmail: 'suporte@wlfinance.com.br',
  },
}

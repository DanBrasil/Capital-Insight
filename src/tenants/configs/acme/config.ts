import type { TenantConfig } from '../../types'

/**
 * Acme Corp — example of a fully customized tenant.
 * Note how the same TenantConfig contract is used with different values.
 * No component needs to change to support this client.
 */
export const acmeTenantConfig: TenantConfig = {
  id: 'acme',
  name: 'Acme Financial',
  theme: {
    colorPrimary: '#7c3aed',
    colorPrimaryForeground: '#ffffff',
    colorSecondary: '#0ea5e9',
    colorSecondaryForeground: '#ffffff',
    colorBackground: '#fafafa',
    colorForeground: '#18181b',
    colorMuted: '#f4f4f5',
    colorMutedForeground: '#71717a',
    colorBorder: '#d4d4d8',
    logoUrl: '/tenants/acme/logo.svg',
    fontFamily: 'Poppins, system-ui, sans-serif',
  },
  features: ['reports', 'investments', 'notifications', 'multi-account', 'export-csv', 'audit-log'],
  appConfig: {
    currencyCode: 'USD',
    locale: 'en-US',
    supportEmail: 'support@acmefinancial.com',
  },
}

export interface TenantTheme {
  colorPrimary: string
  colorPrimaryForeground: string
  colorSecondary: string
  colorSecondaryForeground: string
  colorBackground: string
  colorForeground: string
  colorMuted: string
  colorMutedForeground: string
  colorBorder: string
  logoUrl: string
  fontFamily: string
}

/**
 * Literal union of all possible feature flags.
 * Add new flags here as the product grows — TypeScript will enforce correct usage.
 */
export type FeatureFlag =
  | 'reports'
  | 'investments'
  | 'credit'
  | 'notifications'
  | 'multi-account'
  | 'export-csv'
  | 'audit-log'
  | 'portfolio'
  | 'market-overview'
  | 'operations'
  | 'ai-insights'

export interface TenantAppConfig {
  /** ISO 4217 currency code, e.g. "BRL", "USD" */
  currencyCode: string
  /** BCP 47 locale tag, e.g. "pt-BR", "en-US" */
  locale: string
  supportEmail: string
}

export interface TenantConfig {
  id: string
  name: string
  theme: TenantTheme
  features: FeatureFlag[]
  appConfig: TenantAppConfig
}

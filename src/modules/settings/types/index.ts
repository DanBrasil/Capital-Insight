// ─── Section identifier ───────────────────────────────────────────────────────

export type SettingsSection = 'profile' | 'preferences' | 'security' | 'platform'

// ─── Profile ─────────────────────────────────────────────────────────────────

export interface UserProfileSettings {
  name: string
  email: string
  /** ISO 639-1 locale, e.g. "pt-BR" */
  locale: string
  /** ISO 4217 currency code, e.g. "BRL" */
  currency: string
  // Future: avatarUrl?: string
}

// ─── Preferences ─────────────────────────────────────────────────────────────

export type ThemePreference = 'light' | 'dark' | 'system'
export type DateFormatPreference = 'dd/MM/yyyy' | 'MM/dd/yyyy' | 'yyyy-MM-dd'
export type CurrencyFormatPreference = 'BRL' | 'USD' | 'EUR'

export interface UserPreferenceSettings {
  theme: ThemePreference
  dateFormat: DateFormatPreference
  currencyFormat: CurrencyFormatPreference
  // Future: dashboardLayout?: 'grid' | 'list'
  // Future: watchlistDisplayMode?: 'compact' | 'detailed'
}

// ─── Security ─────────────────────────────────────────────────────────────────

/**
 * Payload for the change-password action.
 * Not fetched from the server — only written.
 */
export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

/** Read-only security metadata fetched from the server */
export interface SecurityInfo {
  canChangePassword: boolean
  // Future: hasTwoFactorEnabled?: boolean
  // Future: activeSessionsCount?: number
  // Future: lastLoginAt?: string
}

// ─── Platform preferences ─────────────────────────────────────────────────────

export type DefaultMarketView = 'list' | 'grid'

export interface PlatformSettings {
  showPortfolioHighlights: boolean
  allowAIInsights: boolean
  defaultMarketView: DefaultMarketView
  // Future: enabledFeatureOverrides?: FeatureFlag[]
}

// ─── Aggregate settings response (single API call) ───────────────────────────

/**
 * What the settings endpoint returns in a single fetch.
 * Combining profile + preferences in one request avoids waterfall loading.
 */
export interface SettingsData {
  profile: UserProfileSettings
  preferences: UserPreferenceSettings
  security: SecurityInfo
  platform: PlatformSettings
}

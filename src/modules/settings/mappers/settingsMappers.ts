/**
 * Settings mappers — transform between API response shape and domain types.
 *
 * Rules:
 * - No React imports
 * - No side effects
 * - Provide safe defaults for every optional field
 *   (API may omit fields; domain types must always be complete)
 */
import type {
  PlatformSettings,
  SecurityInfo,
  SettingsData,
  UserPreferenceSettings,
  UserProfileSettings,
} from '../types'

// ─── API response ─────────────────────────────────────────────────────────────

/**
 * Raw shape returned by the backend.
 * All fields are optional to handle partial or legacy API responses.
 */
export interface RawSettingsResponse {
  profile?: {
    name?: string
    email?: string
    locale?: string
    currency?: string
  }
  preferences?: {
    theme?: string
    dateFormat?: string
    currencyFormat?: string
  }
  security?: {
    canChangePassword?: boolean
  }
  platform?: {
    showPortfolioHighlights?: boolean
    allowAIInsights?: boolean
    defaultMarketView?: string
  }
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

function mapProfile(raw: RawSettingsResponse['profile'] = {}): UserProfileSettings {
  return {
    name: raw.name ?? '',
    email: raw.email ?? '',
    locale: raw.locale ?? 'pt-BR',
    currency: raw.currency ?? 'BRL',
  }
}

function mapPreferences(raw: RawSettingsResponse['preferences'] = {}): UserPreferenceSettings {
  const validThemes = ['light', 'dark', 'system'] as const
  const validDateFormats = ['dd/MM/yyyy', 'MM/dd/yyyy', 'yyyy-MM-dd'] as const
  const validCurrencies = ['BRL', 'USD', 'EUR'] as const

  return {
    theme: validThemes.includes(raw.theme as (typeof validThemes)[number])
      ? (raw.theme as UserPreferenceSettings['theme'])
      : 'system',
    dateFormat: validDateFormats.includes(raw.dateFormat as (typeof validDateFormats)[number])
      ? (raw.dateFormat as UserPreferenceSettings['dateFormat'])
      : 'dd/MM/yyyy',
    currencyFormat: validCurrencies.includes(raw.currencyFormat as (typeof validCurrencies)[number])
      ? (raw.currencyFormat as UserPreferenceSettings['currencyFormat'])
      : 'BRL',
  }
}

function mapSecurity(raw: RawSettingsResponse['security'] = {}): SecurityInfo {
  return {
    canChangePassword: raw.canChangePassword ?? true,
  }
}

function mapPlatform(raw: RawSettingsResponse['platform'] = {}): PlatformSettings {
  const validViews = ['list', 'grid'] as const
  return {
    showPortfolioHighlights: raw.showPortfolioHighlights ?? true,
    allowAIInsights: raw.allowAIInsights ?? true,
    defaultMarketView: validViews.includes(raw.defaultMarketView as (typeof validViews)[number])
      ? (raw.defaultMarketView as PlatformSettings['defaultMarketView'])
      : 'list',
  }
}

export function mapSettingsResponse(raw: RawSettingsResponse): SettingsData {
  return {
    profile: mapProfile(raw.profile),
    preferences: mapPreferences(raw.preferences),
    security: mapSecurity(raw.security),
    platform: mapPlatform(raw.platform),
  }
}

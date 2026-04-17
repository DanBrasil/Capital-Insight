import { apiClient } from '@/services/api/client'
import { ENDPOINTS } from '@/services/api/constants'

import { mapSettingsResponse } from '../mappers/settingsMappers'
import type {
  ChangePasswordPayload,
  PlatformSettings,
  SettingsData,
  UserPreferenceSettings,
  UserProfileSettings,
} from '../types'

// ─── Dev mock ─────────────────────────────────────────────────────────────────

const DEV_SETTINGS: SettingsData = {
  profile: {
    name: 'Admin Demo',
    email: 'admin@demo.com',
    locale: 'pt-BR',
    currency: 'BRL',
  },
  preferences: {
    theme: 'system',
    dateFormat: 'dd/MM/yyyy',
    currencyFormat: 'BRL',
  },
  security: {
    canChangePassword: true,
  },
  platform: {
    showPortfolioHighlights: true,
    allowAIInsights: true,
    defaultMarketView: 'list',
  },
}

// In-memory store for DEV mutations — reflects changes across re-fetches
let devStore: SettingsData = { ...DEV_SETTINGS }

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Settings API service — pure async functions, no React dependencies.
 *
 * In development: uses an in-memory store so all CRUD operations persist
 * within the session. No network calls are made.
 *
 * In production: delegates to the API via apiClient. The backend returns
 * a combined settings object to avoid multiple sequential fetches.
 */
export const settingsService = {
  async fetch(): Promise<SettingsData> {
    if (import.meta.env.DEV) {
      return { ...devStore }
    }
    const response = await apiClient.get<unknown>(ENDPOINTS.settings.profile)
    return mapSettingsResponse(response.data as Parameters<typeof mapSettingsResponse>[0])
  },

  async updateProfile(payload: UserProfileSettings): Promise<UserProfileSettings> {
    if (import.meta.env.DEV) {
      devStore = { ...devStore, profile: { ...payload } }
      return { ...payload }
    }
    const response = await apiClient.patch<UserProfileSettings>(ENDPOINTS.settings.profile, payload)
    return response.data
  },

  async updatePreferences(payload: UserPreferenceSettings): Promise<UserPreferenceSettings> {
    if (import.meta.env.DEV) {
      devStore = { ...devStore, preferences: { ...payload } }
      return { ...payload }
    }
    const response = await apiClient.patch<UserPreferenceSettings>(
      ENDPOINTS.settings.preferences,
      payload,
    )
    return response.data
  },

  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    if (import.meta.env.DEV) {
      // Simulate a short delay to make the loading state observable
      await new Promise(resolve => setTimeout(resolve, 600))
      if (payload.currentPassword === 'wrong') {
        throw new Error('Senha atual incorreta')
      }
      return
    }
    await apiClient.post(ENDPOINTS.settings.password, {
      currentPassword: payload.currentPassword,
      newPassword: payload.newPassword,
    })
  },

  async updatePlatform(payload: PlatformSettings): Promise<PlatformSettings> {
    if (import.meta.env.DEV) {
      devStore = { ...devStore, platform: { ...payload } }
      return { ...payload }
    }
    const response = await apiClient.patch<PlatformSettings>(ENDPOINTS.settings.platform, payload)
    return response.data
  },
}

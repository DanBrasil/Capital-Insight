import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/services/api/constants'

import { settingsService } from '../services/settingsService'

/**
 * Loads all settings data in a single query.
 *
 * Combining profile + preferences + security + platform in one request prevents
 * the waterfall of 4 parallel fetches that would each independently show loading
 * states. The consumer receives a single isLoading/isError signal.
 *
 * staleTime is kept short (1 min) because the user may have changed settings
 * in another tab or device.
 */
export function useSettingsData() {
  return useQuery({
    queryKey: QUERY_KEYS.settings(),
    queryFn: () => settingsService.fetch(),
    staleTime: 60 * 1_000,
  })
}

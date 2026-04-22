import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/services/api/constants'
import { STALE_TIMES } from '@/domain'

import { settingsService } from '../services/settingsService'

/**
 * Loads all settings data in a single query.
 *
 * Combining profile + preferences + security + platform in one request prevents
 * the waterfall of 4 parallel fetches that would each independently show loading
 * states. The consumer receives a single isLoading/isError signal.
 */
export function useSettingsData() {
  return useQuery({
    queryKey: QUERY_KEYS.settings(),
    queryFn: () => settingsService.fetch(),
    staleTime: STALE_TIMES.realtime,
  })
}

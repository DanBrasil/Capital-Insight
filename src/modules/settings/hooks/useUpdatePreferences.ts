import { useMutation, useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/services/api/constants'

import { settingsService } from '../services/settingsService'
import type { UserPreferenceSettings } from '../types'

export function useUpdatePreferences() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UserPreferenceSettings) => settingsService.updatePreferences(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.settings() })
    },
  })
}

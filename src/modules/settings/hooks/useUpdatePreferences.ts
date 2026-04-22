import { useMutation, useQueryClient } from '@tanstack/react-query'

import { invalidate } from '@/services/api/invalidationRules'

import { settingsService } from '../services/settingsService'
import type { UserPreferenceSettings } from '../types'

export function useUpdatePreferences() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UserPreferenceSettings) => settingsService.updatePreferences(payload),
    onSuccess: () => {
      invalidate.settings(queryClient)
    },
  })
}

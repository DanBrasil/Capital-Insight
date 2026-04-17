import { useMutation, useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/services/api/constants'

import { settingsService } from '../services/settingsService'
import type { UserProfileSettings } from '../types'

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UserProfileSettings) => settingsService.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.settings() })
    },
  })
}

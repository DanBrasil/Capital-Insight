import { useMutation, useQueryClient } from '@tanstack/react-query'

import { invalidate } from '@/services/api/invalidationRules'

import { settingsService } from '../services/settingsService'
import type { UserProfileSettings } from '../types'

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UserProfileSettings) => settingsService.updateProfile(payload),
    onSuccess: () => {
      invalidate.settings(queryClient)
    },
  })
}

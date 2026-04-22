import { useMutation, useQueryClient } from '@tanstack/react-query'

import { invalidate } from '@/services/api/invalidationRules'

import { settingsService } from '../services/settingsService'
import type { PlatformSettings } from '../types'

export function useUpdatePlatform() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: PlatformSettings) => settingsService.updatePlatform(payload),
    onSuccess: () => {
      invalidate.settings(queryClient)
    },
  })
}

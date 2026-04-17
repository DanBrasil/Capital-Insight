import { useMutation, useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/services/api/constants'

import { settingsService } from '../services/settingsService'
import type { PlatformSettings } from '../types'

export function useUpdatePlatform() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: PlatformSettings) => settingsService.updatePlatform(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.settings() })
    },
  })
}

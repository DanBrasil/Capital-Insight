import { useMutation } from '@tanstack/react-query'

import { settingsService } from '../services/settingsService'
import type { ChangePasswordPayload } from '../types'

/**
 * No query invalidation on success — password change does not affect
 * cached settings data. The form is reset manually by the component.
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => settingsService.changePassword(payload),
  })
}

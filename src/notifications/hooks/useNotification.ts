/**
 * useNotification — React hook for dispatching and managing notifications.
 *
 * Thin wrapper over notificationService. Use this inside React components
 * and hooks. For code outside React (interceptors, services), use
 * notificationService directly.
 *
 * @example
 * const { success, error } = useNotification()
 * mutation.mutate(values, {
 *   onSuccess: () => success('Operação criada com sucesso.'),
 *   onError: (err) => error(parseApiError(err).message),
 * })
 */
import { notificationService } from '../services/notificationService'
import { useNotificationStore } from '../store/notificationStore'

export function useNotification() {
  const dismiss = useNotificationStore(state => state.dismiss)
  const dismissAll = useNotificationStore(state => state.dismissAll)

  return {
    success: notificationService.success.bind(notificationService),
    error: notificationService.error.bind(notificationService),
    warning: notificationService.warning.bind(notificationService),
    info: notificationService.info.bind(notificationService),
    dismiss,
    dismissAll,
  }
}

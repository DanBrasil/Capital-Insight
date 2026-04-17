/**
 * notificationService — imperative API for dispatching notifications.
 *
 * Accesses the Zustand store via `getState()` so it can be called from
 * anywhere: React components, axios interceptors, DOM event listeners,
 * or plain utility functions — no hook rules apply here.
 *
 * Usage:
 *   notificationService.success('Operação criada com sucesso.')
 *   notificationService.error('Não foi possível conectar ao servidor.')
 */
import { useNotificationStore } from '../store/notificationStore'
import type { NotificationOptions, NotificationType } from '../types'

function add(type: NotificationType, options: NotificationOptions) {
  return useNotificationStore.getState().add(type, options)
}

export const notificationService = {
  success(message: string, options?: Partial<Omit<NotificationOptions, 'message'>>) {
    return add('success', { message, ...options })
  },

  error(message: string, options?: Partial<Omit<NotificationOptions, 'message'>>) {
    return add('error', { message, ...options })
  },

  warning(message: string, options?: Partial<Omit<NotificationOptions, 'message'>>) {
    return add('warning', { message, ...options })
  },

  info(message: string, options?: Partial<Omit<NotificationOptions, 'message'>>) {
    return add('info', { message, ...options })
  },

  dismiss(id: string) {
    useNotificationStore.getState().dismiss(id)
  },

  dismissAll() {
    useNotificationStore.getState().dismissAll()
  },
}

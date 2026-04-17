// Service — imperative API, works outside React
export { notificationService } from './services/notificationService'

// Hook — for React components and hooks
export { useNotification } from './hooks/useNotification'

// UI — mount ToastContainer once at the app root
export { ToastContainer } from './components/ToastContainer'
export { Toast } from './components/Toast'

// Types
export type {
  NotificationAction,
  NotificationItem,
  NotificationOptions,
  NotificationType,
} from './types'
export { NOTIFICATION_DURATION, MAX_NOTIFICATIONS } from './types'

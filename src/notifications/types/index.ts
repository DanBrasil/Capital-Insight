// ─── Notification type ────────────────────────────────────────────────────────

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

// ─── Durations (ms) per type ──────────────────────────────────────────────────

export const NOTIFICATION_DURATION: Record<NotificationType, number> = {
  success: 3_000,
  info: 4_000,
  warning: 4_000,
  error: 5_000,
}

// ─── Maximum toasts visible simultaneously ───────────────────────────────────

export const MAX_NOTIFICATIONS = 5

// ─── Notification item ────────────────────────────────────────────────────────

export interface NotificationAction {
  label: string
  onClick: () => void
}

export interface NotificationItem {
  /** Unique identifier — used for deduplication and dismissal */
  id: string
  type: NotificationType
  message: string
  /**
   * When true, the notification does not auto-dismiss.
   * A close button is always rendered.
   */
  persistent?: boolean
  /**
   * Optional CTA rendered inside the toast (e.g. "Desfazer").
   * Reserved for future use — not required for initial release.
   */
  action?: NotificationAction
}

// ─── Options passed to add() ──────────────────────────────────────────────────

export type NotificationOptions = Omit<NotificationItem, 'id' | 'type'>

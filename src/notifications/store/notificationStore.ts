import { create } from 'zustand'

import {
  MAX_NOTIFICATIONS,
  NOTIFICATION_DURATION,
  type NotificationItem,
  type NotificationOptions,
  type NotificationType,
} from '../types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

/**
 * Deduplication key — prevents the same message from appearing twice.
 * Considers type + message content (trimmed, lowercased).
 */
function dedupeKey(type: NotificationType, message: string): string {
  return `${type}:${message.trim().toLowerCase()}`
}

// ─── Store shape ──────────────────────────────────────────────────────────────

interface NotificationState {
  items: NotificationItem[]
  /**
   * Adds a notification to the queue.
   * - Deduplicates by type + message
   * - Enforces MAX_NOTIFICATIONS (oldest removed when exceeded)
   * Returns the id of the created item, or null if deduplicated.
   */
  add: (type: NotificationType, options: NotificationOptions) => string | null
  /** Removes a specific notification by id */
  dismiss: (id: string) => void
  /** Removes all notifications */
  dismissAll: () => void
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useNotificationStore = create<NotificationState>((set, get) => ({
  items: [],

  add(type, options) {
    const { items } = get()
    const key = dedupeKey(type, options.message)

    // Deduplicate — ignore if identical toast already visible
    const alreadyExists = items.some(item => dedupeKey(item.type, item.message) === key)
    if (alreadyExists) return null

    const id = generateId()
    const item: NotificationItem = { id, type, ...options }

    // Enforce maximum — drop the oldest if at capacity
    const next = items.length >= MAX_NOTIFICATIONS ? items.slice(1) : items

    set({ items: [...next, item] })

    // Schedule auto-dismiss (skip for persistent notifications)
    if (!options.persistent) {
      const duration = NOTIFICATION_DURATION[type]
      setTimeout(() => {
        get().dismiss(id)
      }, duration)
    }

    return id
  },

  dismiss(id) {
    set(state => ({ items: state.items.filter(item => item.id !== id) }))
  },

  dismissAll() {
    set({ items: [] })
  },
}))

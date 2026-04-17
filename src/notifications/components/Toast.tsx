import { useEffect, useRef, useState } from 'react'

import type { NotificationItem, NotificationType } from '../types'
import { NOTIFICATION_DURATION } from '../types'

// ─── Visual config per type ───────────────────────────────────────────────────

const TYPE_STYLES: Record<
  NotificationType,
  { container: string; icon: string; label: string }
> = {
  success: {
    container: 'bg-success text-success-foreground border-success',
    icon: '✓',
    label: 'Sucesso',
  },
  error: {
    container: 'bg-error text-error-foreground border-error',
    icon: '✕',
    label: 'Erro',
  },
  warning: {
    container: 'bg-warning text-warning-foreground border-warning',
    icon: '⚠',
    label: 'Atenção',
  },
  info: {
    container: 'bg-info text-info-foreground border-info',
    icon: 'ℹ',
    label: 'Informação',
  },
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ToastProps {
  item: NotificationItem
  onDismiss: (id: string) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Toast — purely presentational.
 *
 * Handles:
 * - Visual style per notification type
 * - Pause-on-hover: suspends the remaining lifetime while hovered,
 *   resumes with the remaining time on mouse leave.
 * - Accessible: role="alert" for errors/warnings, role="status" for others.
 */
export function Toast({ item, onDismiss }: ToastProps) {
  const styles = TYPE_STYLES[item.type]
  const isAlert = item.type === 'error' || item.type === 'warning'

  // ── Pause-on-hover progress bar ──────────────────────────────────────────
  const duration = item.persistent ? null : NOTIFICATION_DURATION[item.type]
  const [progress, setProgress] = useState(100)
  const remainingRef = useRef(duration ?? 0)
  const startTimeRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const pausedRef = useRef(false)

  useEffect(() => {
    if (item.persistent || duration === null) return

    function tick(timestamp: number) {
      if (pausedRef.current) return
      if (startTimeRef.current === null) startTimeRef.current = timestamp

      const elapsed = timestamp - startTimeRef.current
      const remaining = Math.max(0, remainingRef.current - elapsed)
      setProgress((remaining / (duration as number)) * 100)

      if (remaining > 0) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [item.id, item.persistent, duration])

  function handleMouseEnter() {
    pausedRef.current = true
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    // Capture how much time has elapsed so far
    if (startTimeRef.current !== null && duration !== null) {
      const elapsed = performance.now() - startTimeRef.current
      remainingRef.current = Math.max(0, remainingRef.current - elapsed)
      startTimeRef.current = null
    }
  }

  function handleMouseLeave() {
    pausedRef.current = false
    startTimeRef.current = null // will be set on next RAF tick

    function tick(timestamp: number) {
      if (pausedRef.current) return
      if (startTimeRef.current === null) startTimeRef.current = timestamp

      const elapsed = timestamp - startTimeRef.current
      const remaining = Math.max(0, remainingRef.current - elapsed)
      if (duration !== null) setProgress((remaining / duration) * 100)

      if (remaining > 0) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
  }

  return (
    <div
      role={isAlert ? 'alert' : 'status'}
      aria-live={isAlert ? 'assertive' : 'polite'}
      aria-label={styles.label}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={[
        'relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-lg border px-4 py-3 shadow-lg',
        'animate-in slide-in-from-right-5 fade-in duration-200',
        styles.container,
      ].join(' ')}
    >
      {/* Icon */}
      <span className="mt-0.5 shrink-0 text-base font-bold" aria-hidden="true">
        {styles.icon}
      </span>

      {/* Message + optional action */}
      <div className="flex flex-1 flex-col gap-1">
        <p className="text-sm font-medium leading-snug">{item.message}</p>
        {item.action && (
          <button
            type="button"
            onClick={() => {
              item.action!.onClick()
              onDismiss(item.id)
            }}
            className="self-start text-xs font-semibold underline underline-offset-2 hover:no-underline"
          >
            {item.action.label}
          </button>
        )}
      </div>

      {/* Close button */}
      <button
        type="button"
        aria-label="Fechar notificação"
        onClick={() => onDismiss(item.id)}
        className="shrink-0 rounded p-0.5 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-2"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Progress bar (hidden for persistent toasts) */}
      {!item.persistent && (
        <div
          className="absolute bottom-0 left-0 h-0.5 rounded-b-lg bg-current opacity-30 transition-none"
          style={{ width: `${progress}%` }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

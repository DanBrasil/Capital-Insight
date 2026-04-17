import { useNotificationStore } from '../store/notificationStore'
import { Toast } from './Toast'

/**
 * ToastContainer — mounts at the app root (AppShell or main.tsx).
 *
 * Reads the notification queue from Zustand and renders the stack.
 * Position: bottom-right, stacked vertically with most-recent on top.
 * A single instance in the entire app; never nest it inside a module.
 */
export function ToastContainer() {
  const items = useNotificationStore(state => state.items)
  const dismiss = useNotificationStore(state => state.dismiss)

  if (items.length === 0) return null

  return (
    <div
      aria-label="Notificações"
      className="fixed bottom-4 right-4 z-[9999] flex flex-col-reverse gap-2 w-full max-w-sm"
    >
      {items.map(item => (
        <Toast key={item.id} item={item} onDismiss={dismiss} />
      ))}
    </div>
  )
}

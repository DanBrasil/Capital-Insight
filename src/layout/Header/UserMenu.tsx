import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { ROUTES } from '@/router/routes'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserMenuProps {
  userName: string
  userEmail: string
  onLogout: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * User avatar button + dropdown with session actions.
 *
 * - Shows initials derived from the user's name
 * - Dropdown: user info, link to Settings, logout
 * - Closes on outside click or Escape
 * - Accessible: aria-expanded, aria-haspopup, keyboard navigation
 */
export function UserMenu({ userName, userEmail, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const initials = getInitials(userName)

  const close = useCallback(() => {
    setIsOpen(false)
    triggerRef.current?.focus()
  }, [])

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, close])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        close()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, close])

  function handleToggle() {
    setIsOpen(prev => !prev)
  }

  function handleLogout() {
    close()
    onLogout()
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger — avatar with initials */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Menu do usuário"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {initials}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          role="menu"
          aria-label="Ações da conta"
          className="absolute right-0 top-full mt-2 w-56 origin-top-right rounded-lg border border-border bg-card shadow-lg animate-in fade-in zoom-in-95"
        >
          {/* User info */}
          <div className="border-b border-border px-4 py-3">
            <p className="text-sm font-medium text-foreground truncate">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
          </div>

          {/* Menu items */}
          <div className="p-1">
            <Link
              to={ROUTES.settings}
              role="menuitem"
              onClick={close}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <svg
                className="h-4 w-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93s.844.127 1.168-.142l.63-.5a1.14 1.14 0 0 1 1.57.11l.774.774a1.14 1.14 0 0 1 .11 1.57l-.5.63c-.269.324-.332.772-.142 1.168s.506.71.93.78l.894.15c.542.09.94.56.94 1.109v1.094c0 .55-.398 1.02-.94 1.11l-.894.149c-.424.07-.764.384-.93.78s-.127.844.142 1.168l.5.63a1.14 1.14 0 0 1-.11 1.57l-.774.774a1.14 1.14 0 0 1-1.57.11l-.63-.5c-.324-.269-.772-.332-1.168-.142s-.71.506-.78.93l-.15.894c-.09.542-.56.94-1.109.94h-1.094c-.55 0-1.02-.398-1.11-.94l-.148-.894c-.071-.424-.385-.764-.781-.93s-.844-.127-1.168.142l-.63.5a1.14 1.14 0 0 1-1.57-.11l-.774-.774a1.14 1.14 0 0 1-.11-1.57l.5-.63c.269-.324.332-.772.142-1.168s-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.764-.384.93-.78s.127-.844-.142-1.168l-.5-.63a1.14 1.14 0 0 1 .11-1.57l.774-.774a1.14 1.14 0 0 1 1.57-.11l.63.5c.324.269.772.332 1.168.142s.71-.506.78-.93l.15-.894Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              Configurações
            </Link>
          </div>

          {/* Separator + Logout */}
          <div className="border-t border-border p-1">
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-error hover:bg-error/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3-3h-9m9 0-3-3m3 3-3 3"
                />
              </svg>
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

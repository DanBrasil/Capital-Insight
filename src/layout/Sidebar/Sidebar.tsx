import { X } from 'lucide-react'

import type { NavGroup } from '@/hooks/useNavigation'

import { SidebarGroup } from './SidebarGroup'

interface SidebarProps {
  navGroups: NavGroup[]
  tenantName: string
  logoUrl: string
  isCollapsed: boolean
  isMobileOpen: boolean
  onMobileClose: () => void
}

/**
 * Pure presentational sidebar.
 * Receives all data via props — no hooks, no context, no business logic.
 * State (collapsed, mobile open) is owned by AppShell and passed down.
 */
export function Sidebar({
  navGroups,
  tenantName,
  logoUrl,
  isCollapsed,
  isMobileOpen,
  onMobileClose,
}: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="Navegação principal"
        className={[
          'fixed inset-y-0 left-0 z-30 flex flex-col bg-card border-r border-border',
          'transition-all duration-300 ease-in-out',
          // Desktop: width based on collapsed state
          isCollapsed ? 'w-16' : 'w-64',
          // Mobile: off-canvas, slide in/out
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        {/* Branding */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={logoUrl}
              alt={`${tenantName} logo`}
              className="h-8 w-8 shrink-0 object-contain"
              onError={event => {
                ;(event.target as HTMLImageElement).style.display = 'none'
              }}
            />
            {!isCollapsed && (
              <span className="truncate text-sm font-semibold text-foreground">{tenantName}</span>
            )}
          </div>

          {/* Mobile close button */}
          <button
            type="button"
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
            onClick={onMobileClose}
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Navigation groups */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <div className="flex flex-col gap-4">
            {navGroups.map(group => (
              <SidebarGroup key={group.label || '__main'} group={group} isCollapsed={isCollapsed} />
            ))}
          </div>
        </nav>

        {/* Bottom section — app version when expanded */}
        {!isCollapsed && (
          <div className="shrink-0 border-t border-border px-4 py-3">
            <p className="text-xs text-muted-foreground truncate">{tenantName}</p>
            <p className="text-[10px] text-muted-foreground/60">v0.1.0</p>
          </div>
        )}
      </aside>
    </>
  )
}

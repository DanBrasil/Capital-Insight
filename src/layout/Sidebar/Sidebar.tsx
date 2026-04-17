import type { NavItem } from '@/hooks/useNavigation'

import { SidebarItem } from './SidebarItem'

interface SidebarProps {
  navItems: NavItem[]
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
  navItems,
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
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-4">
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

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="flex flex-col gap-1">
            {navItems.map(item => (
              <li key={item.path}>
                <SidebarItem item={item} isCollapsed={isCollapsed} />
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}

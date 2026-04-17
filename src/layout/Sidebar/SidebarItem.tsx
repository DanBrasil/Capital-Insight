import { NavLink } from 'react-router-dom'

import type { NavItem } from '@/hooks/useNavigation'

interface SidebarItemProps {
  item: NavItem
  isCollapsed: boolean
}

/**
 * Visual-only nav item.
 * NavLink from react-router-dom provides active state via className callback.
 * No knowledge of tenant, features or business logic.
 */
export function SidebarItem({ item, isCollapsed }: SidebarItemProps) {
  return (
    <NavLink
      to={item.path}
      title={isCollapsed ? item.label : undefined}
      className={({ isActive }) =>
        [
          'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        ].join(' ')
      }
    >
      {/* Icon slot — using text placeholder; replace with Lucide icons when added */}
      <span
        className="h-5 w-5 shrink-0 flex items-center justify-center text-base"
        aria-hidden="true"
      >
        ▪
      </span>
      {!isCollapsed && <span className="truncate">{item.label}</span>}
    </NavLink>
  )
}

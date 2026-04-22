import { NavLink } from 'react-router-dom'

import type { NavItem } from '@/hooks/useNavigation'

import { NavIcon } from './NavIcon'

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
      <NavIcon name={item.iconName} className="h-5 w-5 shrink-0" />
      {!isCollapsed && <span className="truncate">{item.label}</span>}
    </NavLink>
  )
}

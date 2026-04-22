import type { NavGroup } from '@/hooks/useNavigation'

import { SidebarItem } from './SidebarItem'

interface SidebarGroupProps {
  group: NavGroup
  isCollapsed: boolean
}

/**
 * Renders a labeled group of navigation items.
 * When sidebar is collapsed, the label is hidden and items render as icon-only.
 */
export function SidebarGroup({ group, isCollapsed }: SidebarGroupProps) {
  return (
    <div>
      {group.label && !isCollapsed && (
        <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {group.label}
        </p>
      )}
      {group.label && isCollapsed && <hr className="mx-2 mb-1 border-border" aria-hidden="true" />}
      <ul className="flex flex-col gap-0.5">
        {group.items.map(item => (
          <li key={item.path}>
            <SidebarItem item={item} isCollapsed={isCollapsed} />
          </li>
        ))}
      </ul>
    </div>
  )
}

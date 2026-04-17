import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import { useNavigation } from '@/hooks/useNavigation'
import { usePageTitle } from '@/hooks/usePageTitle'
import { ToastContainer } from '@/notifications'
import { useTenant } from '@/tenants'

import { Header } from '../Header/Header'
import { Sidebar } from '../Sidebar/Sidebar'

/**
 * Application shell — the persistent frame around all authenticated pages.
 *
 * Responsibilities:
 * - Reads tenant data (branding) from context
 * - Derives nav items via useNavigation (feature-filtered)
 * - Owns sidebar collapse and mobile-open state (pure UI state)
 * - Renders Header + Sidebar + <Outlet> (page content slot)
 *
 * Does NOT know: what page is rendered, business rules, user data.
 */
export function AppShell() {
  const { tenant } = useTenant()
  const navItems = useNavigation()
  const pageTitle = usePageTitle()

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  function handleSidebarCollapseToggle() {
    setIsSidebarCollapsed(previous => !previous)
  }

  function handleMobileMenuToggle() {
    setIsMobileMenuOpen(previous => !previous)
  }

  function handleMobileMenuClose() {
    setIsMobileMenuOpen(false)
  }

  const sidebarWidth = isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        navItems={navItems}
        tenantName={tenant.name}
        logoUrl={tenant.theme.logoUrl}
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={handleMobileMenuClose}
      />

      {/* Main area — offset by sidebar width on desktop */}
      <div
        className={['flex flex-col min-h-screen transition-all duration-300', sidebarWidth].join(
          ' ',
        )}
      >
        <Header
          pageTitle={pageTitle}
          tenantName={tenant.name}
          onMobileMenuToggle={handleMobileMenuToggle}
          onSidebarCollapseToggle={handleSidebarCollapseToggle}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      {/* Global toast stack — rendered once, outside the scrollable content */}
      <ToastContainer />
    </div>
  )
}

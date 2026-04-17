import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import { useNavigation } from '@/hooks/useNavigation'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useAuth } from '@/modules/auth/hooks/useAuth'
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
  const { user, logout } = useAuth()
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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-card focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-lg focus:outline-2 focus:outline-offset-2 focus:outline-ring"
      >
        Ir para o conteúdo principal
      </a>

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
          userName={user?.name ?? ''}
          userEmail={user?.email ?? ''}
          onMobileMenuToggle={handleMobileMenuToggle}
          onSidebarCollapseToggle={handleSidebarCollapseToggle}
          isSidebarCollapsed={isSidebarCollapsed}
          onLogout={logout}
        />

        <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      {/* Global toast stack — rendered once, outside the scrollable content */}
      <ToastContainer />
    </div>
  )
}

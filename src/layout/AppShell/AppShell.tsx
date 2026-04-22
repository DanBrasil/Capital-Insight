import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { useNavigation } from '@/hooks/useNavigation'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { ToastContainer } from '@/notifications'
import { useTenant } from '@/tenants'

import { ContentWrapper } from '../ContentWrapper/ContentWrapper'
import { Header } from '../Header/Header'
import { Sidebar } from '../Sidebar/Sidebar'

/**
 * Application shell — the persistent frame around all authenticated pages.
 *
 * Responsibilities:
 * - Reads tenant data (branding) from context
 * - Derives nav groups via useNavigation (feature-filtered, grouped)
 * - Owns sidebar collapse and mobile-open state (pure UI state)
 * - Auto-closes mobile menu on route change
 * - Renders Header + Sidebar + ContentWrapper(<Outlet>) (page content slot)
 *
 * Does NOT know: what page is rendered, business rules, user data.
 */
export function AppShell() {
  const { tenant } = useTenant()
  const { user, logout } = useAuth()
  const navGroups = useNavigation()
  const pageTitle = usePageTitle()
  const { pathname } = useLocation()

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Auto-close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

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
        navGroups={navGroups}
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

        <ContentWrapper>
          <Outlet />
        </ContentWrapper>
      </div>

      {/* Global toast stack — rendered once, outside the scrollable content */}
      <ToastContainer />
    </div>
  )
}

interface ContentWrapperProps {
  children: React.ReactNode
}

/**
 * Wraps page content rendered via <Outlet>.
 * Provides consistent padding, scroll container, and landmark role.
 */
export function ContentWrapper({ children }: ContentWrapperProps) {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto p-4 lg:p-6">
      {children}
    </main>
  )
}

interface HeaderProps {
  pageTitle: string
  tenantName: string
  onMobileMenuToggle: () => void
  onSidebarCollapseToggle: () => void
  isSidebarCollapsed: boolean
}

/**
 * Application top bar.
 * Displays the current page title, tenant name, and navigation controls.
 * Pure presentational — all state and callbacks come from AppShell.
 */
export function Header({
  pageTitle,
  tenantName,
  onMobileMenuToggle,
  onSidebarCollapseToggle,
  isSidebarCollapsed,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b border-border bg-background px-4 lg:px-6">
      {/* Mobile hamburger */}
      <button
        type="button"
        className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
        onClick={onMobileMenuToggle}
        aria-label="Abrir menu de navegação"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Desktop collapse toggle */}
      <button
        type="button"
        className="hidden rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:flex"
        onClick={onSidebarCollapseToggle}
        aria-label={isSidebarCollapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
        aria-expanded={!isSidebarCollapsed}
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h8M4 18h16"
          />
        </svg>
      </button>

      {/* Page title */}
      <h1 className="flex-1 truncate text-base font-semibold text-foreground">{pageTitle}</h1>

      {/* Tenant badge */}
      <span className="hidden text-xs text-muted-foreground sm:block">{tenantName}</span>

      {/* Future: user avatar, notifications, settings */}
      <div className="flex items-center gap-2">
        <div
          className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold"
          aria-label="Usuário logado"
        >
          U
        </div>
      </div>
    </header>
  )
}

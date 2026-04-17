interface PortfolioHeaderProps {
  onRefresh?: () => void
  isRefreshing?: boolean
}

/**
 * Pure presentational header for the portfolio page.
 * The optional refresh callback is passed down from PortfolioView
 * (which has access to React Query's refetch).
 */
export function PortfolioHeader({ onRefresh, isRefreshing = false }: PortfolioHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Minha Carteira</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Visão consolidada das suas posições abertas
        </p>
      </div>

      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
        >
          <svg
            className={['h-4 w-4', isRefreshing ? 'animate-spin' : ''].join(' ')}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M8 16H3v5" />
          </svg>
          {isRefreshing ? 'Atualizando…' : 'Atualizar'}
        </button>
      )}
    </div>
  )
}

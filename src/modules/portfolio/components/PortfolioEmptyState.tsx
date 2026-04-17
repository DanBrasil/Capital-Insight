/**
 * Shown when the portfolio has no positions.
 * Guides the user to register their first operation.
 */
export function PortfolioEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card px-8 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <svg
          className="h-7 w-7 text-muted-foreground"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 3v18h18" />
          <path d="m7 16 4-4 4 4 5-5" />
        </svg>
      </div>

      <h2 className="text-base font-semibold text-foreground">Nenhuma posição em carteira</h2>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        Registre sua primeira operação de compra para começar a acompanhar sua carteira.
      </p>
    </div>
  )
}

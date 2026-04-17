interface OperationsHeaderProps {
  totalCount: number
  onNew: () => void
}

/**
 * Pure presentational header. Receives count and new-click callback from OperationsView.
 */
export function OperationsHeader({ totalCount, onNew }: OperationsHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Operações</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {totalCount > 0
            ? `${totalCount} operação${totalCount !== 1 ? 's' : ''} registrada${totalCount !== 1 ? 's' : ''}`
            : 'Histórico de compras e vendas da carteira'}
        </p>
      </div>

      <button
        type="button"
        onClick={onNew}
        className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
        Nova operação
      </button>
    </div>
  )
}

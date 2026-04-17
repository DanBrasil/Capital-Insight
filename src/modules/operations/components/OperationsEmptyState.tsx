/**
 * Shown when there are no operations and no active filters.
 * Encourages the user to register their first operation.
 */
interface OperationsEmptyStateProps {
  onNew: () => void
}

export function OperationsEmptyState({ onNew }: OperationsEmptyStateProps) {
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
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </div>
      <h2 className="text-base font-semibold text-foreground">Nenhuma operação registrada</h2>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        Registre sua primeira compra ou venda para começar a construir o histórico da carteira.
      </p>
      <button
        type="button"
        onClick={onNew}
        className="mt-5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
      >
        Registrar operação
      </button>
    </div>
  )
}

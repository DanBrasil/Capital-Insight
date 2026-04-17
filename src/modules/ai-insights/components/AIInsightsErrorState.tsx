interface AIInsightsErrorStateProps {
  onRetry: () => void
}

/**
 * Shown when the AI generation fails.
 * Offers a retry button without auto-retrying (AI calls are expensive).
 */
export function AIInsightsErrorState({ onRetry }: AIInsightsErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-error/30 bg-error/5 px-8 py-14 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error/10">
        <svg
          className="h-6 w-6 text-error"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h2 className="text-base font-semibold text-foreground">Erro ao gerar análise</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Não foi possível conectar ao provedor de IA. Verifique sua conexão ou tente novamente em
        instantes.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
      >
        Tentar novamente
      </button>
    </div>
  )
}

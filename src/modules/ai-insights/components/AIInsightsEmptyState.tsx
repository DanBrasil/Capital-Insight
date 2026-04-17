interface AIInsightsEmptyStateProps {
  /** When true, portfolio has no positions — button is disabled with explanation */
  insufficientData: boolean
  onGenerate: () => void
  isGenerating: boolean
}

/**
 * Shown when no insight has been generated yet.
 * Two variants: normal (ready to generate) and insufficient data (no positions).
 */
export function AIInsightsEmptyState({
  insufficientData,
  onGenerate,
  isGenerating,
}: AIInsightsEmptyStateProps) {
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
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          <path d="M19 3v4" />
          <path d="M21 5h-4" />
        </svg>
      </div>

      {insufficientData ? (
        <>
          <h2 className="text-base font-semibold text-foreground">Dados insuficientes</h2>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            Registre pelo menos uma operação e aguarde o cálculo da carteira para gerar a análise.
          </p>
        </>
      ) : (
        <>
          <h2 className="text-base font-semibold text-foreground">Nenhuma análise gerada</h2>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            Clique em "Gerar análise" para que a IA interprete os dados consolidados da sua carteira
            e produza uma leitura descritiva.
          </p>
          <button
            type="button"
            onClick={onGenerate}
            disabled={isGenerating}
            className="mt-5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {isGenerating ? 'Gerando...' : 'Gerar análise'}
          </button>
        </>
      )}
    </div>
  )
}

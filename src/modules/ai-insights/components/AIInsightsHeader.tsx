interface AIInsightsHeaderProps {
  hasResult: boolean
  onGenerate: () => void
  isGenerating: boolean
  canGenerate: boolean
}

/**
 * Pure header component.
 * Shows title + subtitle always.
 * Shows "Gerar análise" button only when there is no result yet.
 * When there is a result, RegenerateInsightsButton is shown below the content.
 */
export function AIInsightsHeader({
  hasResult,
  onGenerate,
  isGenerating,
  canGenerate,
}: AIInsightsHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold text-foreground">AI Insights</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Análise descritiva gerada a partir dos dados consolidados da sua carteira.
        </p>
      </div>
      {!hasResult && (
        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating || !canGenerate}
          className="flex shrink-0 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {isGenerating ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Gerando...
            </>
          ) : (
            <>
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
              Gerar análise
            </>
          )}
        </button>
      )}
    </div>
  )
}

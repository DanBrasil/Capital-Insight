import { ErrorState } from '@/components/ui'

interface AIInsightsErrorStateProps {
  onRetry: () => void
}

/**
 * Shown when the AI generation fails.
 * Offers a retry button without auto-retrying (AI calls are expensive).
 */
export function AIInsightsErrorState({ onRetry }: AIInsightsErrorStateProps) {
  return (
    <div className="rounded-lg border border-error/30 bg-error/5">
      <ErrorState
        title="Erro ao gerar análise"
        description="Não foi possível conectar ao provedor de IA. Verifique sua conexão ou tente novamente em instantes."
        onRetry={onRetry}
      />
    </div>
  )
}

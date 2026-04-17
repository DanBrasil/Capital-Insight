import { ErrorState } from '@/components/ui'

interface ReportsErrorStateProps {
  onRetry: () => void
}

export function ReportsErrorState({ onRetry }: ReportsErrorStateProps) {
  return (
    <ErrorState
      title="Erro ao carregar relatórios"
      description="Não foi possível carregar os dados analíticos. Tente novamente em instantes."
      size="lg"
      onRetry={onRetry}
    />
  )
}

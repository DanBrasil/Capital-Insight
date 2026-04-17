import { ErrorState } from '@/components/ui'

interface SettingsErrorStateProps {
  onRetry: () => void
}

export function SettingsErrorState({ onRetry }: SettingsErrorStateProps) {
  return (
    <div className="rounded-lg border border-border">
      <ErrorState
        title="Não foi possível carregar as configurações"
        description="Ocorreu um erro ao buscar suas configurações. Verifique sua conexão e tente novamente."
        onRetry={onRetry}
      />
    </div>
  )
}

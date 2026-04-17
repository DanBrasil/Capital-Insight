import { Button } from '@/components/ui/Button'
import { Heading, Text } from '@/components/ui/Typography'

interface SettingsErrorStateProps {
  onRetry: () => void
}

export function SettingsErrorState({ onRetry }: SettingsErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-4 rounded-lg border border-border p-12 text-center"
    >
      <Heading level="h2" className="text-base font-semibold text-foreground">
        Não foi possível carregar as configurações
      </Heading>
      <Text variant="small" className="text-muted-foreground">
        Ocorreu um erro ao buscar suas configurações. Verifique sua conexão e tente novamente.
      </Text>
      <Button variant="secondary" onClick={onRetry}>
        Tentar novamente
      </Button>
    </div>
  )
}

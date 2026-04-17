import { Button } from '@/components/ui/Button'
import { Heading, Text } from '@/components/ui/Typography'

interface ReportsErrorStateProps {
  onRetry: () => void
}

export function ReportsErrorState({ onRetry }: ReportsErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="rounded-full bg-error/10 p-4">
        <svg
          className="h-10 w-10 text-error"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>
      <Heading level="h3" className="text-base font-semibold text-foreground">
        Erro ao carregar relatórios
      </Heading>
      <Text className="text-sm text-foreground/60 max-w-xs">
        Não foi possível carregar os dados analíticos. Tente novamente em instantes.
      </Text>
      <Button variant="ghost" size="sm" onClick={onRetry}>
        Tentar novamente
      </Button>
    </div>
  )
}

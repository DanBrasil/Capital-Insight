import { Text } from '@/components/ui/Typography'

interface ChartEmptyStateProps {
  message?: string
}

export function ChartEmptyState({
  message = 'Dados insuficientes para exibir o gráfico.',
}: ChartEmptyStateProps) {
  return (
    <div className="flex min-h-[100px] flex-col items-center justify-center gap-2 py-8">
      <svg
        className="h-8 w-8 text-foreground/30"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zm6.75-7.5C9.75 4.879 10.254 4.375 10.875 4.375h2.25c.621 0 1.125.504 1.125 1.125v13.5c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V5.625zm6.75 4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v8.625c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125v-8.625z"
        />
      </svg>
      <Text variant="small" className="max-w-[200px] text-center text-foreground/50">
        {message}
      </Text>
    </div>
  )
}

import { Link } from 'react-router-dom'

import { Button } from '@/components/ui'
import { ROUTES } from '@/router/routes'

// ── ErrorPage ─────────────────────────────────────────────────────────────────
// Full-page fallback rendered by ErrorBoundary when an unexpected React error
// (render exception) is caught. Also usable as a standalone route element.

interface ErrorPageProps {
  /** Called when the user clicks "Tentar novamente" — resets the ErrorBoundary */
  onReset?: () => void
}

export function ErrorPage({ onReset }: ErrorPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-8 w-8 text-error"
        >
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Algo deu errado</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          Ocorreu um erro inesperado na aplicação. Nossa equipe foi notificada.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onReset && (
          <Button variant="primary" onClick={onReset}>
            Tentar novamente
          </Button>
        )}
        <Link
          to={ROUTES.dashboard}
          className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-transparent px-4 text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          Voltar ao Dashboard
        </Link>
      </div>
    </div>
  )
}

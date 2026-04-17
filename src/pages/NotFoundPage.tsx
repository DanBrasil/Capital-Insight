import { Link } from 'react-router-dom'

import { ROUTES } from '@/router/routes'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
      <h1 className="text-6xl font-bold text-foreground">404</h1>
      <p className="text-muted-foreground">Página não encontrada.</p>
      <Link
        to={ROUTES.dashboard}
        className="text-sm text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded"
      >
        Voltar ao Dashboard
      </Link>
    </div>
  )
}

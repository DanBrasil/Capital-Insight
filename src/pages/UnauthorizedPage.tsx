import { Link } from 'react-router-dom'

import { ROUTES } from '@/router/routes'

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-warning/10">
        <svg
          className="h-8 w-8 text-warning"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-foreground">Acesso não autorizado</h1>
      <p className="text-muted-foreground text-sm max-w-md text-center">
        Este recurso não está disponível para o seu plano. Entre em contato com o suporte caso
        precise de acesso.
      </p>
      <Link
        to={ROUTES.dashboard}
        className="text-sm text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded"
      >
        Voltar ao Dashboard
      </Link>
    </div>
  )
}

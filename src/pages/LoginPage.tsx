import { useTenant } from '@/tenants'
import { LoginForm, useAuth } from '@/modules/auth'

const IS_DEV = import.meta.env.DEV

export function LoginPage() {
  const { login, status, error } = useAuth()
  const { tenant } = useTenant()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm space-y-6 p-8 rounded-lg border border-border bg-card shadow-sm">
        {tenant?.theme.logoUrl ? (
          <img
            src={tenant.theme.logoUrl}
            alt={tenant.name}
            className="h-8 mx-auto object-contain"
          />
        ) : (
          <h1 className="text-2xl font-bold text-foreground text-center">
            {tenant?.name ?? 'Acesso'}
          </h1>
        )}

        <p className="text-sm text-muted-foreground text-center">Faça login para continuar</p>

        <LoginForm onSubmit={login} isLoading={status === 'loading'} error={error} />

        {IS_DEV && (
          <div className="rounded-md border border-border bg-muted p-3 text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">Credenciais de desenvolvimento</p>
            <p>
              E-mail: <span className="font-mono">admin@demo.com</span>
            </p>
            <p>
              Senha: <span className="font-mono">admin123</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'

import { Card } from '@/components/ui'
import { ROUTES } from '@/router/routes'
import { useTenant } from '@/tenants'
import type { FeatureFlag } from '@/tenants/types'

interface ActionItem {
  label: string
  description: string
  to: string
  requiredFeature?: FeatureFlag
  accent: string
}

const ALL_ACTIONS: ActionItem[] = [
  {
    label: 'Nova transação',
    description: 'Registrar entrada ou saída',
    to: ROUTES.transactions,
    accent: 'bg-primary/10 text-primary',
  },
  {
    label: 'Relatórios',
    description: 'Análises e exportação de dados',
    to: ROUTES.reports,
    requiredFeature: 'reports',
    accent: 'bg-info/10 text-info',
  },
  {
    label: 'Investimentos',
    description: 'Acompanhar carteira',
    to: ROUTES.investments,
    requiredFeature: 'investments',
    accent: 'bg-success/10 text-success',
  },
  {
    label: 'Configurações',
    description: 'Perfil e preferências',
    to: ROUTES.settings,
    accent: 'bg-muted text-muted-foreground',
  },
]

/**
 * Renders navigation shortcuts filtered by the active tenant's feature flags.
 * Feature flag evaluation reads from tenant.features directly
 * (avoids calling useFeature() in a loop, which would violate rules-of-hooks ordering).
 */
export function QuickActions() {
  const { tenant } = useTenant()

  const visibleActions = ALL_ACTIONS.filter(
    action => !action.requiredFeature || tenant.features.includes(action.requiredFeature),
  )

  return (
    <Card>
      <Card.Header>
        <h2 className="text-sm font-semibold text-foreground">Ações rápidas</h2>
      </Card.Header>

      {/* No Card.Body here — items need full-width hover with their own padding */}
      <div className="divide-y divide-border">
        {visibleActions.map(action => (
          <Link
            key={action.to}
            to={action.to}
            className="flex items-center gap-3 px-6 py-3 hover:bg-muted transition-colors"
          >
            <span
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${action.accent}`}
              aria-hidden="true"
            >
              →
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">{action.label}</p>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  )
}

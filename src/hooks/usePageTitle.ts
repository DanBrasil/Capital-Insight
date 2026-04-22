import { useLocation } from 'react-router-dom'

import { ROUTES } from '@/router/routes'

const PAGE_TITLES: Record<string, string> = {
  [ROUTES.dashboard]: 'Dashboard',
  [ROUTES.transactions]: 'Transações',
  [ROUTES.reports]: 'Relatórios',
  [ROUTES.investments]: 'Investimentos',
  [ROUTES.portfolio]: 'Carteira',
  [ROUTES.operations]: 'Operações',
  [ROUTES.aiInsights]: 'AI Insights',
  [ROUTES.settings]: 'Configurações',
}

const DEFAULT_TITLE = 'Página'

/**
 * Returns a human-readable page title based on the current URL path.
 * Centralised here so Header stays free of routing knowledge.
 */
export function usePageTitle(): string {
  const { pathname } = useLocation()
  return PAGE_TITLES[pathname] ?? DEFAULT_TITLE
}

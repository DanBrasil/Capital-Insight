import { useMemo } from 'react'

import { useFeature } from '@/tenants'
import type { FeatureFlag } from '@/tenants'

import { ROUTES } from '@/router/routes'

export interface NavItem {
  label: string
  path: string
  /** Lucide icon name or inline SVG — kept as string for decoupling */
  iconName: string
}

interface NavItemDefinition extends NavItem {
  /** If set, item is only shown when this feature flag is active */
  requiredFeature?: FeatureFlag
}

const ALL_NAV_ITEMS: NavItemDefinition[] = [
  { label: 'Dashboard', path: ROUTES.dashboard, iconName: 'layout-dashboard' },
  { label: 'Transações', path: ROUTES.transactions, iconName: 'arrow-left-right' },
  {
    label: 'Relatórios',
    path: ROUTES.reports,
    iconName: 'bar-chart-2',
    requiredFeature: 'reports',
  },
  {
    label: 'Investimentos',
    path: ROUTES.investments,
    iconName: 'trending-up',
    requiredFeature: 'investments',
  },
  {
    label: 'Carteira',
    path: ROUTES.portfolio,
    iconName: 'briefcase',
    requiredFeature: 'portfolio',
  },
  {
    label: 'Operações',
    path: ROUTES.operations,
    iconName: 'list',
    requiredFeature: 'operations',
  },
  {
    label: 'AI Insights',
    path: ROUTES.aiInsights,
    iconName: 'sparkles',
    requiredFeature: 'ai-insights',
  },
  { label: 'Configurações', path: ROUTES.settings, iconName: 'settings' },
]

/**
 * Returns the navigation items the active tenant is allowed to see.
 * Feature-gated items are filtered out here — Sidebar receives a clean list.
 *
 * useMemo ensures the array reference is stable across renders.
 */
export function useNavigation(): NavItem[] {
  const hasReports = useFeature('reports')
  const hasInvestments = useFeature('investments')
  const hasPortfolio = useFeature('portfolio')
  const hasOperations = useFeature('operations')
  const hasAiInsights = useFeature('ai-insights')

  return useMemo(() => {
    const featureMap: Partial<Record<FeatureFlag, boolean>> = {
      reports: hasReports,
      investments: hasInvestments,
      portfolio: hasPortfolio,
      operations: hasOperations,
      'ai-insights': hasAiInsights,
    }

    return ALL_NAV_ITEMS.filter(item => {
      if (!item.requiredFeature) return true
      return featureMap[item.requiredFeature] ?? false
    })
  }, [hasReports, hasInvestments, hasPortfolio, hasOperations, hasAiInsights])
}

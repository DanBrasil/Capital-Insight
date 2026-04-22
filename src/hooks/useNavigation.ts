import { useMemo } from 'react'

import { useFeature } from '@/tenants'
import type { FeatureFlag } from '@/tenants'

import { ROUTES } from '@/router/routes'

export interface NavItem {
  label: string
  path: string
  /** Lucide icon name — mapped to component in NavIcon */
  iconName: string
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

interface NavItemDefinition extends NavItem {
  /** If set, item is only shown when this feature flag is active */
  requiredFeature?: FeatureFlag
  /** Group key for organizing items in sidebar sections */
  group: 'main' | 'finance' | 'analytics' | 'system'
}

const ALL_NAV_ITEMS: NavItemDefinition[] = [
  { label: 'Dashboard', path: ROUTES.dashboard, iconName: 'layout-dashboard', group: 'main' },
  { label: 'Transações', path: ROUTES.transactions, iconName: 'arrow-left-right', group: 'main' },
  {
    label: 'Investimentos',
    path: ROUTES.investments,
    iconName: 'trending-up',
    requiredFeature: 'investments',
    group: 'finance',
  },
  {
    label: 'Carteira',
    path: ROUTES.portfolio,
    iconName: 'briefcase',
    requiredFeature: 'portfolio',
    group: 'finance',
  },
  {
    label: 'Operações',
    path: ROUTES.operations,
    iconName: 'list',
    requiredFeature: 'operations',
    group: 'finance',
  },
  {
    label: 'Relatórios',
    path: ROUTES.reports,
    iconName: 'bar-chart-2',
    requiredFeature: 'reports',
    group: 'analytics',
  },
  {
    label: 'AI Insights',
    path: ROUTES.aiInsights,
    iconName: 'sparkles',
    requiredFeature: 'ai-insights',
    group: 'analytics',
  },
  { label: 'Configurações', path: ROUTES.settings, iconName: 'settings', group: 'system' },
]

const GROUP_LABELS: Record<NavItemDefinition['group'], string> = {
  main: '',
  finance: 'Finanças',
  analytics: 'Análises',
  system: 'Sistema',
}

const GROUP_ORDER: NavItemDefinition['group'][] = ['main', 'finance', 'analytics', 'system']

/**
 * Returns the navigation items grouped by section.
 * Feature-gated items are filtered out — Sidebar receives a clean list.
 * Groups with no visible items are omitted.
 */
export function useNavigation(): NavGroup[] {
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

    const filtered = ALL_NAV_ITEMS.filter(item => {
      if (!item.requiredFeature) return true
      return featureMap[item.requiredFeature] ?? false
    })

    return GROUP_ORDER.map(groupKey => ({
      label: GROUP_LABELS[groupKey],
      items: filtered
        .filter(item => item.group === groupKey)
        .map(({ label, path, iconName }) => ({ label, path, iconName })),
    })).filter(group => group.items.length > 0)
  }, [hasReports, hasInvestments, hasPortfolio, hasOperations, hasAiInsights])
}

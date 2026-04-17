import { useState } from 'react'

import { useAuth } from '@/modules/auth'
import { useTenant } from '@/tenants'

import { AlertBanner } from './AlertBanner'
import { DashboardHeader } from './DashboardHeader'
import { FinancialOverviewChart } from './FinancialOverviewChart'
import { QuickActions } from './QuickActions'
import { RecentTransactionsList } from './RecentTransactionsList'
import { SummaryCardsGrid } from './SummaryCardsGrid'
import type { DashboardPeriod } from '../types'

/**
 * Main dashboard orchestrator.
 *
 * Responsibilities:
 * - Owns the `period` state (single source of truth for all sections)
 * - Reads tenant locale / currency once and passes to child components
 * - Composes all sections — no data fetching here
 *
 * Each section manages its own loading/error state independently.
 */
export function DashboardView() {
  const [period, setPeriod] = useState<DashboardPeriod>('30d')
  const { user } = useAuth()
  const { tenant } = useTenant()

  const locale = tenant.appConfig.locale
  const currencyCode = tenant.appConfig.currencyCode

  return (
    <div className="space-y-6">
      <DashboardHeader
        userName={user?.name ?? tenant.name}
        period={period}
        onPeriodChange={setPeriod}
      />

      <SummaryCardsGrid period={period} locale={locale} currencyCode={currencyCode} />

      {/* Chart (2/3) + Quick actions (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FinancialOverviewChart period={period} />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      <RecentTransactionsList period={period} locale={locale} currencyCode={currencyCode} />

      {import.meta.env.DEV && (
        <AlertBanner
          variant="warning"
          message="Modo demo ativo — dados fictícios. Conecte uma API real via VITE_API_BASE_URL."
        />
      )}
    </div>
  )
}

import { Container } from '@/components/layout/Container'

import { useReportData } from '../hooks/useReportData'
import { useReportFilters } from '../hooks/useReportFilters'
import { AssetTypeDistributionChart } from './AssetTypeDistributionChart'
import { OperationsSummaryPanel } from './OperationsSummaryPanel'
import { PortfolioEvolutionChart } from './PortfolioEvolutionChart'
import { ReportSummaryCards } from './ReportSummaryCards'
import { ReportsEmptyState } from './ReportsEmptyState'
import { ReportsErrorState } from './ReportsErrorState'
import { ReportsFilters } from './ReportsFilters'
import { ReportsHeader } from './ReportsHeader'
import { ReportsSkeleton } from './ReportsSkeleton'
import { TopMoversReport } from './TopMoversReport'

/**
 * ReportsView — sole orchestrator for the Reports module.
 *
 * Owns:
 *  - filter state (via useReportFilters)
 *  - data fetching (via useReportData)
 *  - page-level state branching (loading / error / empty / success)
 *
 * Passes only typed props downward — zero business logic in children.
 */
export function ReportsView() {
  const { filters, setPeriod, setCustomRange } = useReportFilters()
  const { data, isLoading, isError, refetch } = useReportData(filters)

  if (isLoading) {
    return (
      <Container>
        <ReportsSkeleton />
      </Container>
    )
  }

  if (isError) {
    return (
      <Container>
        <ReportsErrorState onRetry={() => void refetch()} />
      </Container>
    )
  }

  const hasData = data && data.summary.currentValue > 0

  if (!hasData) {
    return (
      <Container>
        <ReportsEmptyState />
      </Container>
    )
  }

  return (
    <Container>
      <div className="flex flex-col gap-6">
        <ReportsHeader activePeriod={filters.period} />

        <ReportsFilters
          filters={filters}
          onPeriodChange={setPeriod}
          onCustomRangeChange={setCustomRange}
        />

        <ReportSummaryCards summary={data.summary} />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <PortfolioEvolutionChart series={data.timeSeries} />
          <AssetTypeDistributionChart distribution={data.distribution} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <TopMoversReport gainers={data.topGainers} losers={data.topLosers} />
          <OperationsSummaryPanel aggregate={data.operationsAggregate} />
        </div>
      </div>
    </Container>
  )
}

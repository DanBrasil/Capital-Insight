import { Button } from '@/components/ui/Button'
import { Input } from '@/components/form/Input'

import type { ReportPeriod, ReportFilters } from '../types'

const PRESET_PERIODS: { label: string; value: ReportPeriod }[] = [
  { label: '7d', value: '7d' },
  { label: '30d', value: '30d' },
  { label: '3m', value: '3m' },
  { label: '6m', value: '6m' },
  { label: '1a', value: '1y' },
]

interface ReportsFiltersProps {
  filters: ReportFilters
  onPeriodChange: (period: ReportPeriod) => void
  onCustomRangeChange: (startDate: string, endDate: string) => void
}

export function ReportsFilters({
  filters,
  onPeriodChange,
  onCustomRangeChange,
}: ReportsFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {PRESET_PERIODS.map(({ label, value }) => (
        <Button
          key={value}
          variant={filters.period === value ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onPeriodChange(value)}
        >
          {label}
        </Button>
      ))}

      <Button
        variant={filters.period === 'custom' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => onPeriodChange('custom')}
      >
        Personalizado
      </Button>

      {filters.period === 'custom' && (
        <div className="flex items-center gap-2">
          <Input
            id="report-start-date"
            type="date"
            value={filters.startDate ?? ''}
            onChange={e => onCustomRangeChange(e.target.value, filters.endDate ?? e.target.value)}
            className="h-8 text-sm"
          />
          <span className="text-foreground/50 text-xs">até</span>
          <Input
            id="report-end-date"
            type="date"
            value={filters.endDate ?? ''}
            onChange={e => onCustomRangeChange(filters.startDate ?? e.target.value, e.target.value)}
            className="h-8 text-sm"
          />
        </div>
      )}
    </div>
  )
}

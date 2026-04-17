import type { DashboardPeriod } from '../types'

const PERIODS: { value: DashboardPeriod; label: string }[] = [
  { value: 'today', label: 'Hoje' },
  { value: '7d', label: '7 dias' },
  { value: '30d', label: '30 dias' },
  { value: 'current-month', label: 'Mês atual' },
]

interface DashboardHeaderProps {
  userName: string
  period: DashboardPeriod
  onPeriodChange: (period: DashboardPeriod) => void
}

/** Page header — greeting derived from time of day + period selector tabs */
export function DashboardHeader({ userName, period, onPeriodChange }: DashboardHeaderProps) {
  const firstName = userName.split(' ')[0]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-bold text-foreground">
          {greeting}, {firstName}
        </h1>
        <p className="text-sm text-muted-foreground">Aqui está o resumo da sua operação</p>
      </div>

      {/* Period tabs */}
      <div className="flex gap-1 rounded-lg bg-muted p-1 self-start sm:self-auto">
        {PERIODS.map(p => (
          <button
            key={p.value}
            type="button"
            onClick={() => onPeriodChange(p.value)}
            className={[
              'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
              period === p.value
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            ].join(' ')}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  )
}

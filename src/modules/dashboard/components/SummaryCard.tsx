import type { ReactNode } from 'react'

import { formatPercent } from '../utils/formatters'

interface SummaryCardProps {
  label: string
  /** Pre-formatted display value (e.g. "R$ 12.450,00" or "47") */
  formattedValue: string
  /** Percentage variation vs previous period */
  variation: number
  icon: ReactNode
  /**
   * When true, a negative variation is rendered green (down is good).
   * Used for the "expenses" metric — spending less is positive.
   */
  inverseVariation?: boolean
}

export function SummaryCard({
  label,
  formattedValue,
  variation,
  icon,
  inverseVariation = false,
}: SummaryCardProps) {
  const isGood = inverseVariation ? variation <= 0 : variation >= 0

  return (
    <div className="rounded-lg border border-border bg-card p-5 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
          {icon}
        </span>
      </div>

      <p className="text-2xl font-bold text-foreground tabular-nums">{formattedValue}</p>

      <p className={`text-xs font-medium ${isGood ? 'text-success' : 'text-error'}`}>
        {formatPercent(variation)} vs período anterior
      </p>
    </div>
  )
}

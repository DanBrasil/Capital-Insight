interface PortfolioSummaryCardProps {
  label: string
  /** Pre-formatted value string (currency or percent) */
  formattedValue: string
  /** When provided, renders a colored indicator (green/red) */
  sentiment?: 'positive' | 'negative' | 'neutral'
  /** Secondary text below the main value (e.g. a percentage next to a currency amount) */
  secondary?: string
}

/**
 * Single metric card for the portfolio summary strip.
 * All values arrive pre-formatted — this component never performs arithmetic.
 */
export function PortfolioSummaryCard({
  label,
  formattedValue,
  sentiment = 'neutral',
  secondary,
}: PortfolioSummaryCardProps) {
  const valueColor =
    sentiment === 'positive'
      ? 'text-success'
      : sentiment === 'negative'
        ? 'text-error'
        : 'text-foreground'

  return (
    <div className="rounded-lg border border-border bg-card p-5 space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={['text-2xl font-bold tabular-nums', valueColor].join(' ')}>{formattedValue}</p>
      {secondary && (
        <p className={['text-sm font-medium tabular-nums', valueColor].join(' ')}>{secondary}</p>
      )}
    </div>
  )
}

/**
 * Custom tooltip rendered by Recharts via the `content` prop.
 *
 * Recharts passes `active`, `payload`, and `label` to whatever component
 * is given as the tooltip `content`. We accept those props and additionally
 * receive `formatValue` and `formatLabel` from the chart component's closure.
 *
 * Styling intentionally avoids the Card component — the tooltip is a floating
 * element with its own visual identity (compact, shadow, no header/body split).
 */

interface TooltipPayloadItem {
  name: string
  value: number
  color: string
  dataKey: string
}

export interface ChartTooltipContentProps {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
  formatValue?: (v: number) => string
  formatLabel?: (l: string) => string
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  formatValue,
  formatLabel,
}: ChartTooltipContentProps) {
  if (!active || !payload?.length) return null

  const displayLabel = formatLabel ? formatLabel(String(label ?? '')) : label

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg text-xs min-w-[120px]">
      {displayLabel && (
        <p className="mb-2 font-medium text-foreground/60 border-b border-border pb-1.5">
          {displayLabel}
        </p>
      )}
      <div className="flex flex-col gap-1">
        {payload.map(item => (
          <div key={item.dataKey} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span
                className="inline-block h-2 w-2 flex-shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-foreground/60">{item.name}</span>
            </div>
            <span className="font-semibold text-foreground tabular-nums">
              {formatValue ? formatValue(item.value) : String(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

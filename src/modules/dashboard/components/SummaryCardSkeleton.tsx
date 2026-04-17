/** Loading placeholder that mirrors SummaryCard's visual footprint */
export function SummaryCardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-5 space-y-2 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-3 w-20 rounded bg-muted" />
        <div className="h-8 w-8 rounded-full bg-muted" />
      </div>
      <div className="h-7 w-28 rounded bg-muted" />
      <div className="h-3 w-36 rounded bg-muted" />
    </div>
  )
}

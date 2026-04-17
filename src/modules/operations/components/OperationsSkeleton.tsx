interface OperationsSkeletonProps {
  rows?: number
}

export function OperationsSkeleton({ rows = 6 }: OperationsSkeletonProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden animate-pulse">
      {/* Header row */}
      <div className="flex gap-4 px-4 py-2.5 bg-muted/40 border-b border-border">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-3 rounded bg-muted"
            style={{ width: `${[80, 140, 60, 80, 80][i]}px` }}
          />
        ))}
      </div>
      {/* Data rows */}
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3">
            <div className="h-3.5 w-20 rounded bg-muted hidden sm:block" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3.5 w-14 rounded bg-muted" />
              <div className="h-3 w-32 rounded bg-muted" />
            </div>
            <div className="h-5 w-14 rounded-full bg-muted" />
            <div className="h-3.5 w-16 rounded bg-muted hidden sm:block" />
            <div className="h-3.5 w-20 rounded bg-muted" />
            <div className="flex gap-2">
              <div className="h-6 w-6 rounded bg-muted" />
              <div className="h-6 w-6 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

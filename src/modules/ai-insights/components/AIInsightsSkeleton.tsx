/**
 * Full-page loading skeleton shown during AI generation.
 * Mirrors the real layout: summary card + 3 section cards.
 */
export function AIInsightsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Summary card */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="mb-3 h-4 w-24 rounded bg-muted" />
        <div className="space-y-2">
          <div className="h-3.5 w-full rounded bg-muted" />
          <div className="h-3.5 w-5/6 rounded bg-muted" />
          <div className="h-3.5 w-4/6 rounded bg-muted" />
        </div>
      </div>

      {/* Section cards */}
      {[1, 2, 3].map(i => (
        <div key={i} className="rounded-lg border border-border bg-card p-5">
          <div className="mb-3 h-4 w-40 rounded bg-muted" />
          <div className="space-y-2">
            <div className="h-3.5 w-full rounded bg-muted" />
            <div className="h-3.5 w-11/12 rounded bg-muted" />
            <div className="h-3.5 w-4/5 rounded bg-muted" />
            <div className="h-3.5 w-full rounded bg-muted" />
            <div className="h-3.5 w-3/4 rounded bg-muted" />
          </div>
        </div>
      ))}

      {/* Meta info */}
      <div className="flex justify-between">
        <div className="h-3 w-48 rounded bg-muted" />
        <div className="h-3 w-32 rounded bg-muted" />
      </div>
    </div>
  )
}

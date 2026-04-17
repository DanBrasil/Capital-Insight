/**
 * SettingsSkeleton — shown while the initial settings data is loading.
 *
 * Matches the rough visual weight of the settings layout so the page
 * does not shift when content arrives.
 */
export function SettingsSkeleton() {
  return (
    <div role="status" aria-label="Carregando configurações" className="animate-pulse space-y-6">
      {/* Tab bar skeleton */}
      <div className="flex gap-4 border-b border-border pb-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-8 w-24 rounded bg-muted" />
        ))}
      </div>

      {/* Card header skeleton */}
      <div className="rounded-lg border border-border p-6 space-y-4">
        <div className="space-y-2">
          <div className="h-5 w-32 rounded bg-muted" />
          <div className="h-3.5 w-64 rounded bg-muted" />
        </div>

        {/* Form fields skeleton */}
        <div className="space-y-4 pt-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-3.5 w-20 rounded bg-muted" />
              <div className="h-10 w-full rounded-md bg-muted" />
            </div>
          ))}
        </div>

        {/* Footer skeleton */}
        <div className="flex justify-end pt-2">
          <div className="h-9 w-28 rounded-md bg-muted" />
        </div>
      </div>
    </div>
  )
}

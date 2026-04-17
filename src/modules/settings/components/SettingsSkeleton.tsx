import { Skeleton, SkeletonButton, SkeletonText } from '@/components/ui'

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
          <Skeleton key={i} className="h-8 w-24" />
        ))}
      </div>

      {/* Card header skeleton */}
      <div className="rounded-lg border border-border p-6 space-y-4">
        <div className="space-y-2">
          <SkeletonText size="xl" width="w-32" />
          <SkeletonText width="w-64" />
        </div>

        {/* Form fields skeleton */}
        <div className="space-y-4 pt-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <SkeletonText width="w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>

        {/* Footer skeleton */}
        <div className="flex justify-end pt-2">
          <SkeletonButton width="w-28" size="sm" />
        </div>
      </div>
    </div>
  )
}

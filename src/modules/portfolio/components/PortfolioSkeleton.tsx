import { Skeleton, SkeletonButton, SkeletonText } from '@/components/ui'

/**
 * Loading skeleton that mirrors the real layout.
 * Prevents layout shift and gives users immediate visual feedback.
 */
export function PortfolioSkeleton() {
  return (
    <div role="status" aria-label="Carregando portfólio" className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <SkeletonText size="2xl" width="w-40" />
          <SkeletonText size="lg" width="w-64" />
        </div>
        <SkeletonButton width="w-24" />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-5 space-y-2">
            <SkeletonText size="sm" width="w-24" />
            <SkeletonText size="2xl" width="w-32" />
          </div>
        ))}
      </div>

      {/* Content area */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Table skeleton */}
        <div className="lg:col-span-2 rounded-lg border border-border bg-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <SkeletonText size="lg" width="w-20" />
          </div>
          <div className="divide-y divide-border">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3">
                <div className="space-y-1.5 flex-1">
                  <SkeletonText size="lg" width="w-16" />
                  <SkeletonText size="sm" width="w-28" />
                </div>
                <SkeletonText size="lg" width="w-20" />
                <SkeletonText size="lg" width="w-16" />
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar skeleton */}
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-5 space-y-3">
            <SkeletonText size="lg" width="w-20" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <SkeletonText size="sm" width="w-24" />
                <SkeletonText size="sm" width="w-16" />
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-border bg-card p-5 space-y-3">
            <SkeletonText size="lg" width="w-24" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between">
                  <SkeletonText size="sm" width="w-12" />
                  <SkeletonText size="sm" width="w-10" />
                </div>
                <Skeleton className="h-1.5 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

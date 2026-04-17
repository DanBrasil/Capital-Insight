import { SkeletonText } from '@/components/ui'

/**
 * Full-page loading skeleton shown during AI generation.
 * Mirrors the real layout: summary card + 3 section cards.
 */
export function AIInsightsSkeleton() {
  return (
    <div role="status" aria-label="Gerando análise..." className="space-y-4 animate-pulse">
      {/* Summary card */}
      <div className="rounded-lg border border-border bg-card p-5">
        <SkeletonText size="lg" width="w-24" className="mb-3" />
        <div className="space-y-2">
          <SkeletonText />
          <SkeletonText width="w-5/6" />
          <SkeletonText width="w-4/6" />
        </div>
      </div>

      {/* Section cards */}
      {[1, 2, 3].map(i => (
        <div key={i} className="rounded-lg border border-border bg-card p-5">
          <SkeletonText size="lg" width="w-40" className="mb-3" />
          <div className="space-y-2">
            <SkeletonText />
            <SkeletonText width="w-11/12" />
            <SkeletonText width="w-4/5" />
            <SkeletonText />
            <SkeletonText width="w-3/4" />
          </div>
        </div>
      ))}

      {/* Meta info */}
      <div className="flex justify-between">
        <SkeletonText size="sm" width="w-48" />
        <SkeletonText size="sm" width="w-32" />
      </div>
    </div>
  )
}

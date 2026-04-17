import { SkeletonAvatar, SkeletonText } from '@/components/ui'

/** Loading placeholder that mirrors SummaryCard's visual footprint */
export function SummaryCardSkeleton() {
  return (
    <div
      role="status"
      aria-label="Carregando"
      className="rounded-lg border border-border bg-card p-5 space-y-2 animate-pulse"
    >
      <div className="flex items-center justify-between">
        <SkeletonText size="sm" width="w-20" />
        <SkeletonAvatar size={8} />
      </div>
      <SkeletonText size="2xl" width="w-28" />
      <SkeletonText size="sm" width="w-36" />
    </div>
  )
}

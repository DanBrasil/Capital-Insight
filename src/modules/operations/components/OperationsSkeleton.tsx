import { Skeleton, SkeletonText } from '@/components/ui'

interface OperationsSkeletonProps {
  rows?: number
}

export function OperationsSkeleton({ rows = 6 }: OperationsSkeletonProps) {
  const COL_WIDTHS = ['w-20', 'w-36', 'w-16', 'w-20', 'w-20'] as const

  return (
    <div
      role="status"
      aria-label="Carregando operações"
      className="rounded-lg border border-border bg-card overflow-hidden animate-pulse"
    >
      {/* Header row */}
      <div className="flex gap-4 px-4 py-2.5 bg-muted/40 border-b border-border">
        {COL_WIDTHS.map((w, i) => (
          <SkeletonText key={i} size="sm" width={w} />
        ))}
      </div>
      {/* Data rows */}
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3">
            <SkeletonText width="w-20" className="hidden sm:block" />
            <div className="space-y-1.5 flex-1">
              <SkeletonText width="w-14" />
              <SkeletonText size="sm" width="w-32" />
            </div>
            <Skeleton className="h-5 w-14 rounded-full" />
            <SkeletonText width="w-16" className="hidden sm:block" />
            <SkeletonText width="w-20" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import { Card } from '@/components/ui/Card'
import { Skeleton, SkeletonText } from '@/components/ui'

export function ReportsSkeleton() {
  return (
    <div
      role="status"
      aria-label="Carregando relatórios"
      className="flex flex-col gap-6 animate-pulse"
    >
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <SkeletonText size="2xl" width="w-32" />
          <SkeletonText size="lg" width="w-52" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-12" />
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <Card.Body className="flex flex-col gap-2 p-4">
              <SkeletonText size="sm" width="w-20" />
              <SkeletonText size="xl" width="w-28" />
              <SkeletonText size="sm" width="w-16" />
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <Card.Header>
              <SkeletonText size="lg" width="w-36" />
            </Card.Header>
            <Card.Body className="p-4">
              <Skeleton className="h-40 w-full" />
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <Card.Header>
              <SkeletonText size="lg" width="w-28" />
            </Card.Header>
            <Card.Body className="p-4">
              <Skeleton className="h-28 w-full" />
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  )
}

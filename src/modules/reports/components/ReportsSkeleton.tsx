import { Card } from '@/components/ui/Card'

export function ReportsSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="h-7 w-32 rounded-md bg-muted" />
          <div className="h-4 w-52 rounded-md bg-muted" />
        </div>
        <div className="h-6 w-24 rounded-full bg-muted" />
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 w-12 rounded-md bg-muted" />
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <Card.Body className="flex flex-col gap-2 p-4">
              <div className="h-3 w-20 rounded bg-muted" />
              <div className="h-6 w-28 rounded bg-muted" />
              <div className="h-3 w-16 rounded bg-muted" />
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <Card.Header>
              <div className="h-4 w-36 rounded bg-muted" />
            </Card.Header>
            <Card.Body className="p-4">
              <div className="h-40 w-full rounded bg-muted" />
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <Card.Header>
              <div className="h-4 w-28 rounded bg-muted" />
            </Card.Header>
            <Card.Body className="p-4">
              <div className="h-28 w-full rounded bg-muted" />
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  )
}

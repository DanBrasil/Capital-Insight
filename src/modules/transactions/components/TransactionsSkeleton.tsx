import { Skeleton, SkeletonText } from '@/components/ui'

interface TransactionsSkeletonProps {
  rows?: number
}

/**
 * Skeleton rows for the transactions table.
 * Rendered inside <tbody> so the table header remains visible during load.
 */
export function TransactionsSkeleton({ rows = 8 }: TransactionsSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-border animate-pulse">
          <td className="px-4 py-3 hidden sm:table-cell">
            <SkeletonText size="lg" width="w-20" />
          </td>
          <td className="px-4 py-3">
            <div className="space-y-1">
              <SkeletonText size="lg" width="w-32" />
              <SkeletonText size="sm" width="w-20" />
            </div>
          </td>
          <td className="px-4 py-3 hidden md:table-cell">
            <SkeletonText size="lg" width="w-20" />
          </td>
          <td className="px-4 py-3 hidden sm:table-cell">
            <Skeleton className="h-5 w-16 rounded-full" />
          </td>
          <td className="px-4 py-3 text-right">
            <SkeletonText size="lg" width="w-24" className="ml-auto" />
          </td>
          <td className="px-4 py-3 hidden lg:table-cell">
            <Skeleton className="h-5 w-16 rounded-full" />
          </td>
          <td className="px-4 py-3" />
        </tr>
      ))}
    </>
  )
}

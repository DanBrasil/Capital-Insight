import { Suspense } from 'react'

import { Spinner } from '@/components/ui'

interface PageSuspenseProps {
  children: React.ReactNode
}

/**
 * Shared Suspense boundary for lazy-loaded pages.
 * Shows a centered spinner while the page chunk is being fetched.
 */
export function PageSuspense({ children }: PageSuspenseProps) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center py-20">
          <Spinner size="lg" aria-label="Carregando página" />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

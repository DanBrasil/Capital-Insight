import { Navigate } from 'react-router-dom'

import { useFeature } from '@/tenants'
import type { FeatureFlag } from '@/tenants'
import { ROUTES } from '@/router/routes'

interface FeatureRouteProps {
  flag: FeatureFlag
  children: React.ReactNode
}

/**
 * Route-level feature guard.
 * If the tenant does not have the required feature enabled,
 * the user is redirected to the unauthorized page.
 *
 * @example
 * <Route path="/portfolio" element={
 *   <FeatureRoute flag="portfolio"><PortfolioPage /></FeatureRoute>
 * } />
 */
export function FeatureRoute({ flag, children }: FeatureRouteProps) {
  const isEnabled = useFeature(flag)

  if (!isEnabled) {
    return <Navigate to={ROUTES.unauthorized} replace />
  }

  return <>{children}</>
}

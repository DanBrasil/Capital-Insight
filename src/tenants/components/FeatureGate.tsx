import { useFeature } from '../hooks/useFeature'
import type { FeatureFlag } from '../types'

interface FeatureGateProps {
  flag: FeatureFlag
  children: React.ReactNode
  /** Optional fallback rendered when the feature is disabled */
  fallback?: React.ReactNode
}

/**
 * Declarative feature flag wrapper.
 * Keeps conditional rendering out of domain components and pages.
 *
 * @example
 * <FeatureGate flag="reports">
 *   <ReportsModule />
 * </FeatureGate>
 *
 * @example with fallback
 * <FeatureGate flag="investments" fallback={<UpgradeBanner />}>
 *   <InvestmentsModule />
 * </FeatureGate>
 */
export function FeatureGate({ flag, children, fallback = null }: FeatureGateProps) {
  const isEnabled = useFeature(flag)
  return isEnabled ? <>{children}</> : <>{fallback}</>
}

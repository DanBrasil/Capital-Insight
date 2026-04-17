import type { FeatureFlag } from '../types'
import { useTenant } from './useTenant'

/**
 * Returns true if the active tenant has the given feature flag enabled.
 *
 * Centralizing this here means if the source of truth for features ever changes
 * (e.g. remote feature flag service), only this hook needs to be updated —
 * all consumers remain unchanged.
 *
 * @example
 * const canViewReports = useFeature('reports')
 */
export function useFeature(flag: FeatureFlag): boolean {
  const { tenant } = useTenant()
  return tenant.features.includes(flag)
}

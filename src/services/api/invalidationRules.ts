import type { QueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from './constants'

/**
 * Centralized cache invalidation rules.
 *
 * This is the single place that encodes the domain relationship:
 *   "when entity X mutates, which caches become stale?"
 *
 * Every mutation hook MUST use these helpers instead of manually
 * listing queryKey invalidations. This prevents:
 * - Forgetting to invalidate a derived cache (e.g. dashboard after transaction create)
 * - Duplicating invalidation logic across hooks
 * - Drift when new modules are added
 */
export const invalidate = {
  /**
   * After creating/updating/deleting a TRANSACTION.
   * Transactions feed into: transactions list + dashboard (recent + summary).
   */
  transactions(qc: QueryClient) {
    qc.invalidateQueries({ queryKey: QUERY_KEYS.transactions() })
    qc.invalidateQueries({ queryKey: ['dashboard'] })
  },

  /**
   * After creating/updating/deleting an OPERATION.
   * Operations feed into: operations list + portfolio + reports.
   */
  operations(qc: QueryClient) {
    qc.invalidateQueries({ queryKey: QUERY_KEYS.operations() })
    qc.invalidateQueries({ queryKey: QUERY_KEYS.portfolio() })
    qc.invalidateQueries({ queryKey: ['reports'] })
  },

  /**
   * After changing user SETTINGS.
   */
  settings(qc: QueryClient) {
    qc.invalidateQueries({ queryKey: QUERY_KEYS.settings() })
  },
} as const

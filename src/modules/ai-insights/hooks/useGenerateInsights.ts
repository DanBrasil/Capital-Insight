import { useMutation } from '@tanstack/react-query'

import { insightService } from '../services/insightService'
import type { AIInsightInput, AIInsightResult } from '../types'

/**
 * Wraps insightService.generate in a React Query mutation.
 *
 * The mutation is NOT added to the global query cache — AI insights are
 * session-local and generated on demand. The caller stores the result
 * in component state via onSuccess.
 *
 * Returns standard useMutation fields: mutate, isPending, isError, reset.
 */
export function useGenerateInsights() {
  return useMutation<AIInsightResult, Error, AIInsightInput>({
    mutationFn: (input: AIInsightInput) => insightService.generate(input),
    retry: 0, // AI calls are expensive — do not auto-retry on failure
  })
}

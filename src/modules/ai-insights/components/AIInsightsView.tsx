import { useState } from 'react'

import { useTenant } from '@/tenants'
import { usePortfolio } from '@/modules/portfolio/hooks/usePortfolio'
import { useOperations } from '@/modules/operations/hooks/useOperations'
import { DEFAULT_OPERATION_FILTERS } from '@/modules/operations/types'

import { useGenerateInsights } from '../hooks/useGenerateInsights'
import { buildInsightInput, hasInsufficientData } from '../utils/buildInsightInput'
import type { AIInsightResult } from '../types'

import { AIInsightsHeader } from './AIInsightsHeader'
import { AIInsightsEmptyState } from './AIInsightsEmptyState'
import { AIInsightsErrorState } from './AIInsightsErrorState'
import { AIInsightsSkeleton } from './AIInsightsSkeleton'
import { AIInsightSummaryCard } from './AIInsightSummaryCard'
import { AIInsightSectionList } from './AIInsightSectionList'
import { AIInsightsWarnings } from './AIInsightsWarnings'
import { AIInsightsMetaInfo } from './AIInsightsMetaInfo'
import { RegenerateInsightsButton } from './RegenerateInsightsButton'

/**
 * AI Insights module orchestrator.
 *
 * Owns:
 * - portfolio data (read-only, via usePortfolio)
 * - recent operations (read-only, via useOperations)
 * - last generated insight result (local state — not persisted to cache)
 * - generation mutation lifecycle
 *
 * Does NOT: compute portfolio values, render positions, or call providers directly.
 */
export function AIInsightsView() {
  const { tenant } = useTenant()
  const { locale, currencyCode } = tenant.appConfig

  // ── Source data (read-only) ──────────────────────────────────────────────
  const { data: portfolioData } = usePortfolio()
  const { data: operations } = useOperations(DEFAULT_OPERATION_FILTERS)

  // ── Generation ───────────────────────────────────────────────────────────
  const mutation = useGenerateInsights()
  const [result, setResult] = useState<AIInsightResult | null>(null)

  const insufficient = hasInsufficientData(portfolioData)

  function triggerGeneration() {
    if (!portfolioData || insufficient) return

    const input = buildInsightInput(portfolioData, operations ?? [], currencyCode, locale)

    mutation.reset()
    mutation.mutate(input, {
      onSuccess: data => setResult(data),
    })
  }

  // ── Derived state ────────────────────────────────────────────────────────
  const isGenerating = mutation.isPending
  const hasError = mutation.isError && !result
  const hasResult = result !== null && !isGenerating

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <AIInsightsHeader
        hasResult={hasResult}
        onGenerate={triggerGeneration}
        isGenerating={isGenerating}
        canGenerate={!insufficient}
      />

      {/* Generating — show skeleton */}
      {isGenerating && <AIInsightsSkeleton />}

      {/* Error without any prior result */}
      {hasError && <AIInsightsErrorState onRetry={triggerGeneration} />}

      {/* No result yet (and not generating) */}
      {!isGenerating && !hasError && !hasResult && (
        <AIInsightsEmptyState
          insufficientData={insufficient}
          onGenerate={triggerGeneration}
          isGenerating={isGenerating}
        />
      )}

      {/* Successful result */}
      {hasResult && result && (
        <>
          <AIInsightSummaryCard summary={result.summary} />
          <AIInsightSectionList sections={result.sections} />
          <AIInsightsWarnings warnings={result.warnings} />
          <AIInsightsMetaInfo
            generatedAt={result.generatedAt}
            sourceVersion={result.sourceVersion}
          />
          <RegenerateInsightsButton onRegenerate={triggerGeneration} isGenerating={isGenerating} />
        </>
      )}
    </div>
  )
}

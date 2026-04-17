interface AIInsightSummaryCardProps {
  summary: string
}

/**
 * Highlights the executive summary with a visually distinct treatment.
 * Intentionally larger and more prominent than the section cards.
 */
export function AIInsightSummaryCard({ summary }: AIInsightSummaryCardProps) {
  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-5">
      <div className="mb-2 flex items-center gap-2">
        <svg
          className="h-4 w-4 text-primary"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
        <span className="text-xs font-semibold uppercase tracking-wide text-primary">
          Resumo geral
        </span>
      </div>
      <p className="text-sm leading-relaxed text-foreground">{summary}</p>
    </div>
  )
}

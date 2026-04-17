interface AIInsightsWarningsProps {
  warnings: string[]
}

/**
 * Renders descriptive observations that deserve attention.
 * Intentionally separate from the section cards — uses a distinct bg
 * to signal "read this carefully".
 *
 * Hidden entirely when warnings list is empty.
 */
export function AIInsightsWarnings({ warnings }: AIInsightsWarningsProps) {
  if (warnings.length === 0) return null

  return (
    <div className="rounded-lg border border-yellow-300/50 bg-yellow-50/60 dark:bg-yellow-900/10 dark:border-yellow-700/30 p-4">
      <div className="mb-2 flex items-center gap-2">
        <svg
          className="h-4 w-4 text-yellow-600 dark:text-yellow-400 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span className="text-xs font-semibold uppercase tracking-wide text-yellow-700 dark:text-yellow-400">
          Observações
        </span>
      </div>
      <ul className="space-y-1.5">
        {warnings.map((w, i) => (
          <li key={i} className="text-sm leading-relaxed text-yellow-800 dark:text-yellow-200">
            {w}
          </li>
        ))}
      </ul>
    </div>
  )
}

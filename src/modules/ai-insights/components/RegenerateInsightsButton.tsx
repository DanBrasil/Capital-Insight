interface RegenerateInsightsButtonProps {
  onRegenerate: () => void
  isGenerating: boolean
}

/**
 * Secondary action button — shown below the result to allow regeneration.
 * Uses a quieter style (ghost/outline) to not compete with the content.
 */
export function RegenerateInsightsButton({
  onRegenerate,
  isGenerating,
}: RegenerateInsightsButtonProps) {
  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={onRegenerate}
        disabled={isGenerating}
        className="flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg
          className={['h-4 w-4', isGenerating ? 'animate-spin' : ''].join(' ')}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M3 21v-5h5" />
        </svg>
        {isGenerating ? 'Regenerando...' : 'Regenerar análise'}
      </button>
    </div>
  )
}

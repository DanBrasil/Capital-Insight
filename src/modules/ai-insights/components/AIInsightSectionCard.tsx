import type { AIInsightSection } from '../types'

interface AIInsightSectionCardProps {
  section: AIInsightSection
}

/**
 * Renders a single thematic section.
 * Uses a native <details> element on mobile for collapsible behavior —
 * zero JS, zero extra dependencies.
 */
export function AIInsightSectionCard({ section }: AIInsightSectionCardProps) {
  // Render paragraphs split by double newline
  const paragraphs = section.content.split(/\n{2,}/).filter(p => p.trim().length > 0)

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Desktop: always expanded */}
      <div className="hidden sm:block p-5">
        <h3 className="mb-3 text-sm font-semibold text-foreground">{section.title}</h3>
        <div className="space-y-2">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-muted-foreground">
              {p.trim()}
            </p>
          ))}
        </div>
      </div>

      {/* Mobile: collapsible */}
      <details className="sm:hidden group">
        <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-semibold text-foreground list-none">
          {section.title}
          <svg
            className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </summary>
        <div className="px-4 pb-4 space-y-2">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-muted-foreground">
              {p.trim()}
            </p>
          ))}
        </div>
      </details>
    </div>
  )
}

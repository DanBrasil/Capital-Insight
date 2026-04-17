import type { AIInsightSection } from '../types'
import { AIInsightSectionCard } from './AIInsightSectionCard'

interface AIInsightSectionListProps {
  sections: AIInsightSection[]
}

/** Renders the ordered list of thematic section cards. */
export function AIInsightSectionList({ sections }: AIInsightSectionListProps) {
  if (sections.length === 0) return null

  return (
    <div className="space-y-3">
      {sections.map(section => (
        <AIInsightSectionCard key={section.id} section={section} />
      ))}
    </div>
  )
}

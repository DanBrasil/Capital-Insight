import type { ReactNode } from 'react'

import { Card } from '@/components/ui/Card'
import { Heading, Text } from '@/components/ui/Typography'

interface SettingsSectionCardProps {
  /** Short section title shown in the card header */
  title: string
  /** One-sentence description of what this section controls */
  description: string
  /** The form or content for this section */
  children: ReactNode
  /** Save button + feedback rendered in the card footer */
  footer: ReactNode
  /** ARIA panel id (matches `aria-controls` in the tab bar) */
  panelId?: string
}

/**
 * Wrapper used by every settings form section.
 *
 * Handles layout consistency: a Card with a styled header (title + description),
 * a body with the form fields, and a footer with the submit action and feedback.
 * The component is purely presentational — forms and mutation state live in
 * the specific form components below.
 */
export function SettingsSectionCard({
  title,
  description,
  children,
  footer,
  panelId,
}: SettingsSectionCardProps) {
  return (
    <Card
      role="tabpanel"
      id={panelId}
      aria-labelledby={panelId ? panelId.replace('panel', 'tab') : undefined}
    >
      <Card.Header>
        <Heading level="h2" className="text-base font-semibold text-foreground">
          {title}
        </Heading>
        <Text variant="small" className="mt-0.5 text-muted-foreground">
          {description}
        </Text>
      </Card.Header>

      <Card.Body>{children}</Card.Body>

      <Card.Footer className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
        {footer}
      </Card.Footer>
    </Card>
  )
}

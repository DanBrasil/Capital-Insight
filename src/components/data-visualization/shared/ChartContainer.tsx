import type { ReactNode } from 'react'

import { Card } from '@/components/ui/Card'
import { Text } from '@/components/ui/Typography'

import { ChartEmptyState } from './ChartEmptyState'
import { ChartLoadingState } from './ChartLoadingState'

interface ChartContainerProps {
  title?: string
  subtitle?: string
  isLoading?: boolean
  isEmpty?: boolean
  emptyMessage?: string
  /** Passed to ChartLoadingState so the skeleton has the same footprint. */
  height?: number
  children: ReactNode
  className?: string
}

/**
 * Standard wrapper for all chart components in the application.
 *
 * Responsibilities:
 * - Renders the Card shell (border, background, rounded)
 * - Displays optional title and subtitle
 * - Orchestrates loading / empty / content states
 *
 * Usage:
 *   <ChartContainer title="Evolução da Carteira" isLoading={isLoading} isEmpty={!data.length}>
 *     <AreaChart data={data} series={series} config={config} />
 *   </ChartContainer>
 */
export function ChartContainer({
  title,
  subtitle,
  isLoading = false,
  isEmpty = false,
  emptyMessage,
  height = 200,
  children,
  className = '',
}: ChartContainerProps) {
  return (
    <Card className={className}>
      {(title ?? subtitle) && (
        <Card.Header>
          {title && <Text className="text-sm font-semibold text-foreground">{title}</Text>}
          {subtitle && (
            <Text variant="small" className="mt-0.5 text-foreground/60">
              {subtitle}
            </Text>
          )}
        </Card.Header>
      )}
      <Card.Body className="p-4">
        {isLoading ? (
          <ChartLoadingState height={height} />
        ) : isEmpty ? (
          <ChartEmptyState message={emptyMessage} />
        ) : (
          children
        )}
      </Card.Body>
    </Card>
  )
}

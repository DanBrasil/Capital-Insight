import { Card } from '@/components/ui/Card'
import { Text } from '@/components/ui/Typography'

interface ReportSummaryCardProps {
  label: string
  value: string
  subValue?: string
  /** 'positive' = green, 'negative' = red, 'neutral' = default */
  sentiment?: 'positive' | 'negative' | 'neutral'
}

const sentimentClass: Record<NonNullable<ReportSummaryCardProps['sentiment']>, string> = {
  positive: 'text-success',
  negative: 'text-error',
  neutral: 'text-foreground',
}

export function ReportSummaryCard({
  label,
  value,
  subValue,
  sentiment = 'neutral',
}: ReportSummaryCardProps) {
  return (
    <Card>
      <Card.Body className="flex flex-col gap-1 p-4">
        <Text className="text-xs font-medium text-foreground/60 uppercase tracking-wide">
          {label}
        </Text>
        <p className={['text-xl font-bold leading-tight', sentimentClass[sentiment]].join(' ')}>
          {value}
        </p>
        {subValue && <Text className="text-xs text-foreground/50">{subValue}</Text>}
      </Card.Body>
    </Card>
  )
}

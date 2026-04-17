interface AIInsightsMetaInfoProps {
  generatedAt: string // ISO 8601
  sourceVersion: number
  disclaimer?: string
}

const DEFAULT_DISCLAIMER =
  'Esta análise é gerada automaticamente por IA com fins descritivos. Não constitui recomendação de investimento. Consulte um profissional habilitado antes de tomar decisões financeiras.'

/**
 * Footer row with generation timestamp, version, and legal disclaimer.
 * Disclaimer can be customized per tenant.
 */
export function AIInsightsMetaInfo({
  generatedAt,
  sourceVersion,
  disclaimer = DEFAULT_DISCLAIMER,
}: AIInsightsMetaInfoProps) {
  const formatted = new Date(generatedAt).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="space-y-2 border-t border-border pt-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>Gerado em {formatted}</span>
        <span>Versão #{sourceVersion}</span>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{disclaimer}</p>
    </div>
  )
}

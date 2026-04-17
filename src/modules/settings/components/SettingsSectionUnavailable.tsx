import { Text } from '@/components/ui/Typography'

/**
 * Shown inside a section card when a platform feature is not enabled
 * for the current tenant (i.e. FeatureGate has no feature access).
 */
export function SettingsSectionUnavailable() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
      <Text className="text-sm font-medium text-muted-foreground">
        Esta seção não está disponível para o seu plano atual.
      </Text>
      <Text variant="small" className="text-muted-foreground">
        Entre em contato com o suporte para saber mais sobre as opções disponíveis.
      </Text>
    </div>
  )
}

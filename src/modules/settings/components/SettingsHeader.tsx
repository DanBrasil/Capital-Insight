import { Heading, Text } from '@/components/ui/Typography'

export function SettingsHeader() {
  return (
    <div className="pb-2">
      <Heading level="h1" className="text-2xl font-bold text-foreground">
        Configurações
      </Heading>
      <Text variant="small" className="mt-1 text-muted-foreground">
        Gerencie seu perfil, preferências e configurações da plataforma.
      </Text>
    </div>
  )
}

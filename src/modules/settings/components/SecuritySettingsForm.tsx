import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Text } from '@/components/ui/Typography'

import { useChangePassword } from '../hooks/useChangePassword'
import {
  SECURITY_FORM_DEFAULTS,
  securitySchema,
  type SecurityFormValues,
} from '../schemas/securitySchema'
import type { SecurityInfo } from '../types'
import { SettingsSectionCard } from './SettingsSectionCard'
import { SettingsSectionUnavailable } from './SettingsSectionUnavailable'

interface SecuritySettingsFormProps {
  securityInfo: SecurityInfo
}

export function SecuritySettingsForm({ securityInfo }: SecuritySettingsFormProps) {
  const mutation = useChangePassword()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema),
    mode: 'onBlur',
    defaultValues: SECURITY_FORM_DEFAULTS,
  })

  function onSubmit(values: SecurityFormValues) {
    setSuccessMessage(null)
    mutation.mutate(values, {
      onSuccess: () => {
        setSuccessMessage('Senha alterada com sucesso.')
        reset(SECURITY_FORM_DEFAULTS)
      },
    })
  }

  const errorMessage =
    mutation.isError && mutation.error instanceof Error
      ? mutation.error.message
      : mutation.isError
        ? 'Não foi possível alterar a senha. Tente novamente.'
        : null

  return (
    <SettingsSectionCard
      panelId="settings-panel-security"
      title="Segurança da conta"
      description="Altere sua senha para manter sua conta protegida."
      footer={
        <>
          {errorMessage && (
            <Text variant="small" className="text-error">
              {errorMessage}
            </Text>
          )}
          {successMessage && (
            <Text variant="small" className="text-success">
              {successMessage}
            </Text>
          )}
          {securityInfo.canChangePassword && (
            <Button
              type="submit"
              variant="primary"
              isLoading={mutation.isPending}
              disabled={mutation.isPending}
              onClick={handleSubmit(onSubmit)}
            >
              Alterar senha
            </Button>
          )}
        </>
      }
    >
      {!securityInfo.canChangePassword ? (
        <SettingsSectionUnavailable />
      ) : (
        <form
          id="security-settings-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <Controller
            name="currentPassword"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="security-current-password"
                label="Senha atual"
                type="password"
                autoComplete="current-password"
                error={errors.currentPassword?.message}
              />
            )}
          />

          <Controller
            name="newPassword"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="security-new-password"
                label="Nova senha"
                type="password"
                autoComplete="new-password"
                hint="Mínimo de 8 caracteres."
                error={errors.newPassword?.message}
              />
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="security-confirm-password"
                label="Confirmar nova senha"
                type="password"
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
              />
            )}
          />
        </form>
      )}
    </SettingsSectionCard>
  )
}

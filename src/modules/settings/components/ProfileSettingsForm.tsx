import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/Button'
import { FormErrorBanner } from '@/components/ui/FormErrorBanner'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Text } from '@/components/ui/Typography'

import { useUpdateProfile } from '../hooks/useUpdateProfile'
import {
  PROFILE_FORM_DEFAULTS,
  profileSchema,
  type ProfileFormValues,
} from '../schemas/profileSchema'
import type { UserProfileSettings } from '../types'
import { SettingsSectionCard } from './SettingsSectionCard'

const LOCALE_OPTIONS = [
  { value: 'pt-BR', label: 'Português (Brasil)' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'es-ES', label: 'Español' },
]

const CURRENCY_OPTIONS = [
  { value: 'BRL', label: 'Real brasileiro (BRL)' },
  { value: 'USD', label: 'Dólar americano (USD)' },
  { value: 'EUR', label: 'Euro (EUR)' },
]

interface ProfileSettingsFormProps {
  initialData: UserProfileSettings
}

export function ProfileSettingsForm({ initialData }: ProfileSettingsFormProps) {
  const mutation = useUpdateProfile()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: 'onBlur',
    defaultValues: PROFILE_FORM_DEFAULTS,
  })

  // Populate the form once initial data arrives (or when it changes)
  useEffect(() => {
    reset({
      name: initialData.name,
      email: initialData.email,
      locale: initialData.locale,
      currency: initialData.currency,
    })
  }, [initialData, reset])

  function onSubmit(values: ProfileFormValues) {
    setSuccessMessage(null)
    mutation.mutate(values, {
      onSuccess: () => {
        setSuccessMessage('Perfil atualizado com sucesso.')
        reset(values) // mark as pristine with the new values
      },
    })
  }

  return (
    <SettingsSectionCard
      panelId="settings-panel-profile"
      title="Informações do perfil"
      description="Atualize seu nome e preferências de idioma e moeda."
      footer={
        <>
          {mutation.isError && (
            <FormErrorBanner message="Não foi possível salvar. Tente novamente." />
          )}
          {successMessage && (
            <Text variant="small" className="text-success">
              {successMessage}
            </Text>
          )}
          <Button
            type="submit"
            variant="primary"
            isLoading={mutation.isPending}
            disabled={!isDirty || mutation.isPending}
            onClick={handleSubmit(onSubmit)}
          >
            Salvar perfil
          </Button>
        </>
      }
    >
      <form
        id="profile-settings-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="profile-name"
              label="Nome completo"
              placeholder="Seu nome"
              error={errors.name?.message}
            />
          )}
        />

        {/* Email is read-only — managed by identity provider */}
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="profile-email"
              label="E-mail"
              type="email"
              readOnly
              disabled
              hint="O e-mail não pode ser alterado aqui."
            />
          )}
        />

        <Controller
          name="locale"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              id="profile-locale"
              label="Idioma"
              options={LOCALE_OPTIONS}
              placeholder="Selecione um idioma"
              error={errors.locale?.message}
            />
          )}
        />

        <Controller
          name="currency"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              id="profile-currency"
              label="Moeda padrão"
              options={CURRENCY_OPTIONS}
              placeholder="Selecione uma moeda"
              error={errors.currency?.message}
            />
          )}
        />
      </form>
    </SettingsSectionCard>
  )
}

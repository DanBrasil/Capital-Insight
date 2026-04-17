import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/Button'
import { FormErrorBanner } from '@/components/ui/FormErrorBanner'
import { Select } from '@/components/ui/Select'
import { Text } from '@/components/ui/Typography'

import { useUpdatePreferences } from '../hooks/useUpdatePreferences'
import {
  PREFERENCES_FORM_DEFAULTS,
  preferencesSchema,
  type PreferencesFormValues,
} from '../schemas/preferencesSchema'
import type { UserPreferenceSettings } from '../types'
import { SettingsSectionCard } from './SettingsSectionCard'

const THEME_OPTIONS = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Escuro' },
  { value: 'system', label: 'Usar configuração do sistema' },
]

const DATE_FORMAT_OPTIONS = [
  { value: 'dd/MM/yyyy', label: 'dd/MM/aaaa (padrão BR)' },
  { value: 'MM/dd/yyyy', label: 'MM/dd/aaaa (padrão US)' },
  { value: 'yyyy-MM-dd', label: 'aaaa-MM-dd (ISO 8601)' },
]

const CURRENCY_FORMAT_OPTIONS = [
  { value: 'BRL', label: 'Real (R$ 1.234,56)' },
  { value: 'USD', label: 'Dólar ($ 1,234.56)' },
  { value: 'EUR', label: 'Euro (€ 1.234,56)' },
]

interface PreferencesSettingsFormProps {
  initialData: UserPreferenceSettings
}

export function PreferencesSettingsForm({ initialData }: PreferencesSettingsFormProps) {
  const mutation = useUpdatePreferences()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    mode: 'onBlur',
    defaultValues: PREFERENCES_FORM_DEFAULTS,
  })

  useEffect(() => {
    reset({
      theme: initialData.theme,
      dateFormat: initialData.dateFormat,
      currencyFormat: initialData.currencyFormat,
    })
  }, [initialData, reset])

  function onSubmit(values: PreferencesFormValues) {
    setSuccessMessage(null)
    mutation.mutate(values, {
      onSuccess: () => {
        setSuccessMessage('Preferências salvas com sucesso.')
        reset(values)
      },
    })
  }

  return (
    <SettingsSectionCard
      panelId="settings-panel-preferences"
      title="Preferências de exibição"
      description="Personalize tema, formato de datas e exibição de valores."
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
            Salvar preferências
          </Button>
        </>
      }
    >
      <form
        id="preferences-settings-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        <Controller
          name="theme"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              id="preferences-theme"
              label="Tema"
              options={THEME_OPTIONS}
              placeholder="Selecione um tema"
              error={errors.theme?.message}
            />
          )}
        />

        <Controller
          name="dateFormat"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              id="preferences-date-format"
              label="Formato de data"
              options={DATE_FORMAT_OPTIONS}
              placeholder="Selecione um formato"
              error={errors.dateFormat?.message}
            />
          )}
        />

        <Controller
          name="currencyFormat"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              id="preferences-currency-format"
              label="Formato de moeda"
              options={CURRENCY_FORMAT_OPTIONS}
              placeholder="Selecione um formato"
              error={errors.currencyFormat?.message}
            />
          )}
        />
      </form>
    </SettingsSectionCard>
  )
}

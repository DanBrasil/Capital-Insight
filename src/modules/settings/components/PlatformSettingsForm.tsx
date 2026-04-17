import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/Button'
import { FormErrorBanner } from '@/components/ui/FormErrorBanner'
import { Select } from '@/components/ui/Select'
import { Text } from '@/components/ui/Typography'
import { FeatureGate } from '@/tenants/components/FeatureGate'

import { focusFirstInvalidField } from '@/utils/accessibility'

import { useUpdatePlatform } from '../hooks/useUpdatePlatform'
import {
  PLATFORM_FORM_DEFAULTS,
  platformSchema,
  type PlatformFormValues,
} from '../schemas/platformSchema'
import type { PlatformSettings } from '../types'
import { SettingsSectionCard } from './SettingsSectionCard'

const MARKET_VIEW_OPTIONS = [
  { value: 'list', label: 'Lista' },
  { value: 'grid', label: 'Grade' },
]

interface CheckboxFieldProps {
  id: string
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

function CheckboxField({
  id,
  label,
  description,
  checked,
  onChange,
  disabled,
}: CheckboxFieldProps) {
  return (
    <div className="flex items-start gap-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        disabled={disabled}
        className="mt-0.5 h-4 w-4 rounded border-input accent-primary"
      />
      <div>
        <label htmlFor={id} className="text-sm font-medium text-foreground cursor-pointer">
          {label}
        </label>
        {description && (
          <Text variant="small" className="mt-0.5 text-muted-foreground">
            {description}
          </Text>
        )}
      </div>
    </div>
  )
}

interface PlatformSettingsFormProps {
  initialData: PlatformSettings
}

export function PlatformSettingsForm({ initialData }: PlatformSettingsFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const mutation = useUpdatePlatform()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<PlatformFormValues>({
    resolver: zodResolver(platformSchema),
    mode: 'onBlur',
    defaultValues: PLATFORM_FORM_DEFAULTS,
  })

  useEffect(() => {
    reset({
      showPortfolioHighlights: initialData.showPortfolioHighlights,
      allowAIInsights: initialData.allowAIInsights,
      defaultMarketView: initialData.defaultMarketView,
    })
  }, [initialData, reset])

  function onSubmit(values: PlatformFormValues) {
    setSuccessMessage(null)
    mutation.mutate(values, {
      onSuccess: () => {
        setSuccessMessage('Configurações da plataforma salvas.')
        reset(values)
      },
    })
  }

  const submitForm = handleSubmit(onSubmit, () => focusFirstInvalidField(formRef.current))

  return (
    <SettingsSectionCard
      panelId="settings-panel-platform"
      title="Configurações da plataforma"
      description="Personalize como a plataforma se comporta para você."
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
            form="platform-settings-form"
            type="submit"
            variant="primary"
            isLoading={mutation.isPending}
            disabled={!isDirty || mutation.isPending}
          >
            Salvar configurações
          </Button>
        </>
      }
    >
      <form
        ref={formRef}
        id="platform-settings-form"
        onSubmit={submitForm}
        className="space-y-5"
        noValidate
      >
        <Controller
          name="showPortfolioHighlights"
          control={control}
          render={({ field }) => (
            <CheckboxField
              id="platform-portfolio-highlights"
              label="Exibir destaques do portfólio"
              description="Mostra os principais ativos e variações na tela inicial."
              checked={field.value}
              onChange={field.onChange}
            />
          )}
        />

        {/* AI Insights toggle — only shown if tenant has the feature */}
        <FeatureGate flag="ai-insights">
          <Controller
            name="allowAIInsights"
            control={control}
            render={({ field }) => (
              <CheckboxField
                id="platform-ai-insights"
                label="Habilitar análises com IA"
                description="Receba sugestões e análises automáticas baseadas em inteligência artificial."
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </FeatureGate>

        <Controller
          name="defaultMarketView"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              id="platform-market-view"
              label="Modo de exibição padrão do mercado"
              options={MARKET_VIEW_OPTIONS}
              placeholder="Selecione um modo"
              error={errors.defaultMarketView?.message}
              aria-required="true"
            />
          )}
        />
      </form>
    </SettingsSectionCard>
  )
}

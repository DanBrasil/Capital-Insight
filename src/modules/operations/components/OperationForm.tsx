import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button, FormErrorBanner } from '@/components/ui'
import { Input, Select, TextArea } from '@/components/form'

import type { CreateOperationPayload, Operation } from '../types'
import {
  OPERATION_FORM_DEFAULTS,
  operationFormSchema,
  type OperationFormValues,
} from '../forms/operationFormSchema'

// ─── Select options ───────────────────────────────────────────────────────────

const OPERATION_TYPE_OPTIONS = [
  { value: 'buy', label: 'Compra' },
  { value: 'sell', label: 'Venda' },
]

const ASSET_TYPE_OPTIONS = [
  { value: 'stock', label: 'Ação' },
  { value: 'fii', label: 'FII' },
  { value: 'bdr', label: 'BDR' },
  { value: 'etf', label: 'ETF' },
  { value: 'fixed-income', label: 'Renda Fixa' },
  { value: 'crypto', label: 'Cripto' },
]

// ─── Conversor entity → form values ──────────────────────────────────────────

function operationToForm(op: Operation): OperationFormValues {
  return {
    symbol: op.symbol,
    assetType: op.assetType,
    operationType: op.operationType,
    quantity: String(op.quantity),
    unitPrice: String(op.unitPrice),
    fees: String(op.fees),
    operationDate: op.operationDate.split('T')[0],
    broker: op.broker ?? '',
    notes: op.notes ?? '',
  }
}

// ─── Submit boundary: form values → typed API payload ────────────────────────

function toPayload(values: OperationFormValues): CreateOperationPayload {
  return {
    symbol: values.symbol.trim().toUpperCase(),
    assetType: values.assetType,
    operationType: values.operationType,
    quantity: Number(values.quantity),
    unitPrice: Number(values.unitPrice),
    fees: Number(values.fees || '0'),
    operationDate: new Date(values.operationDate).toISOString(),
    broker: values.broker?.trim() || undefined,
    notes: values.notes?.trim() || undefined,
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

interface OperationFormProps {
  /** When provided, the form starts in edit mode pre-filled with these values */
  initialValues?: Operation
  isSubmitting: boolean
  submitError: string | null
  onSubmit: (payload: CreateOperationPayload) => void
  onCancel: () => void
}

/**
 * Manages field state and validation via React Hook Form + Zod.
 *
 * Validation rules live exclusively in operationFormSchema.ts.
 * This component only renders fields and delegates to the schema.
 *
 * - mode 'onBlur': validates when user leaves a field (not while typing)
 * - after first submit attempt, RHF switches to 'onChange' automatically
 * - emits a typed CreateOperationPayload via onSubmit — never calls mutations
 * - works for both create and edit (initialValues controls the mode)
 */
export function OperationForm({
  initialValues,
  isSubmitting,
  submitError,
  onSubmit,
  onCancel,
}: OperationFormProps) {
  const { control, handleSubmit, watch, reset } = useForm<OperationFormValues>({
    resolver: zodResolver(operationFormSchema),
    defaultValues: initialValues ? operationToForm(initialValues) : OPERATION_FORM_DEFAULTS,
    mode: 'onBlur',
  })

  // Sync form values when switching between create and edit modes
  useEffect(() => {
    reset(initialValues ? operationToForm(initialValues) : OPERATION_FORM_DEFAULTS)
  }, [initialValues, reset])

  const isEditing = Boolean(initialValues)

  // Derive estimated total from live field values for UX feedback
  const quantity = watch('quantity')
  const unitPrice = watch('unitPrice')
  const fees = watch('fees')
  const estimatedTotal =
    Number(quantity) > 0 && Number(unitPrice) > 0
      ? (Number(quantity) * Number(unitPrice) + Number(fees || '0')).toFixed(2)
      : null

  return (
    <form onSubmit={handleSubmit(values => onSubmit(toPayload(values)))} noValidate>
      <div className="space-y-4">
        {/* Row 1: Symbol + Operation type */}
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="symbol"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                id="op-form-symbol"
                label="Código do ativo"
                placeholder="ex: PETR4"
                required
                value={field.value}
                onChange={e => field.onChange(e.target.value.toUpperCase())}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="operationType"
            control={control}
            render={({ field, fieldState }) => (
              <Select
                id="op-form-type"
                label="Operação"
                required
                options={OPERATION_TYPE_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        {/* Row 2: Asset type + Date */}
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="assetType"
            control={control}
            render={({ field, fieldState }) => (
              <Select
                id="op-form-asset-type"
                label="Tipo de ativo"
                required
                options={ASSET_TYPE_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="operationDate"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                id="op-form-date"
                label="Data da operação"
                type="date"
                required
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        {/* Row 3: Quantity + Unit price + Fees */}
        <div className="grid grid-cols-3 gap-4">
          <Controller
            name="quantity"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                id="op-form-quantity"
                label="Quantidade"
                type="number"
                min="0"
                step="1"
                required
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="unitPrice"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                id="op-form-unit-price"
                label="Preço unitário (R$)"
                type="number"
                min="0"
                step="0.01"
                required
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="fees"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                id="op-form-fees"
                label="Taxas (R$)"
                type="number"
                min="0"
                step="0.01"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        {/* Estimated total — derived from live values for UX feedback */}
        {estimatedTotal && (
          <p className="text-xs text-muted-foreground">
            Total estimado:{' '}
            <span className="font-semibold text-foreground">R$ {estimatedTotal}</span>
          </p>
        )}

        {/* Optional: Broker */}
        <Controller
          name="broker"
          control={control}
          render={({ field }) => (
            <Input
              id="op-form-broker"
              label="Corretora (opcional)"
              placeholder="ex: XP Investimentos"
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />

        {/* Optional: Notes */}
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <TextArea
              id="op-form-notes"
              label="Observações (opcional)"
              placeholder="ex: Aumento de posição em momento de queda"
              rows={2}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />

        {submitError && <FormErrorBanner message={submitError} />}

        <div className="flex justify-end gap-3 pt-1">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="md" isLoading={isSubmitting}>
            {isEditing ? 'Salvar alterações' : 'Registrar operação'}
          </Button>
        </div>
      </div>
    </form>
  )
}

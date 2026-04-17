import { z } from 'zod'

// ─── Asset type enum (mirrors domain type for schema-level validation) ────────

const assetTypeEnum = z.enum(['stock', 'fii', 'bdr', 'etf', 'fixed-income', 'crypto'], {
  message: 'Selecione um tipo de ativo válido',
})

const operationTypeEnum = z.enum(['buy', 'sell'], {
  message: 'Selecione o tipo de operação',
})

// ─── Schema ───────────────────────────────────────────────────────────────────

/**
 * Zod schema for the operation form.
 *
 * All number fields are defined as strings because HTML inputs always
 * yield strings. Numeric validation uses .refine() to keep the form state
 * as strings, with explicit conversion only at the submit boundary
 * (toOperationPayload).
 *
 * Default values are provided via OPERATION_FORM_DEFAULTS (not via
 * z.default()) to keep the inferred type fully explicit and compatible
 * with React Hook Form's generic constraints.
 *
 * Validation messages are in Brazilian Portuguese and live here as the
 * single source of truth — never duplicated in the component.
 */
export const operationFormSchema = z.object({
  symbol: z
    .string()
    .min(1, 'Informe o código do ativo')
    .max(10, 'Código deve ter no máximo 10 caracteres'),

  assetType: assetTypeEnum,

  operationType: operationTypeEnum,

  quantity: z
    .string()
    .min(1, 'Quantidade é obrigatória')
    .refine(v => Number(v) > 0, 'Quantidade deve ser maior que zero'),

  unitPrice: z
    .string()
    .min(1, 'Preço unitário é obrigatório')
    .refine(v => Number(v) > 0, 'Preço unitário deve ser maior que zero'),

  fees: z.string().refine(v => v === '' || Number(v) >= 0, 'Taxas não podem ser negativas'),

  operationDate: z.string().min(1, 'Data da operação é obrigatória'),

  broker: z.string().optional(),

  notes: z.string().optional(),
})

// ─── Inferred type ────────────────────────────────────────────────────────────

/**
 * TypeScript type inferred directly from the schema.
 * No manual FormValues type needed — the schema is the single source of truth.
 */
export type OperationFormValues = z.infer<typeof operationFormSchema>

// ─── Default values ───────────────────────────────────────────────────────────

export const OPERATION_FORM_DEFAULTS: OperationFormValues = {
  symbol: '',
  assetType: 'stock',
  operationType: 'buy',
  quantity: '',
  unitPrice: '',
  fees: '0',
  operationDate: new Date().toISOString().split('T')[0],
  broker: '',
  notes: '',
}

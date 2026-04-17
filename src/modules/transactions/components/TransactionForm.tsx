import { type FormEvent, useEffect, useState } from 'react'

import { Button } from '@/components/ui'
import { Input, Select, TextArea } from '@/components/form'

import { getCategoryOptions } from '../utils/categories'
import type { CreateTransactionPayload, Transaction, TransactionStatus } from '../types'

const TYPE_OPTIONS = [
  { value: 'income', label: 'Receita' },
  { value: 'expense', label: 'Despesa' },
]

const STATUS_OPTIONS: { value: TransactionStatus; label: string }[] = [
  { value: 'completed', label: 'Concluída' },
  { value: 'pending', label: 'Pendente' },
  { value: 'cancelled', label: 'Cancelada' },
]

type FormValues = {
  title: string
  type: 'income' | 'expense'
  amount: string
  category: string
  date: string
  status: TransactionStatus
  description: string
}

const EMPTY_FORM: FormValues = {
  title: '',
  type: 'expense',
  amount: '',
  category: '',
  date: new Date().toISOString().split('T')[0],
  status: 'completed',
  description: '',
}

function transactionToForm(t: Transaction): FormValues {
  return {
    title: t.title,
    type: t.type,
    amount: String(t.amount),
    category: t.category,
    date: t.date.split('T')[0],
    status: t.status,
    description: t.description ?? '',
  }
}

interface ValidationErrors {
  title?: string
  amount?: string
  category?: string
  date?: string
}

function validate(values: FormValues): ValidationErrors {
  const errors: ValidationErrors = {}

  if (!values.title.trim()) errors.title = 'Título é obrigatório'
  if (!values.amount || isNaN(Number(values.amount)) || Number(values.amount) <= 0)
    errors.amount = 'Valor deve ser um número positivo'
  if (!values.category) errors.category = 'Selecione uma categoria'
  if (!values.date) errors.date = 'Data é obrigatória'

  return errors
}

interface TransactionFormProps {
  /** When provided, the form is in edit mode */
  initialValues?: Transaction
  isSubmitting: boolean
  submitError: string | null
  onSubmit: (payload: CreateTransactionPayload) => void
  onCancel: () => void
}

/**
 * Controlled form — owns local field state and inline validation.
 * Calls onSubmit with a typed payload; never calls hooks or mutations directly.
 */
export function TransactionForm({
  initialValues,
  isSubmitting,
  submitError,
  onSubmit,
  onCancel,
}: TransactionFormProps) {
  const [values, setValues] = useState<FormValues>(
    initialValues ? transactionToForm(initialValues) : EMPTY_FORM,
  )
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState(false)

  // Reset form when initialValues changes (e.g. opening a different transaction)
  useEffect(() => {
    setValues(initialValues ? transactionToForm(initialValues) : EMPTY_FORM)
    setErrors({})
    setTouched(false)
  }, [initialValues])

  function setField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues(prev => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setTouched(true)

    const validationErrors = validate(values)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    onSubmit({
      title: values.title.trim(),
      type: values.type,
      amount: Number(values.amount),
      category: values.category,
      date: new Date(values.date).toISOString(),
      status: values.status,
      description: values.description.trim() || undefined,
    })
  }

  const categoryOptions = [{ value: '', label: 'Selecione...' }, ...getCategoryOptions()]
  const isEditing = Boolean(initialValues)

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Input
        id="tx-form-title"
        label="Título"
        required
        value={values.title}
        onChange={e => setField('title', e.target.value)}
        error={touched ? errors.title : undefined}
        disabled={isSubmitting}
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          id="tx-form-type"
          label="Tipo"
          required
          options={TYPE_OPTIONS}
          value={values.type}
          onChange={e => setField('type', e.target.value as 'income' | 'expense')}
          disabled={isSubmitting}
        />

        <Input
          id="tx-form-amount"
          label="Valor (R$)"
          type="number"
          min="0.01"
          step="0.01"
          required
          value={values.amount}
          onChange={e => setField('amount', e.target.value)}
          error={touched ? errors.amount : undefined}
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          id="tx-form-category"
          label="Categoria"
          required
          options={categoryOptions}
          value={values.category}
          onChange={e => setField('category', e.target.value)}
          error={touched ? errors.category : undefined}
          disabled={isSubmitting}
        />

        <Select
          id="tx-form-status"
          label="Status"
          options={STATUS_OPTIONS}
          value={values.status}
          onChange={e => setField('status', e.target.value as TransactionStatus)}
          disabled={isSubmitting}
        />
      </div>

      <Input
        id="tx-form-date"
        label="Data"
        type="date"
        required
        value={values.date}
        onChange={e => setField('date', e.target.value)}
        error={touched ? errors.date : undefined}
        disabled={isSubmitting}
      />

      <TextArea
        id="tx-form-desc"
        label="Descrição (opcional)"
        rows={2}
        value={values.description}
        onChange={e => setField('description', e.target.value)}
        disabled={isSubmitting}
      />

      {submitError && (
        <p role="alert" className="text-sm text-error">
          {submitError}
        </p>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" size="md" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" size="md" isLoading={isSubmitting}>
          {isEditing ? 'Salvar alterações' : 'Criar transação'}
        </Button>
      </div>
    </form>
  )
}

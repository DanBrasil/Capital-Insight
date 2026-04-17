import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui'
import { Input } from '@/components/form'

import type { LoginCredentials } from '../types'
import {
  LOGIN_FORM_DEFAULTS,
  loginFormSchema,
  type LoginFormValues,
} from '../forms/loginFormSchema'

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => void
  isLoading: boolean
  error: string | null
}

/**
 * Pure UI component — no auth context, no navigation, no side effects.
 * Receives all behaviour via props, making it fully testable and reusable.
 *
 * Validation is defined in loginFormSchema.ts and runs on blur.
 * Field errors appear below each input as soon as the user leaves it.
 */
export function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: LOGIN_FORM_DEFAULTS,
    mode: 'onBlur',
  })

  return (
    <form onSubmit={handleSubmit(values => onSubmit(values))} noValidate className="space-y-5">
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            id="login-email"
            type="email"
            label="E-mail"
            placeholder="seu@email.com"
            required
            autoComplete="email"
            disabled={isLoading}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            id="login-password"
            type="password"
            label="Senha"
            placeholder="••••••••"
            required
            autoComplete="current-password"
            disabled={isLoading}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
          />
        )}
      />

      {error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}

      <Button type="submit" variant="primary" size="md" isLoading={isLoading} className="w-full">
        Entrar
      </Button>
    </form>
  )
}

import { z } from 'zod'

/**
 * Zod schema for the login form.
 *
 * Validates at the field level so errors appear below each input before submit.
 * Email format validation runs only after min-length passes (short-circuit).
 */
export const loginFormSchema = z.object({
  email: z.string().min(1, 'E-mail é obrigatório').email('Informe um e-mail válido'),

  password: z.string().min(1, 'Senha é obrigatória'),
})

export type LoginFormValues = z.infer<typeof loginFormSchema>

export const LOGIN_FORM_DEFAULTS: LoginFormValues = {
  email: '',
  password: '',
}

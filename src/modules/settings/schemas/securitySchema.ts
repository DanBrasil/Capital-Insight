import { z } from 'zod'

export const securitySchema = z
  .object({
    currentPassword: z.string().min(1, 'Informe a senha atual'),
    newPassword: z
      .string()
      .min(8, 'Nova senha deve ter pelo menos 8 caracteres')
      .max(128, 'Senha muito longa'),
    confirmPassword: z.string().min(1, 'Confirme a nova senha'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })
  .refine(data => data.newPassword !== data.currentPassword, {
    message: 'A nova senha deve ser diferente da senha atual',
    path: ['newPassword'],
  })

export type SecurityFormValues = z.infer<typeof securitySchema>

export const SECURITY_FORM_DEFAULTS: SecurityFormValues = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

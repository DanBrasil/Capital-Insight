import { z } from 'zod'

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(80, 'Nome deve ter no máximo 80 caracteres'),
  email: z.string().email('E-mail inválido'),
  locale: z.string().min(1, 'Idioma é obrigatório'),
  currency: z.string().min(1, 'Moeda é obrigatória'),
})

export type ProfileFormValues = z.infer<typeof profileSchema>

export const PROFILE_FORM_DEFAULTS: ProfileFormValues = {
  name: '',
  email: '',
  locale: 'pt-BR',
  currency: 'BRL',
}

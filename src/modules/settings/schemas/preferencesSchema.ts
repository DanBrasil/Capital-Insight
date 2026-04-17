import { z } from 'zod'

export const preferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system'], {
    message: 'Selecione um tema válido',
  }),
  dateFormat: z.enum(['dd/MM/yyyy', 'MM/dd/yyyy', 'yyyy-MM-dd'], {
    message: 'Selecione um formato de data válido',
  }),
  currencyFormat: z.enum(['BRL', 'USD', 'EUR'], {
    message: 'Selecione um formato de moeda válido',
  }),
})

export type PreferencesFormValues = z.infer<typeof preferencesSchema>

export const PREFERENCES_FORM_DEFAULTS: PreferencesFormValues = {
  theme: 'system',
  dateFormat: 'dd/MM/yyyy',
  currencyFormat: 'BRL',
}

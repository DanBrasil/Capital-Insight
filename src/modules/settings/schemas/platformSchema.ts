import { z } from 'zod'

export const platformSchema = z.object({
  showPortfolioHighlights: z.boolean(),
  allowAIInsights: z.boolean(),
  defaultMarketView: z.enum(['list', 'grid'], {
    message: 'Selecione um modo de exibição válido',
  }),
})

export type PlatformFormValues = z.infer<typeof platformSchema>

export const PLATFORM_FORM_DEFAULTS: PlatformFormValues = {
  showPortfolioHighlights: true,
  allowAIInsights: true,
  defaultMarketView: 'list',
}

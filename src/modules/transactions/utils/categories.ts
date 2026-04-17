/**
 * Default category list for transactions.
 *
 * In the future this can be sourced from `tenant.appConfig.categories`
 * without changing any component — just replace this constant's origin.
 */
export const DEFAULT_CATEGORIES = [
  'Alimentação',
  'Moradia',
  'Transporte',
  'Saúde',
  'Educação',
  'Lazer',
  'Trabalho',
  'Investimentos',
  'Serviços',
  'Outros',
] as const

export type DefaultCategory = (typeof DEFAULT_CATEGORIES)[number]

export function getCategoryOptions(): { value: string; label: string }[] {
  return DEFAULT_CATEGORIES.map(cat => ({ value: cat, label: cat }))
}

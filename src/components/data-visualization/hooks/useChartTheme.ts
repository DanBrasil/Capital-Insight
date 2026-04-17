import { useTenant } from '@/tenants/hooks/useTenant'

/**
 * Supplementary palette — used for series 1..N when the tenant provides no
 * explicit colors. Chosen to have adequate contrast in both light and dark modes.
 */
const SUPPLEMENTARY_COLORS = [
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
]

export interface ChartTheme {
  /**
   * Ordered color palette.
   * colors[0] is always the tenant's primary brand color.
   * Use colors[N % colors.length] to cycle through for multi-series charts.
   */
  colors: string[]
  primaryColor: string
  foregroundColor: string
  mutedColor: string
  borderColor: string
  backgroundColor: string
}

/**
 * Returns a chart color theme derived from the active tenant configuration.
 *
 * The first color in the palette is always the tenant's primary brand color,
 * ensuring charts automatically maintain the White Label visual identity.
 *
 * This hook is the single source of truth for chart colors — no hex values
 * should be hardcoded inside chart components.
 */
export function useChartTheme(): ChartTheme {
  const { tenant } = useTenant()

  return {
    colors: [tenant.theme.colorPrimary, ...SUPPLEMENTARY_COLORS],
    primaryColor: tenant.theme.colorPrimary,
    foregroundColor: tenant.theme.colorForeground,
    mutedColor: tenant.theme.colorMutedForeground,
    borderColor: tenant.theme.colorBorder,
    backgroundColor: tenant.theme.colorBackground,
  }
}

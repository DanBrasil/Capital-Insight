import type { TenantTheme } from './types'

/**
 * Applies tenant theme tokens to the document root as CSS custom properties.
 * Isolated here so TenantProvider stays free of DOM side-effects.
 * Called once after tenant config is resolved.
 */
export function applyTenantTheme(theme: TenantTheme): void {
  const root = document.documentElement
  root.style.setProperty('--color-primary', theme.colorPrimary)
  root.style.setProperty('--color-primary-foreground', theme.colorPrimaryForeground)
  root.style.setProperty('--color-secondary', theme.colorSecondary)
  root.style.setProperty('--color-secondary-foreground', theme.colorSecondaryForeground)
  root.style.setProperty('--color-background', theme.colorBackground)
  root.style.setProperty('--color-foreground', theme.colorForeground)
  root.style.setProperty('--color-muted', theme.colorMuted)
  root.style.setProperty('--color-muted-foreground', theme.colorMutedForeground)
  root.style.setProperty('--color-border', theme.colorBorder)
  root.style.setProperty('--color-input', theme.colorBorder)
  root.style.setProperty('font-family', theme.fontFamily)
}

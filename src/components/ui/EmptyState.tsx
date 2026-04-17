import type { ReactNode } from 'react'

import { Button } from './Button'

// ── Types ─────────────────────────────────────────────────────────────────────

export type EmptyStateVariant = 'default' | 'filter' | 'feature' | 'chart'
export type EmptyStateSize = 'sm' | 'md' | 'lg'

export interface EmptyStateAction {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
}

export interface EmptyStateProps {
  title: string
  description?: string
  /** Overrides the variant default icon */
  icon?: ReactNode
  variant?: EmptyStateVariant
  size?: EmptyStateSize
  action?: EmptyStateAction
  secondaryAction?: EmptyStateAction
  className?: string
}

// ── Default icons ─────────────────────────────────────────────────────────────

function IconDefault() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-full w-full"
    >
      <path d="M20 13V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7" />
      <path d="M2 13h3l2 3h10l2-3h3" />
      <path d="M12 3v10" />
    </svg>
  )
}

function IconFilter() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-full w-full"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function IconFeature() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-full w-full"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function IconChart() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-full w-full"
    >
      <path d="M3 3v18h18" />
      <path d="m7 16 4-4 4 4 5-5" />
    </svg>
  )
}

const DEFAULT_ICONS: Record<EmptyStateVariant, ReactNode> = {
  default: <IconDefault />,
  filter: <IconFilter />,
  feature: <IconFeature />,
  chart: <IconChart />,
}

// ── Size config ───────────────────────────────────────────────────────────────

const sizeConfig = {
  sm: {
    wrapper: 'py-8 px-4',
    iconBox: 'h-8 w-8',
    iconPad: 'p-2',
    title: 'text-sm font-medium text-foreground',
    description: 'text-xs text-muted-foreground',
    buttonSize: 'sm' as const,
  },
  md: {
    wrapper: 'py-12 px-6',
    iconBox: 'h-10 w-10',
    iconPad: 'p-3',
    title: 'text-base font-semibold text-foreground',
    description: 'text-sm text-muted-foreground',
    buttonSize: 'md' as const,
  },
  lg: {
    wrapper: 'py-16 px-8',
    iconBox: 'h-12 w-12',
    iconPad: 'p-3.5',
    title: 'text-lg font-semibold text-foreground',
    description: 'text-sm text-muted-foreground',
    buttonSize: 'md' as const,
  },
}

// Default CTA variant per empty state type
const defaultActionVariant: Record<EmptyStateVariant, 'primary' | 'ghost'> = {
  default: 'primary',
  filter: 'ghost',
  feature: 'ghost',
  chart: 'ghost',
}

// ── EmptyState ────────────────────────────────────────────────────────────────

export function EmptyState({
  title,
  description,
  icon,
  variant = 'default',
  size = 'md',
  action,
  secondaryAction,
  className = '',
}: EmptyStateProps) {
  const cfg = sizeConfig[size]
  const resolvedIcon = icon ?? DEFAULT_ICONS[variant]

  return (
    <div
      className={['flex flex-col items-center justify-center text-center', cfg.wrapper, className].join(
        ' ',
      )}
      role="status"
      aria-label={title}
    >
      <div
        className={[
          'mb-4 flex items-center justify-center rounded-full bg-muted text-muted-foreground',
          cfg.iconPad,
        ].join(' ')}
      >
        <div className={cfg.iconBox}>{resolvedIcon}</div>
      </div>

      <p className={cfg.title}>{title}</p>

      {description && (
        <p className={['mt-1 max-w-xs', cfg.description].join(' ')}>{description}</p>
      )}

      {(action || secondaryAction) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {action && (
            <Button
              variant={action.variant ?? defaultActionVariant[variant]}
              size={cfg.buttonSize}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant={secondaryAction.variant ?? 'ghost'}
              size={cfg.buttonSize}
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// ── EmptyStateTable ───────────────────────────────────────────────────────────
// Use inside <tbody> to render a centered empty state spanning all columns.

export interface EmptyStateTableProps extends EmptyStateProps {
  colSpan: number
}

export function EmptyStateTable({ colSpan, ...props }: EmptyStateTableProps) {
  return (
    <tr>
      <td colSpan={colSpan}>
        <EmptyState {...props} size={props.size ?? 'sm'} />
      </td>
    </tr>
  )
}

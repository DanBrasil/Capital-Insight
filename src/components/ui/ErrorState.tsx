import { Button } from './Button'

// ── Types ─────────────────────────────────────────────────────────────────────

export type ErrorStateSize = 'sm' | 'md' | 'lg'

export interface ErrorStateProps {
  /** Human-readable message from AppError.message or a custom string */
  description?: string
  /** Override the default "Algo deu errado" title */
  title?: string
  /** When provided, renders a retry button */
  onRetry?: () => void
  size?: ErrorStateSize
  className?: string
}

// ── Size config ───────────────────────────────────────────────────────────────

const sizeConfig = {
  sm: {
    wrapper: 'py-6 px-4',
    iconBox: 'h-8 w-8',
    iconPad: 'p-2 mb-3',
    title: 'text-sm font-medium text-foreground',
    description: 'text-xs text-muted-foreground',
    buttonSize: 'sm' as const,
  },
  md: {
    wrapper: 'py-12 px-6',
    iconBox: 'h-10 w-10',
    iconPad: 'p-3 mb-4',
    title: 'text-base font-semibold text-foreground',
    description: 'text-sm text-muted-foreground',
    buttonSize: 'sm' as const,
  },
  lg: {
    wrapper: 'py-16 px-8',
    iconBox: 'h-12 w-12',
    iconPad: 'p-3.5 mb-4',
    title: 'text-lg font-semibold text-foreground',
    description: 'text-sm text-muted-foreground',
    buttonSize: 'md' as const,
  },
}

// ── ErrorState ────────────────────────────────────────────────────────────────

export function ErrorState({
  title = 'Algo deu errado',
  description,
  onRetry,
  size = 'md',
  className = '',
}: ErrorStateProps) {
  const cfg = sizeConfig[size]

  return (
    <div
      className={[
        'flex flex-col items-center justify-center text-center',
        cfg.wrapper,
        className,
      ].join(' ')}
      role="alert"
      aria-label={title}
    >
      <div
        className={[
          'flex items-center justify-center rounded-full bg-error/10',
          cfg.iconPad,
        ].join(' ')}
      >
        <div className={cfg.iconBox}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-full w-full text-error"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
        </div>
      </div>

      <p className={cfg.title}>{title}</p>

      {description && (
        <p className={['mt-1 max-w-xs', cfg.description].join(' ')}>{description}</p>
      )}

      {onRetry && (
        <div className="mt-4">
          <Button variant="ghost" size={cfg.buttonSize} onClick={onRetry}>
            Tentar novamente
          </Button>
        </div>
      )}
    </div>
  )
}

// ── ErrorStateTable ───────────────────────────────────────────────────────────
// Use inside <tbody> to render a centered error state spanning all columns.

export interface ErrorStateTableProps extends ErrorStateProps {
  colSpan: number
}

export function ErrorStateTable({ colSpan, ...props }: ErrorStateTableProps) {
  return (
    <tr>
      <td colSpan={colSpan}>
        <ErrorState {...props} size={props.size ?? 'sm'} />
      </td>
    </tr>
  )
}

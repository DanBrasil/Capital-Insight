type AlertVariant = 'info' | 'warning' | 'error'

interface AlertBannerProps {
  message: string
  variant?: AlertVariant
  onDismiss?: () => void
}

const variantClasses: Record<AlertVariant, string> = {
  info: 'border-info/30 bg-info/5 text-info',
  warning: 'border-warning/30 bg-warning/5 text-warning',
  error: 'border-error/30 bg-error/5 text-error',
}

export function AlertBanner({ message, variant = 'info', onDismiss }: AlertBannerProps) {
  return (
    <div
      role="alert"
      className={[
        'flex items-center justify-between rounded-lg border px-4 py-3 text-sm',
        variantClasses[variant],
      ].join(' ')}
    >
      <span>{message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Fechar aviso"
          className="ml-4 font-bold opacity-60 hover:opacity-100 transition-opacity"
        >
          ×
        </button>
      )}
    </div>
  )
}

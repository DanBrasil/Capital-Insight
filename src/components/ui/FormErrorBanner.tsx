// ── FormErrorBanner ───────────────────────────────────────────────────────────
// Displayed in form footers when a mutation fails.
// Kept visible while the user is still on the form — unlike a toast,
// it won't disappear before they have a chance to read and act on it.

export interface FormErrorBannerProps {
  message: string
  className?: string
}

export function FormErrorBanner({ message, className = '' }: FormErrorBannerProps) {
  return (
    <p
      className={['text-sm text-error flex items-start gap-1.5', className].join(' ')}
      role="alert"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-4 w-4 mt-0.5 shrink-0"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
      </svg>
      {message}
    </p>
  )
}

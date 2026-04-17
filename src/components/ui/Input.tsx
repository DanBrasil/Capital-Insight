import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Mandatory — associates the label and any error/hint messages */
  id: string
  label?: string
  error?: string
  hint?: string
}

export function Input({ id, label, error, hint, className = '', ...rest }: InputProps) {
  const errorId = `${id}-error`
  const hintId = `${id}-hint`

  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ')

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        id={id}
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? true : undefined}
        className={[
          'h-10 w-full rounded-md border bg-background px-3 text-sm text-foreground',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'read-only:cursor-default read-only:bg-muted',
          error ? 'border-error' : 'border-input',
          className,
        ].join(' ')}
        {...rest}
      />
      {error && (
        <span id={errorId} className="text-xs text-error">
          {error}
        </span>
      )}
      {hint && !error && (
        <span id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </span>
      )}
    </div>
  )
}

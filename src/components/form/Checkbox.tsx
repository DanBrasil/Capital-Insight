import type { InputHTMLAttributes } from 'react'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  id: string
  label: string
  error?: string
}

export function Checkbox({ id, label, error, required, className = '', ...rest }: CheckboxProps) {
  const errorId = `${id}-error`

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="checkbox"
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={[
            'h-4 w-4 rounded border-border accent-primary cursor-pointer',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className,
          ].join(' ')}
          {...rest}
        />
        <label htmlFor={id} className="text-sm font-medium text-foreground cursor-pointer">
          {label}
          {required && (
            <span className="text-error ml-1" aria-hidden="true">
              *
            </span>
          )}
        </label>
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-xs text-error ml-6">
          {error}
        </p>
      )}
    </div>
  )
}

interface SwitchProps {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export function Switch({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
}: SwitchProps) {
  function handleToggle() {
    if (!disabled) onChange(!checked)
  }

  return (
    <div className={['flex items-center gap-3', className].join(' ')}>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={handleToggle}
        className={[
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full',
          'border-2 border-transparent transition-colors duration-200 ease-in-out',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          'disabled:cursor-not-allowed disabled:opacity-50',
          checked ? 'bg-primary' : 'bg-muted-foreground',
        ].join(' ')}
      >
        <span
          aria-hidden="true"
          className={[
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm',
            'transition duration-200 ease-in-out',
            checked ? 'translate-x-5' : 'translate-x-0',
          ].join(' ')}
        />
      </button>
      <span
        className="text-sm font-medium text-foreground cursor-pointer select-none"
        onClick={handleToggle}
      >
        {label}
      </span>
    </div>
  )
}

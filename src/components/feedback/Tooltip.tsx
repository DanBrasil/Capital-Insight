import { useId } from 'react'

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'

interface TooltipProps {
  content: string
  position?: TooltipPosition
  children: React.ReactNode
}

const positionClasses: Record<TooltipPosition, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
}

export function Tooltip({ content, position = 'top', children }: TooltipProps) {
  const tooltipId = useId()

  return (
    <div className="relative inline-flex group">
      <div aria-describedby={tooltipId}>{children}</div>
      <div
        id={tooltipId}
        role="tooltip"
        className={[
          'absolute z-50 px-2 py-1 text-xs font-medium text-white bg-foreground rounded',
          'whitespace-nowrap pointer-events-none',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-150',
          positionClasses[position],
        ].join(' ')}
      >
        {content}
      </div>
    </div>
  )
}

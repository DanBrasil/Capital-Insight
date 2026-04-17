import type { HTMLAttributes } from 'react'

type CardVariant = 'default' | 'elevated' | 'flat'

interface CardRootProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
}

interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {}

const variantClasses: Record<CardVariant, string> = {
  default: 'border border-border bg-card',
  elevated: 'shadow-md bg-card',
  flat: 'bg-muted',
}

function CardRoot({ variant = 'default', children, className = '', ...rest }: CardRootProps) {
  return (
    <div
      className={['rounded-lg overflow-hidden', variantClasses[variant], className].join(' ')}
      {...rest}
    >
      {children}
    </div>
  )
}

function CardHeader({ children, className = '', ...rest }: CardSectionProps) {
  return (
    <div className={['px-6 py-4 border-b border-border', className].join(' ')} {...rest}>
      {children}
    </div>
  )
}

function CardBody({ children, className = '', ...rest }: CardSectionProps) {
  return (
    <div className={['px-6 py-4', className].join(' ')} {...rest}>
      {children}
    </div>
  )
}

function CardFooter({ children, className = '', ...rest }: CardSectionProps) {
  return (
    <div className={['px-6 py-4 border-t border-border', className].join(' ')} {...rest}>
      {children}
    </div>
  )
}

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
})

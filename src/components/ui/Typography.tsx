import type { ElementType, HTMLAttributes } from 'react'

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
type TextVariant = 'body' | 'small' | 'caption' | 'code'

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel
  as?: ElementType
}

interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  variant?: TextVariant
  as?: ElementType
  muted?: boolean
}

const headingClasses: Record<HeadingLevel, string> = {
  h1: 'text-4xl font-bold tracking-tight',
  h2: 'text-3xl font-bold tracking-tight',
  h3: 'text-2xl font-semibold',
  h4: 'text-xl font-semibold',
  h5: 'text-lg font-medium',
  h6: 'text-base font-medium',
}

const textVariantClasses: Record<TextVariant, string> = {
  body: 'text-base leading-relaxed',
  small: 'text-sm leading-relaxed',
  caption: 'text-xs',
  code: 'font-mono text-sm bg-muted px-1.5 py-0.5 rounded',
}

export function Heading({ level = 'h2', as, children, className = '', ...rest }: HeadingProps) {
  const Component = as ?? level
  return (
    <Component
      className={['text-foreground', headingClasses[level], className].join(' ')}
      {...rest}
    >
      {children}
    </Component>
  )
}

export function Text({
  variant = 'body',
  as,
  muted = false,
  children,
  className = '',
  ...rest
}: TextProps) {
  const Component = as ?? 'p'
  return (
    <Component
      className={[
        muted ? 'text-muted-foreground' : 'text-foreground',
        textVariantClasses[variant],
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </Component>
  )
}

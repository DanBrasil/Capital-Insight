/**
 * Skeleton primitive — foundation for all loading placeholders.
 *
 * Design decisions:
 * - `animate-pulse` belongs on the CONTAINER, not each block.
 *   A single rAF drives the animation for all children instead of one per block.
 * - All skeleton blocks share `bg-muted` and `rounded` so changing the
 *   design token or corner radius only requires editing this file.
 * - `aria-hidden="true"` on every block — screen readers should skip them.
 *   The container uses `role="status"` + `aria-label` to announce loading.
 *
 * Usage pattern:
 *   <div className="animate-pulse space-y-3" role="status" aria-label="Carregando...">
 *     <SkeletonText className="w-48" />
 *     <Skeleton className="h-32 w-full" />
 *   </div>
 */
import type { HTMLAttributes } from 'react'

// ─── Base block ───────────────────────────────────────────────────────────────

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Tailwind classes for sizing and any other overrides.
   * The component provides background + rounded; you provide h-* and w-*.
   */
  className?: string
}

/**
 * The atomic building block.
 * Use for any rectangular placeholder: images, charts, cards, badges, etc.
 */
export function Skeleton({ className = '', ...rest }: SkeletonProps) {
  return <div aria-hidden="true" className={`rounded bg-muted ${className}`} {...rest} />
}

// ─── Text line ────────────────────────────────────────────────────────────────

interface SkeletonTextProps {
  /**
   * Tailwind width class. Defaults to full width.
   * @example "w-48" | "w-3/4" | "w-full"
   */
  width?: string
  /**
   * Visual size:
   * - "sm"  → h-3   (caption / hint)
   * - "md"  → h-3.5 (body text — default)
   * - "lg"  → h-4   (subheading)
   * - "xl"  → h-5   (heading)
   * - "2xl" → h-7   (large title / metric value)
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
}

const TEXT_HEIGHT: Record<NonNullable<SkeletonTextProps['size']>, string> = {
  sm: 'h-3',
  md: 'h-3.5',
  lg: 'h-4',
  xl: 'h-5',
  '2xl': 'h-7',
}

/**
 * Simulates a line of text.
 * Use `size` to match the real typography, `width` to match the approximate length.
 */
export function SkeletonText({ width = 'w-full', size = 'md', className = '' }: SkeletonTextProps) {
  return (
    <div
      aria-hidden="true"
      className={`rounded-sm bg-muted ${TEXT_HEIGHT[size]} ${width} ${className}`}
    />
  )
}

// ─── Avatar / icon circle ─────────────────────────────────────────────────────

interface SkeletonAvatarProps {
  /**
   * Tailwind size class applied to both w and h.
   * @example "8" → h-8 w-8 (32px)
   */
  size?: number | string
  className?: string
}

/**
 * Circular placeholder for avatars and icon containers.
 */
export function SkeletonAvatar({ size = 8, className = '' }: SkeletonAvatarProps) {
  return (
    <div
      aria-hidden="true"
      className={`rounded-full bg-muted h-${size} w-${size} shrink-0 ${className}`}
    />
  )
}

// ─── Button placeholder ───────────────────────────────────────────────────────

interface SkeletonButtonProps {
  /** Approximate width of the real button */
  width?: string
  /** 'sm' | 'md' | 'lg' matching Button sizes */
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const BUTTON_HEIGHT: Record<NonNullable<SkeletonButtonProps['size']>, string> = {
  sm: 'h-8',
  md: 'h-10',
  lg: 'h-12',
}

/**
 * Button-shaped placeholder. Use next to forms or action areas.
 */
export function SkeletonButton({
  width = 'w-24',
  size = 'md',
  className = '',
}: SkeletonButtonProps) {
  return (
    <div
      aria-hidden="true"
      className={`rounded-md bg-muted ${BUTTON_HEIGHT[size]} ${width} ${className}`}
    />
  )
}

// ─── RefetchBar ───────────────────────────────────────────────────────────────

interface RefetchBarProps {
  /** Show the bar — typically `isFetching && !isLoading` from React Query */
  isVisible: boolean
  /** Additional classes for positioning */
  className?: string
}

/**
 * Subtle thin bar indicating a background refetch is in progress.
 *
 * Use this when React Query refetches data that is already displayed.
 * Showing a skeleton in this case would cause layout shift and visual noise.
 *
 * Placement: top of the section being refreshed.
 *
 * @example
 * const { data, isLoading, isFetching } = useQuery(...)
 * <RefetchBar isVisible={isFetching && !isLoading} />
 * {isLoading ? <MySkeleton /> : <MyContent data={data} />}
 */
export function RefetchBar({ isVisible, className = '' }: RefetchBarProps) {
  if (!isVisible) return null

  return (
    <div
      role="progressbar"
      aria-label="Atualizando dados..."
      aria-valuenow={undefined}
      className={`h-0.5 w-full overflow-hidden rounded-full bg-muted ${className}`}
    >
      <div className="h-full w-1/3 animate-[refetch-slide_1.4s_ease-in-out_infinite] rounded-full bg-primary/50" />
    </div>
  )
}

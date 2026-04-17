interface ChartLoadingStateProps {
  /** Must match the chart's configured height so the skeleton has the same footprint. */
  height?: number
}

export function ChartLoadingState({ height = 200 }: ChartLoadingStateProps) {
  return (
    <div
      className="w-full animate-pulse rounded-md bg-muted"
      style={{ height }}
      aria-hidden="true"
      role="status"
    />
  )
}

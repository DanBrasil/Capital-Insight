export function focusFirstInvalidField(container: ParentNode | null) {
  if (!container) return

  requestAnimationFrame(() => {
    const firstInvalidField = container.querySelector<HTMLElement>(
      '[aria-invalid="true"]:not([disabled])',
    )

    firstInvalidField?.focus()
  })
}
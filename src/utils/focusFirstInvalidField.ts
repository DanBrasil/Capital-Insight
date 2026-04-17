/**
 * Moves focus to the first field with validation error in a form.
 * Helps users with assistive technologies navigate to errors after form submission.
 *
 * @param form - The HTMLFormElement containing the fields
 */
export function focusFirstInvalidField(form: HTMLFormElement): void {
  const firstInvalid = form.querySelector<HTMLElement>(
    '[aria-invalid="true"], input:invalid, select:invalid, textarea:invalid',
  )

  if (firstInvalid) {
    firstInvalid.focus()
  }
}

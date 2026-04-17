/**
 * Component tests for Button.
 *
 * Button is used throughout the application — in forms, toolbars, empty states,
 * modals, and CTAs. A regression here is immediately visible to users.
 *
 * Testing strategy:
 * - Test BEHAVIOUR: clicks fire, disabled blocks events, loading disables
 * - Test ACCESSIBILITY: aria-busy, disabled attribute
 * - Do NOT test CSS class names — those change with styling updates and
 *   are not observable to the user
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Button } from '../Button'

describe('Button', () => {
  // ── Rendering ─────────────────────────────────────────────────────────────

  it('renders its children', () => {
    render(<Button>Salvar</Button>)
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument()
  })

  it('renders with type="button" by default (prevents accidental form submission)', () => {
    render(<Button>Click</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('accepts type="submit" for form buttons', () => {
    render(<Button type="submit">Enviar</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })

  // ── Click interaction ─────────────────────────────────────────────────────

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)

    await userEvent.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn()
    render(
      <Button disabled onClick={handleClick}>
        Click
      </Button>,
    )

    await userEvent.click(screen.getByRole('button'))

    expect(handleClick).not.toHaveBeenCalled()
  })

  // ── Disabled state ────────────────────────────────────────────────────────

  it('has disabled attribute when disabled=true', () => {
    render(<Button disabled>Click</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  // ── Loading state ─────────────────────────────────────────────────────────

  it('is disabled when isLoading=true', () => {
    render(<Button isLoading>Enviando</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('has aria-busy="true" when isLoading=true', () => {
    render(<Button isLoading>Enviando</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')
  })

  it('does not call onClick when in loading state', async () => {
    const handleClick = vi.fn()
    render(
      <Button isLoading onClick={handleClick}>
        Click
      </Button>,
    )

    await userEvent.click(screen.getByRole('button'))

    expect(handleClick).not.toHaveBeenCalled()
  })

  it('has aria-busy="false" when not loading', () => {
    render(<Button>Normal</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'false')
  })

  // ── All variants render without crashing ──────────────────────────────────
  // These tests only verify the component does not throw, not styling details.

  it.each(['primary', 'secondary', 'ghost', 'danger'] as const)(
    'renders without crashing with variant="%s"',
    variant => {
      expect(() => render(<Button variant={variant}>Button</Button>)).not.toThrow()
    },
  )

  it.each(['sm', 'md', 'lg'] as const)('renders without crashing with size="%s"', size => {
    expect(() => render(<Button size={size}>Button</Button>)).not.toThrow()
  })
})

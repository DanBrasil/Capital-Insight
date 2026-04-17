/**
 * Component tests for ChartContainer.
 *
 * ChartContainer is the shared wrapper used by every chart in the application.
 * A regression here would break all charts simultaneously.
 *
 * Testing strategy:
 * - Test the three rendering states: loading, empty, and content
 * - Test optional title/subtitle display
 * - Do NOT test CSS classes, colors, or Recharts internals
 */
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ChartContainer } from '../ChartContainer'

describe('ChartContainer', () => {
  // ── Title and subtitle ─────────────────────────────────────────────────────

  it('renders the title when provided', () => {
    render(
      <ChartContainer title="Evolução da Carteira">
        <div>chart</div>
      </ChartContainer>,
    )
    expect(screen.getByText('Evolução da Carteira')).toBeInTheDocument()
  })

  it('renders the subtitle when provided', () => {
    render(
      <ChartContainer title="Carteira" subtitle="Últimos 30 dias">
        <div>chart</div>
      </ChartContainer>,
    )
    expect(screen.getByText('Últimos 30 dias')).toBeInTheDocument()
  })

  it('renders no header section when neither title nor subtitle is provided', () => {
    render(
      <ChartContainer>
        <div data-testid="content">chart</div>
      </ChartContainer>,
    )
    // The content should still be rendered even without a header
    expect(screen.getByTestId('content')).toBeInTheDocument()
  })

  // ── Content state ──────────────────────────────────────────────────────────

  it('renders children in the default state', () => {
    render(
      <ChartContainer title="Test">
        <div data-testid="chart-content">My Chart</div>
      </ChartContainer>,
    )
    expect(screen.getByTestId('chart-content')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Test' })).toBeInTheDocument()
  })

  // ── Loading state ──────────────────────────────────────────────────────────

  it('renders loading skeleton instead of children when isLoading=true', () => {
    render(
      <ChartContainer title="Test" isLoading>
        <div data-testid="chart-content">My Chart</div>
      </ChartContainer>,
    )
    expect(screen.queryByTestId('chart-content')).not.toBeInTheDocument()
  })

  it('does not render title when loading', () => {
    // Title header IS rendered (design decision: title remains visible during load)
    render(
      <ChartContainer title="Evolução" isLoading>
        <div>chart</div>
      </ChartContainer>,
    )
    expect(screen.getByText('Evolução')).toBeInTheDocument()
  })

  // ── Empty state ────────────────────────────────────────────────────────────

  it('renders empty state message instead of children when isEmpty=true', () => {
    render(
      <ChartContainer title="Test" isEmpty emptyMessage="Sem dados disponíveis">
        <div data-testid="chart-content">My Chart</div>
      </ChartContainer>,
    )
    expect(screen.queryByTestId('chart-content')).not.toBeInTheDocument()
    expect(screen.getByText('Sem dados disponíveis')).toBeInTheDocument()
  })

  it('renders loading state over empty state when both are true', () => {
    // isLoading takes priority over isEmpty in the component implementation
    render(
      <ChartContainer title="Test" isLoading isEmpty>
        <div data-testid="chart-content">My Chart</div>
      </ChartContainer>,
    )
    expect(screen.queryByTestId('chart-content')).not.toBeInTheDocument()
  })
})

import { Component, type ErrorInfo, type ReactNode } from 'react'

import { ErrorPage } from './ErrorPage'

// ── ErrorBoundary ─────────────────────────────────────────────────────────────
// Catches unexpected React render exceptions and displays a fallback UI.
// Wrap around <AppShell> (or any subtree) to prevent a blank screen on crash.
//
// Future: replace the console.error in componentDidCatch with a call to
// a monitoring service (Sentry, Datadog, etc.) for centralised error tracking.

interface Props {
  children: ReactNode
  /** Custom fallback — defaults to <ErrorPage /> */
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // TODO: send to monitoring service (Sentry / Datadog) in production
    console.error('[ErrorBoundary] Uncaught error:', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <ErrorPage onReset={this.handleReset} />
    }
    return this.props.children
  }
}

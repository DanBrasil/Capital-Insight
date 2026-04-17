/**
 * Global test setup — executed once before ALL test files.
 *
 * Responsibilities:
 * 1. Extend Vitest's `expect` with @testing-library/jest-dom matchers
 *    (toBeInTheDocument, toBeDisabled, toHaveValue, etc.)
 * 2. Start the MSW server so every test that needs HTTP mocking has it available
 * 3. Reset handlers after each test to prevent state leakage
 */
import '@testing-library/jest-dom'

import { afterAll, afterEach, beforeAll } from 'vitest'

import { server } from './mocks/server'

// Start MSW before the first test. 'warn' logs unhandled requests instead of throwing,
// which is safer for tests that don't exercise the network.
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))

// Restore default handlers after each test so overrides in one test don't bleed into the next
afterEach(() => server.resetHandlers())

// Tear down the server after all tests complete
afterAll(() => server.close())

/**
 * MSW server instance for Node / Vitest environment.
 *
 * Import `server` in setup.ts to start/stop it globally.
 * Import `server` in individual tests to add per-test handler overrides.
 */
import { setupServer } from 'msw/node'

import { handlers } from './handlers'

export const server = setupServer(...handlers)

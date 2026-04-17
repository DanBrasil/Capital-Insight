import path from 'path'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    // Use happy-dom for a fast, lightweight DOM (sufficient for RTL)
    environment: 'happy-dom',
    // Inject describe / it / expect / vi globally — no need to import per test file
    globals: true,
    // Runs once before all test files: sets up jest-dom matchers + MSW server
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      // Exclude infrastructure, barrel exports, thin page wrappers, and styles
      exclude: [
        'src/test/**',
        'src/pages/**',
        'src/main.tsx',
        'src/App.tsx',
        'src/**/*.d.ts',
        'src/**/index.ts',
        '**/__tests__/**',
      ],
    },
  },
})

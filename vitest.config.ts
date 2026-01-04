import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import react from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    react(),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
  ],
  optimizeDeps: {
    exclude: [
      '@tanstack/react-start',
      '@tanstack/start-server-core',
    ],
  },
  test: {
    name: "browser",
    include: ['**/*.browser.test.{ts,tsx}'],
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [
        { browser: 'chromium' },
      ],
    },
    setupFiles: ['./src/test/setup.browser.ts'],
  },
})

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.test.{js,jsx,ts,tsx}'],
    exclude: ['tests/**', 'node_modules/**'],
  },
})

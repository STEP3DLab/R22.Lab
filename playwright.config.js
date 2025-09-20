// @ts-check
const { defineConfig } = require('@playwright/test')

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command:
      "sh -c 'NEXT_TELEMETRY_DISABLED=1 NEXT_DISABLE_TELEMETRY=1 NEXT_DISABLE_VERSION_CHECK=1 npm run dev -- --hostname 0.0.0.0 --port 3000'",
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})

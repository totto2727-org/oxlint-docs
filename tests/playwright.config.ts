// oxlint-disable-next-line rules/no-node-imports -- Playwright requires the web server's working directory as a native path.
import { fileURLToPath } from 'node:url'
import { defineConfig, devices } from '@playwright/test'

// oxlint-disable-next-line import/no-default-export -- Playwright loads the configuration from the module's default export.
export default defineConfig({
  forbidOnly: true,
  outputDir: '../tmp/browser-results',
  reporter: 'list',
  testDir: '.',
  testMatch: '*.e2e.ts',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://127.0.0.1:4394',
    trace: 'retain-on-failure',
  },
  webServer: {
    command:
      'vp build --config tests/vite.config.ts && vp preview --config tests/vite.config.ts --host 127.0.0.1 --port 4394 --strictPort',
    cwd: fileURLToPath(new URL('../', import.meta.url)),
    gracefulShutdown: { signal: 'SIGTERM', timeout: 5000 },
    reuseExistingServer: false,
    timeout: 180_000,
    url: 'http://127.0.0.1:4394',
  },
  workers: 1,
})

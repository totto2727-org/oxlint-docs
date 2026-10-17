import { fileURLToPath } from 'node:url'
import cloudflare from '@alchemy.run/cloudflare-runtime/vite'
import * as Text from '@alchemy.run/cloudflare-runtime/core/bindings/Text'
import { defineConfig } from 'vite-plus'
import application from '../vite.config'

// Same local-host pattern as tests/e2e-alchemy. The actual site entry and plugins
// are built unchanged, without evaluating alchemy.run.ts or touching cloud state.
export default defineConfig({
  ...application,
  // Vite+ 1.1 permits type-aware lint options only in the root configuration.
  lint: {},
  root: fileURLToPath(new URL('../', import.meta.url)),
  plugins: [
    application.plugins,
    cloudflare({
      compatibilityDate: '2026-09-01',
      compatibilityFlags: ['nodejs_compat'],
      viteEnvironments: { entry: 'rsc', children: ['ssr'] },
      worker: {
        name: 'oxlint-docs-acceptance',
        bindings: [Text.local('ALCHEMY_STACK_NAME', 'oxlint-docs-acceptance'), Text.local('ALCHEMY_STAGE', 'test')],
      },
    }),
  ],
})

// oxlint-disable-next-line rules/no-node-imports -- Vite requires an absolute native path for the project root.
import { fileURLToPath } from 'node:url'
import cloudflare from '@alchemy.run/cloudflare-runtime/vite'
import * as Text from '@alchemy.run/cloudflare-runtime/core/bindings/Text'
import { defineConfig } from 'vite-plus'
// oxlint-disable-next-line import/no-relative-parent-imports -- The acceptance host reuses the root Vite configuration.
import application from '../vite.config.ts'

// Build the site's actual entry and plugins without evaluating alchemy.run.ts or touching cloud state.
// oxlint-disable-next-line import/no-default-export -- Vite loads the configuration from the module's default export.
export default defineConfig({
  ...application,
  // Vite+ 1.1 permits type-aware lint options only in the root configuration.
  lint: {},
  plugins: [
    application.plugins,
    cloudflare({
      compatibilityDate: '2026-09-01',
      compatibilityFlags: ['nodejs_compat'],
      viteEnvironments: { children: ['ssr'], entry: 'rsc' },
      worker: {
        bindings: [Text.local('ALCHEMY_STACK_NAME', 'oxlint-docs-acceptance'), Text.local('ALCHEMY_STAGE', 'test')],
        name: 'oxlint-docs-acceptance',
      },
    }),
  ],
  root: fileURLToPath(new URL('../', import.meta.url)),
})

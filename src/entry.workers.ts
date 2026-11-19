import { makeApplicationHttpEffect } from '@effront/alchemy/cloudflare/application'
import * as Cloudflare from 'alchemy/Cloudflare'
import { Effect } from 'effect'
import type application from './entry.effront.tsx'

// oxlint-disable-next-line import/no-default-export -- Alchemy discovers the Worker through the default export.
export default Cloudflare.Worker(
  'Docs',
  {
    // oxlint-disable-next-line eslint/no-undef, node/no-process-env -- Alchemy evaluates stage selection in Node during planning.
    ...(process.env['ALCHEMY_STAGE'] === 'production'
      ? { domain: { name: 'oxlint.totto2727.dev', zoneName: 'totto2727.dev' } }
      : {}),
    cache: { enabled: true },
    compatibility: { date: '2026-09-01', flags: ['nodejs_compat'] },
    dev: { port: 1339 },
    main: import.meta.url,
    vite: { viteEnvironments: { children: ['ssr'], entry: 'rsc' } },
  },
  Effect.gen(function* () {
    const fetch = yield* makeApplicationHttpEffect<typeof application>()
    return { fetch: fetch.pipe(Effect.orDie) }
  }),
)

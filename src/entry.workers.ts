import { makeApplicationHttpEffect } from '@effront/alchemy/cloudflare/application'
import * as Cloudflare from 'alchemy/Cloudflare'
import { Effect } from 'effect'
import type application from './entry.effront'

export default Cloudflare.Worker(
  'Docs',
  {
    ...(process.env['ALCHEMY_STAGE'] === 'production'
      ? { domain: { name: 'oxlint.totto2727.dev', zoneName: 'totto2727.dev' } }
      : {}),
    main: import.meta.url,
    cache: { enabled: true },
    dev: { port: 1339 },
    compatibility: { date: '2026-09-01', flags: ['nodejs_compat'] },
    vite: { viteEnvironments: { entry: 'rsc', children: ['ssr'] } },
  },
  Effect.gen(function* () {
    const fetch = yield* makeApplicationHttpEffect<typeof application>()
    return { fetch: fetch.pipe(Effect.orDie) }
  }),
)

import { makeApplicationHttpEffect } from '@effront/alchemy/cloudflare'
import * as Cloudflare from 'alchemy/Cloudflare'
import { Effect } from 'effect'

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
    // Fixed application loading. Keep this dynamic import unchanged.
    const fetch = yield* makeApplicationHttpEffect(() => import('./entry.effront').then((module) => module.default))
    return { fetch: fetch.pipe(Effect.orDie) }
  }),
)

import { Stack } from 'alchemy'
import * as Cloudflare from 'alchemy/Cloudflare'
import { Effect } from 'effect'
import Worker from './src/entry.workers.ts'

// oxlint-disable-next-line import/no-default-export -- Alchemy loads the default deployment stack export.
export default Stack(
  'oxlint-docs',
  { providers: Cloudflare.providers(), state: Cloudflare.state() },
  Effect.gen(function* () {
    const site = yield* Worker
    return { url: site.url }
  }),
)

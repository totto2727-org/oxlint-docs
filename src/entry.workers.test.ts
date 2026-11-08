import type { makeApplicationHttpEffect } from '@effront/alchemy/cloudflare/application'
import type { Effect } from 'effect'
import type { HttpServerResponse } from 'effect/http'
import { expectTypeOf, it } from 'vite-plus/test'
import type application from './entry.effront'

type Construction = ReturnType<typeof makeApplicationHttpEffect<typeof application>>
type Handler = Effect.Success<Construction>

it('preserves concrete docs construction and HTTP handler types through published declarations', () => {
  expectTypeOf<Effect.Services<Construction>>().toEqualTypeOf<never>()
  expectTypeOf<Effect.Error<Construction>>().toEqualTypeOf<never>()
  expectTypeOf<Handler>().not.toBeAny()
  expectTypeOf<Effect.Success<Handler>>().toEqualTypeOf<HttpServerResponse.HttpServerResponse>()
  expectTypeOf<Effect.Error<Handler>>().not.toBeAny()
  expectTypeOf<Effect.Services<Handler>>().not.toBeAny()
})

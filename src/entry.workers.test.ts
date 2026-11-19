import type { makeApplicationHttpEffect } from '@effront/alchemy/cloudflare/application'
import type { Effect } from 'effect'
import type { HttpServerResponse } from 'effect/http'
import { describe, expectTypeOf, test } from 'vite-plus/test'
import type application from './entry.effront.tsx'

type Construction = ReturnType<typeof makeApplicationHttpEffect<typeof application>>
type Handler = Effect.Success<Construction>

describe('published Worker declarations', () => {
  test('preserves concrete docs construction and HTTP handler types', () => {
    expectTypeOf<Effect.Services<Construction>>().toEqualTypeOf<never>()
    expectTypeOf<Effect.Error<Construction>>().toEqualTypeOf<never>()
    expectTypeOf<Handler>().not.toBeAny()
    expectTypeOf<Effect.Success<Handler>>().toEqualTypeOf<HttpServerResponse.HttpServerResponse>()
    expectTypeOf<Effect.Error<Handler>>().not.toBeAny()
    expectTypeOf<Effect.Services<Handler>>().not.toBeAny()
  })
})

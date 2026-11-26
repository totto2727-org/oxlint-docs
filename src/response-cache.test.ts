import { Effect, Stream } from 'effect'
import { HttpServerRequest, HttpServerResponse } from 'effect/http'
import { describe, expect, test } from 'vite-plus/test'

import { responseCache } from './response-cache.ts'

const html = (): HttpServerResponse.HttpServerResponse =>
  HttpServerResponse.text('rendered', {
    contentType: 'text/html',
    headers: { 'cache-control': 'private, no-store' },
  })
const run = async <E>(
  request: Request,
  app: Effect.Effect<HttpServerResponse.HttpServerResponse, E> = Effect.succeed(html()),
): Promise<HttpServerResponse.HttpServerResponse> => {
  const serverRequest = HttpServerRequest.fromWeb(request)
  const middleware = app.pipe(responseCache, Effect.provideService(HttpServerRequest.HttpServerRequest, serverRequest))
  // oxlint-disable-next-line rules/no-effect-runtime-run -- Each test executes the real middleware at its request boundary.
  return Effect.runPromise(middleware)
}
const pageRequest = (headers: Record<string, string> = {}, method = 'GET'): Request =>
  new Request('https://docs.example/guide', {
    headers: { accept: 'text/html', ...headers },
    method,
  })
interface PolicyHeaders {
  browser: string | undefined
  edge: string | undefined
  variesOnAccept: boolean
}

const policyHeaders = (response: HttpServerResponse.HttpServerResponse): PolicyHeaders => ({
  browser: response.headers['cache-control'],
  edge: response.headers['cloudflare-cdn-cache-control'],
  variesOnAccept: response.headers['vary']?.split(', ').includes('accept') ?? false,
})

const expectedPolicy = (isPublic: boolean): PolicyHeaders => ({
  browser: isPublic ? 'public, max-age=0, must-revalidate' : 'private, no-store',
  edge: isPublic ? 'public, max-age=31536000' : 'private, no-store',
  variesOnAccept: true,
})

// oxlint-disable-next-line eslint/max-statements, eslint/max-lines-per-function -- This suite registers the related cache policy cases without performing setup in the callback.
describe('docs cache middleware', () => {
  test.each([
    'text/html',
    'text/*',
    '*/*',
    '*/*;q=0.8',
    'TEXT/HTML',
    'text/html;q=0.5, */*;q=0',
    'text/html, text/*;q=0',
    'text/html,application/xhtml+xml,*/*;q=0.8',
  ])('caches public GET with Accept %s without changing its body', async (accept) => {
    const original = html()
    const response = await run(pageRequest({ accept }), Effect.succeed(original))
    expect(policyHeaders(response)).toStrictEqual(expectedPolicy(true))
    expect(response.body).toBe(original.body)
    expect(original.headers['cache-control']).toBe('private, no-store')
    await expect(HttpServerResponse.toWeb(response).text()).resolves.toBe('rendered')
  })

  test.each([
    'application/json',
    '',
    'text/x-component',
    '*/*;q=0',
    'text/html;q=0, */*',
    'text/*;q=0, */*',
    'text/html;q=invalid, */*',
    'text/html;q = 0, */*',
    '*/*;q=invalid',
    'application/text/html',
  ])('does not opt unsupported Accept %s into caching', async (accept) => {
    const response = await run(pageRequest({ accept }))
    expect(policyHeaders(response)).toStrictEqual(expectedPolicy(false))
  })

  test.each([
    'text/html;q=1.1, */*',
    'text/html;q=1;q=0, */*',
    'text/html;q, */*',
    'text/html;q=1=0, */*',
    'text/html;q=0, text/html;q=1',
  ])('uses negotiator quality handling for %s', async (accept) => {
    const response = await run(pageRequest({ accept }))
    expect(policyHeaders(response)).toStrictEqual(expectedPolicy(true))
  })

  test.each([
    ['text/x-component', true],
    ['TEXT/X-COMPONENT', true],
    ['text/x-component; charset=utf-8', false],
    ['text/x-component;q=0.5, */*', true],
    ['text/x-component;q=0, */*', false],
    ['text/html', false],
    ['*/*', true],
    ['text/*', true],
  ])('checks Flight response eligibility for %s', async (accept, isPublic) => {
    const original = HttpServerResponse.text('flight', { contentType: 'text/x-component' })
    const response = await run(pageRequest({ accept }), Effect.succeed(original))
    expect(policyHeaders(response)).toStrictEqual(expectedPolicy(isPublic))
    expect(response.body).toBe(original.body)
  })

  describe.each(['text/html', 'text/x-component'])('symmetric cache policy for %s', (contentType) => {
    test.each([
      ['*/*', true],
      ['text/*', true],
      ['*/*;q=0', false],
      ['text/*;q=0, */*', false],
      [`${contentType};q=0, */*`, false],
      [`${contentType};q=0.5, */*;q=0`, true],
      ['application/json', false],
      ['', false],
    ])('checks Accept %s without changing the representation', async (accept, isPublic) => {
      const original = HttpServerResponse.text('representation bytes', {
        contentType,
        headers: { vary: 'Accept-Language' },
      })
      const response = await run(pageRequest({ accept }), Effect.succeed(original))
      expect(policyHeaders(response)).toStrictEqual(expectedPolicy(isPublic))
      expect(response.headers['content-type']).toBe(contentType)
      expect(response.headers['vary']).toBe('accept-language, accept')
      expect(response.body).toBe(original.body)
      await expect(HttpServerResponse.toWeb(response).text()).resolves.toBe('representation bytes')
    })
  })

  test.each([
    ['text/html; charset=utf-8', 'text/html; charset=utf-8', true],
    ['text/html; charset=iso-8859-1', 'text/html; charset=utf-8', false],
    ['text/html; profile="a,b"', 'text/html; profile="a,b"', true],
    ['text/html; profile="a,b"', 'text/html; profile="other"', false],
    ['text/x-component; charset=utf-8', 'text/x-component; charset=utf-8', true],
    ['text/x-component; charset=iso-8859-1', 'text/x-component; charset=utf-8', false],
  ])('matches Accept %s against response %s', async (accept, contentType, isPublic) => {
    const original = HttpServerResponse.text('body', { contentType })
    const response = await run(pageRequest({ accept }), Effect.succeed(original))
    expect(policyHeaders(response)).toStrictEqual(expectedPolicy(isPublic))
    expect(response.body).toBe(original.body)
  })

  test.each(['application/json', 'text/plain', 'text/html-other'])(
    'does not cache response type %s',
    async (contentType) => {
      const response = await run(
        pageRequest({ accept: '*/*' }),
        Effect.succeed(HttpServerResponse.text('body', { contentType })),
      )
      expect(policyHeaders(response)).toStrictEqual(expectedPolicy(false))
    },
  )

  test('does not opt requests without Accept into caching', async () => {
    const response = await run(new Request('https://docs.example/guide'))
    expect(policyHeaders(response)).toStrictEqual(expectedPolicy(false))
  })

  test('does not cache a response without a content type', async () => {
    const original = HttpServerResponse.empty()
    const response = await run(pageRequest({ accept: '*/*' }), Effect.succeed(original))
    expect(policyHeaders(response)).toStrictEqual(expectedPolicy(false))
  })

  test.each(['POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'])('does not cache %s', async (method) => {
    const response = await run(pageRequest({}, method))
    expect(policyHeaders(response)).toStrictEqual(expectedPolicy(false))
  })

  test.each([204, 206, 301, 302, 304, 404, 500])('does not cache status %s', async (status) => {
    const response = await run(pageRequest(), Effect.succeed(HttpServerResponse.empty({ status })))
    expect(response.status).toBe(status)
    expect(policyHeaders(response)).toStrictEqual(expectedPolicy(false))
  })

  test.each(['cookie', 'authorization'].flatMap((header) => ['one', 'two', ''].map((value) => ({ header, value }))))(
    'ignores request $header with value "$value" for public docs',
    async ({ header, value }) => {
      const response = await run(pageRequest({ [header]: value }))
      expect(policyHeaders(response)).toStrictEqual(expectedPolicy(true))
      expect(response.headers['vary']).toBe('accept')
    },
  )

  test('preserves Set-Cookie without changing the public policy', async () => {
    const original = HttpServerResponse.setHeader(html(), 'set-cookie', 'session=private')
    const response = await run(pageRequest(), Effect.succeed(original))
    expect(policyHeaders(response)).toStrictEqual(expectedPolicy(true))
    expect(response.headers['set-cookie']).toBe('session=private')
  })

  test('preserves native Effect cookies without changing the public policy', async () => {
    const original = HttpServerResponse.setCookieUnsafe(html(), 'session', 'private')
    const response = await run(pageRequest(), Effect.succeed(original))
    expect(policyHeaders(response)).toStrictEqual(expectedPolicy(true))
    expect(response.cookies).toBe(original.cookies)
    expect(HttpServerResponse.toWeb(response).headers.get('set-cookie')).toContain('session=private')
  })

  test('preserves and deduplicates existing Vary dimensions', async () => {
    const original = HttpServerResponse.setHeader(html(), 'vary', 'Accept-Language, ACCEPT')
    const response = await run(pageRequest(), Effect.succeed(original))
    expect(policyHeaders(response)).toStrictEqual(expectedPolicy(true))
    expect(response.headers['vary']).toBe('accept-language, accept')
  })

  test('leaves a pending response stream untouched', async () => {
    const original = HttpServerResponse.stream(Stream.never, { contentType: 'text/html' })
    const response = await run(pageRequest(), Effect.succeed(original))
    expect(policyHeaders(response)).toStrictEqual(expectedPolicy(true))
    expect(response.body).toBe(original.body)
  })

  test('preserves stream bytes', async () => {
    const original = HttpServerResponse.stream(
      Stream.fromIterable([new TextEncoder().encode('first'), new TextEncoder().encode('second')]),
      { contentType: 'text/html' },
    )
    const response = await run(pageRequest(), Effect.succeed(original))
    expect(response.body).toBe(original.body)
    await expect(HttpServerResponse.toWeb(response).text()).resolves.toBe('firstsecond')
  })

  test('preserves stream failures', async () => {
    // oxlint-disable-next-line rules/require-tagged-error -- Simulate an ordinary error from an upstream response stream.
    const failure = new Error('render failed')
    const original = HttpServerResponse.stream(Stream.fail(failure), {
      contentType: 'text/html',
    })
    const response = await run(pageRequest(), Effect.succeed(original))
    expect(response.body).toBe(original.body)
    await expect(HttpServerResponse.toWeb(response).text()).rejects.toThrow('render failed')
  })

  test('propagates handler failures', async () => {
    // oxlint-disable-next-line rules/require-tagged-error -- Simulate an ordinary error from an upstream handler.
    const failure = new Error('handler failed')
    const response = run(pageRequest(), Effect.fail(failure))
    await expect(response).rejects.toThrow('handler failed')
  })
})

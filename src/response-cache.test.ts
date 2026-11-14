import { Effect, Stream } from 'effect'
import { HttpServerRequest, HttpServerResponse } from 'effect/http'
import { describe, expect, it } from 'vite-plus/test'

import { responseCache } from './response-cache'

const html = () =>
  HttpServerResponse.text('rendered', {
    contentType: 'text/html',
    headers: { 'cache-control': 'private, no-store' },
  })
const run = <E>(
  request: Request,
  app: Effect.Effect<HttpServerResponse.HttpServerResponse, E> = Effect.succeed(html()),
) =>
  Effect.runPromise(
    app.pipe(
      responseCache,
      Effect.provideService(HttpServerRequest.HttpServerRequest, HttpServerRequest.fromWeb(request)),
    ),
  )
const pageRequest = (headers: Record<string, string> = {}, method = 'GET') =>
  new Request('https://docs.example/guide', {
    method,
    headers: { accept: 'text/html', ...headers },
  })
const expectPolicy = (response: HttpServerResponse.HttpServerResponse, isPublic: boolean) => {
  expect(response.headers['cache-control']).toBe(isPublic ? 'public, max-age=0, must-revalidate' : 'private, no-store')
  expect(response.headers['cloudflare-cdn-cache-control']).toBe(
    isPublic ? 'public, max-age=31536000' : 'private, no-store',
  )
  expect(response.headers['vary']?.split(', ')).toEqual(expect.arrayContaining(['accept']))
}

describe('docs cache middleware', () => {
  it.each([
    'text/html',
    '*/*',
    '*/*;q=0.8',
    'TEXT/HTML',
    'text/html;q=0.5, */*;q=0',
    'text/html, text/*;q=0',
    'text/html,application/xhtml+xml,*/*;q=0.8',
  ])('caches public GET with Accept %s without changing its body', async (accept) => {
    const original = html()
    const response = await run(pageRequest({ accept }), Effect.succeed(original))
    expectPolicy(response, true)
    expect(response.body).toBe(original.body)
    expect(original.headers['cache-control']).toBe('private, no-store')
    expect(await HttpServerResponse.toWeb(response).text()).toBe('rendered')
  })

  it.each([
    'application/json',
    '',
    'text/x-component',
    'text/*',
    '*/*;q=0',
    'text/html;q=0, */*',
    'text/*;q=0, */*',
    'text/html;q=invalid, */*',
    'text/html;q = 0, */*',
    '*/*;q=invalid',
    'application/text/html',
  ])('does not opt unsupported Accept %s into caching', async (accept) =>
    expectPolicy(await run(pageRequest({ accept })), false),
  )

  it.each([
    'text/html;q=1.1, */*',
    'text/html;q=1;q=0, */*',
    'text/html;q, */*',
    'text/html;q=1=0, */*',
    'text/html;q=0, text/html;q=1',
  ])('uses negotiator quality handling for %s', async (accept) =>
    expectPolicy(await run(pageRequest({ accept })), true),
  )

  it.each([
    ['text/x-component', true],
    ['TEXT/X-COMPONENT', true],
    ['text/x-component; charset=utf-8', false],
    ['text/x-component;q=0.5, */*', true],
    ['text/x-component;q=0, */*', false],
    ['text/html', false],
    ['*/*', false],
    ['text/*', false],
  ])('checks Flight response eligibility for %s', async (accept, isPublic) => {
    const original = HttpServerResponse.text('flight', { contentType: 'text/x-component' })
    const response = await run(pageRequest({ accept }), Effect.succeed(original))
    expectPolicy(response, isPublic)
    expect(response.body).toBe(original.body)
  })

  it.each([
    ['text/html; charset=utf-8', 'text/html; charset=utf-8', true],
    ['text/html; charset=iso-8859-1', 'text/html; charset=utf-8', false],
    ['text/html; profile="a,b"', 'text/html; profile="a,b"', true],
    ['text/html; profile="a,b"', 'text/html; profile="other"', false],
    ['text/x-component; charset=utf-8', 'text/x-component; charset=utf-8', true],
    ['text/x-component; charset=iso-8859-1', 'text/x-component; charset=utf-8', false],
  ])('matches Accept %s against response %s', async (accept, contentType, isPublic) => {
    const original = HttpServerResponse.text('body', { contentType })
    const response = await run(pageRequest({ accept }), Effect.succeed(original))
    expectPolicy(response, isPublic)
    expect(response.body).toBe(original.body)
  })

  it.each(['application/json', 'text/plain', 'text/html-other'])(
    'does not cache response type %s',
    async (contentType) => {
      const response = await run(
        pageRequest({ accept: '*/*' }),
        Effect.succeed(HttpServerResponse.text('body', { contentType })),
      )
      expectPolicy(response, false)
    },
  )

  it('does not opt requests without Accept into caching', async () => {
    expectPolicy(await run(new Request('https://docs.example/guide')), false)
  })

  it('does not cache a response without a content type', async () => {
    expectPolicy(await run(pageRequest({ accept: '*/*' }), Effect.succeed(HttpServerResponse.empty())), false)
  })

  it.each(['POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'])('does not cache %s', async (method) => {
    expectPolicy(await run(pageRequest({}, method)), false)
  })

  it.each([204, 206, 301, 302, 304, 404, 500])('does not cache status %s', async (status) => {
    const response = await run(pageRequest(), Effect.succeed(HttpServerResponse.empty({ status })))
    expect(response.status).toBe(status)
    expectPolicy(response, false)
  })

  it.each(['cookie', 'authorization'])('ignores request %s for public docs', async (header) => {
    for (const value of ['one', 'two', '']) {
      const response = await run(pageRequest({ [header]: value }))
      expectPolicy(response, true)
      expect(response.headers['vary']).toBe('accept')
    }
  })

  it('preserves Set-Cookie without changing the public policy', async () => {
    const response = await run(
      pageRequest(),
      Effect.succeed(HttpServerResponse.setHeader(html(), 'set-cookie', 'session=private')),
    )
    expectPolicy(response, true)
    expect(response.headers['set-cookie']).toBe('session=private')
  })

  it('preserves native Effect cookies without changing the public policy', async () => {
    const original = HttpServerResponse.setCookieUnsafe(html(), 'session', 'private')
    const response = await run(pageRequest(), Effect.succeed(original))
    expectPolicy(response, true)
    expect(response.cookies).toBe(original.cookies)
    expect(HttpServerResponse.toWeb(response).headers.get('set-cookie')).toContain('session=private')
  })

  it('preserves and deduplicates existing Vary dimensions', async () => {
    const response = await run(
      pageRequest(),
      Effect.succeed(HttpServerResponse.setHeader(html(), 'vary', 'Accept-Language, ACCEPT')),
    )
    expectPolicy(response, true)
    expect(response.headers['vary']).toBe('accept-language, accept')
  })

  it('leaves a pending response stream untouched', async () => {
    const original = HttpServerResponse.stream(Stream.never, { contentType: 'text/html' })
    const response = await run(pageRequest(), Effect.succeed(original))
    expectPolicy(response, true)
    expect(response.body).toBe(original.body)
  })

  it('preserves stream bytes', async () => {
    const original = HttpServerResponse.stream(
      Stream.fromIterable([new TextEncoder().encode('first'), new TextEncoder().encode('second')]),
      { contentType: 'text/html' },
    )
    const response = await run(pageRequest(), Effect.succeed(original))
    expect(response.body).toBe(original.body)
    expect(await HttpServerResponse.toWeb(response).text()).toBe('firstsecond')
  })

  it('preserves stream failures', async () => {
    const original = HttpServerResponse.stream(Stream.fail(new Error('render failed')), {
      contentType: 'text/html',
    })
    const response = await run(pageRequest(), Effect.succeed(original))
    expect(response.body).toBe(original.body)
    await expect(HttpServerResponse.toWeb(response).text()).rejects.toThrow('render failed')
  })

  it('propagates handler failures', async () => {
    await expect(run(pageRequest(), Effect.fail(new Error('handler failed')))).rejects.toThrow('handler failed')
  })
})

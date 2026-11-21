import { expect, test } from '@playwright/test'

// Local workerd validates origin policy, not managed Workers Cache behavior.
// Deployments still need checks for native HITs and version isolation.
const okStatus = 200
const notFoundStatus = 404
const varySeparator = /\s*,\s*/u

const expectPolicy = (headers: Record<string, string>, publicResponse: boolean): void => {
  expect(headers['cache-control']).toBe(publicResponse ? 'public, max-age=0, must-revalidate' : 'private, no-store')
  expect(headers['cloudflare-cdn-cache-control']).toBe(
    publicResponse ? 'public, max-age=31536000' : 'private, no-store',
  )
  expect(headers['vary']?.toLowerCase().split(varySeparator)).toEqual(expect.arrayContaining(['accept']))
}

const locales = ['en', 'ja']
const publicAcceptHeaders = ['text/html', 'text/x-component', '*/*', 'text/*']
const cacheQueries = ['one', 'two']

locales.forEach((locale) => {
  publicAcceptHeaders.forEach((accept) => {
    cacheQueries.forEach((query) => {
      test(`origin serves ${locale} ${accept} with public policy for query ${query}`, async ({ request }) => {
        const response = await request.get(`/${locale}/guide/getting-started?cache-contract=${query}`, {
          headers: { Accept: accept },
        })
        expect(response.status()).toBe(okStatus)
        expect(response.headers()['content-type']).toContain(
          accept === 'text/x-component' ? 'text/x-component' : 'text/html',
        )
        expectPolicy(response.headers(), true)
        const body = await response.text()
        expect(body).toContain(`/${locale}/guide/getting-started`)
        if (accept === 'text/x-component') {
          expect(body).not.toContain('<!DOCTYPE html>')
        } else {
          expect(body).toContain(`lang="${locale}"`)
        }
      })
    })
  })
})

test('origin accepts a browser document Accept header', async ({ request }) => {
  const response = await request.get('/en/guide/getting-started', {
    headers: { Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' },
  })
  expect(response.status()).toBe(okStatus)
  expectPolicy(response.headers(), true)
  expect(await response.text()).toContain('lang="en"')
})

const excludedAcceptHeaders = ['application/json', '*/*;q=0', 'text/html;q=0, */*', 'text/*;q=0, */*']
excludedAcceptHeaders.forEach((accept) => {
  test(`origin leaves excluded HTML private for ${accept}`, async ({ request }) => {
    const response = await request.get('/en/guide/getting-started', { headers: { Accept: accept } })
    expect(response.status()).toBe(okStatus)
    expectPolicy(response.headers(), false)
  })
})

test('origin caches wildcard HTML when Flight is explicitly excluded', async ({ request }) => {
  const response = await request.get('/en/guide/getting-started', {
    headers: { Accept: 'text/x-component;q=0, */*' },
  })
  expect(response.status()).toBe(okStatus)
  expect(response.headers()['content-type']).toContain('text/html')
  expectPolicy(response.headers(), true)
  expect(await response.text()).toContain('lang="en"')
})

test('origin does not opt missing pages into long-lived CDN caching', async ({ request }) => {
  const response = await request.get('/en/missing-cache-test-page', {
    headers: { Accept: 'text/html' },
  })
  expect(response.status()).toBe(notFoundStatus)
  // Missing-route responses have no cache opt-in headers on the real host.
  expect(response.headers()['cloudflare-cdn-cache-control']).toBeUndefined()
  expect(response.headers()['cache-control'] ?? '').not.toContain('public')
})

const credentialHeaders = ['Cookie', 'Authorization']
credentialHeaders.forEach((name) => {
  test(`origin keeps ${name} requests public without varying on credentials`, async ({ request }) => {
    const headers = {
      Accept: 'text/html',
      [name]: name === 'Cookie' ? 'session=private' : 'Bearer private',
    }
    const response = await request.get('/en/guide/getting-started', { headers })
    expect(response.status()).toBe(okStatus)
    expectPolicy(response.headers(), true)
    const vary = response.headers()['vary']?.toLowerCase().split(varySeparator)
    expect(vary).not.toContain('cookie')
    expect(vary).not.toContain('authorization')
  })
})

test('origin marks invalid POST private', async ({ request }) => {
  const response = await request.post('/en/guide/getting-started', {
    data: 'not-a-server-function',
    headers: { Accept: 'text/html' },
  })
  expect(response.status()).not.toBe(okStatus)
  expect(response.headers()['cache-control']).toBe('private, no-store')
  expect(response.headers()['cloudflare-cdn-cache-control']).toBeUndefined()
})

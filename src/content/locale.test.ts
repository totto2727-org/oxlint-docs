import { Effect } from 'effect'
import { describe, expect, it, vi } from 'vite-plus/test'
import { documentLocale, documentPath, localizedPath, localizeDocumentLink } from './locale'
import { localizedMarkdownPages, markdownPages } from './markdown'

// Keep the Japanese article available, but point its English metadata at a missing source.
// A loader that silently falls back to the Japanese article must fail this test.
vi.mock('./en/catalog', async (importOriginal) => {
  const original = await importOriginal<typeof import('./en/catalog')>()
  return {
    ...original,
    englishArticleCatalog: original.englishArticleCatalog.map((page) =>
      page.slug === '/guide/getting-started' ? { ...page, source: '/missing-english-translation' } : page,
    ),
  }
})

describe('documentation locale paths', () => {
  it.each([
    ['/', 'ja', '/'],
    ['/guide/getting-started', 'ja', '/guide/getting-started'],
    ['/ja', 'ja', '/'],
    ['/ja/', 'ja', '/'],
    ['/ja/guide/getting-started', 'ja', '/guide/getting-started'],
    ['/en', 'en', '/'],
    ['/en/', 'en', '/'],
    ['/en/guide/getting-started', 'en', '/guide/getting-started'],
    ['/english/guide', 'ja', '/english/guide'],
    ['/japanese/guide', 'ja', '/japanese/guide'],
    ['/fr/guide/getting-started', 'ja', '/fr/guide/getting-started'],
  ])('%s identifies only a complete locale prefix', (pathname, locale, path) => {
    expect(documentLocale(pathname)).toBe(locale)
    expect(documentPath(pathname)).toBe(path)
  })

  it.each(['/', '/guide/getting-started', '/rules/no-let'])(
    '%s switches languages without duplicating prefixes or losing the article path',
    (path) => {
      for (const locale of ['ja', 'en'] as const) {
        const expected = `/${locale}${path === '/' ? '' : path}`
        for (const source of [path, localizedPath(path, 'ja'), localizedPath(path, 'en')]) {
          expect(localizedPath(source, locale)).toBe(expected)
          expect(documentPath(localizedPath(source, locale))).toBe(path)
          expect(documentLocale(localizedPath(source, locale))).toBe(locale)
        }
      }
    },
  )

  it.each(['ja', 'en'] as const)(
    'localizes root-relative article links in %s while preserving queries and anchors',
    (locale) => {
      expect(localizeDocumentLink('/', locale)).toBe(`/${locale}`)
      expect(localizeDocumentLink('/guide/getting-started', locale)).toBe(`/${locale}/guide/getting-started`)
      expect(localizeDocumentLink('/guide/getting-started?view=all#params', locale)).toBe(
        `/${locale}/guide/getting-started?view=all#params`,
      )
      expect(localizeDocumentLink('/#overview', locale)).toBe(`/${locale}/#overview`)
    },
  )

  it.each([
    undefined,
    '',
    '#params',
    '?view=all#params',
    './routes.md#params',
    'https://effect.website/docs/',
    'mailto:docs@example.com',
    '//example.com/guide/getting-started',
    '/en',
    '/ja',
    '/en#overview',
    '/ja?view=all',
    '/en/guide/getting-started#params',
    '/ja/guide/getting-started#params',
  ])('preserves explicit locale and non-document link %s', (href) => {
    expect(localizeDocumentLink(href, 'ja')).toBe(href)
    expect(localizeDocumentLink(href, 'en')).toBe(href)
  })

  it('does not mistake a locale-like article name for an existing prefix', () => {
    expect(localizeDocumentLink('/english', 'en')).toBe('/en/english')
    expect(localizeDocumentLink('/japanese', 'ja')).toBe('/ja/japanese')
  })
})

describe('missing English article', () => {
  it('fails instead of serving available Japanese content', async () => {
    const legacy = markdownPages.find((page) => page.slug === '/guide/getting-started')
    const japanese = localizedMarkdownPages('ja').find((page) => page.slug === '/ja/guide/getting-started')
    const english = localizedMarkdownPages('en').find((page) => page.slug === '/en/guide/getting-started')
    expect(legacy).toBeDefined()
    expect(japanese).toBeDefined()
    expect(english).toBeDefined()
    await expect(Effect.runPromise(legacy!.content())).resolves.toBeDefined()
    await expect(Effect.runPromise(japanese!.content())).resolves.toBeDefined()
    await expect(Effect.runPromise(english!.content())).rejects.toThrow(
      'Documentation article is missing: en/missing-english-translation',
    )
  })
})

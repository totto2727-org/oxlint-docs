import { Effect } from 'effect'
import { describe, expect, test, vi } from 'vite-plus/test'
import { documentLocale, documentPath, localizedPath, localizeDocumentLink } from './locale.ts'
import { getPage } from './pages.ts'

vi.mock(import('./en/catalog.ts'), async (importOriginal) => {
  const { englishArticleCatalog } = await importOriginal()
  return {
    englishArticleCatalog: englishArticleCatalog.map(
      ({ description, group, headings, section, slug, source, title }) => ({
        description,
        group,
        headings,
        section,
        slug,
        source: slug === '/guide/getting-started' ? '/missing-english-translation' : source,
        title,
      }),
    ),
  }
})

const localizedCases = ['/', '/guide/getting-started', '/rules/no-let'].flatMap((path) =>
  (['ja', 'en'] as const).flatMap((locale) => {
    const expected = path === '/' ? `/${locale}` : `/${locale}${path}`
    return [path, localizedPath(path, 'ja'), localizedPath(path, 'en')].map((source) => ({
      expected,
      locale,
      path,
      source,
    }))
  }),
)

describe('documentation locale paths', () => {
  test.each([
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

  test.each(localizedCases)('switches $source to $expected', ({ expected, locale, path, source }) => {
    const localized = localizedPath(source, locale)
    expect(localized).toBe(expected)
    expect(documentPath(localized)).toBe(path)
    expect(documentLocale(localized)).toBe(locale)
  })
})

describe('documentation links', () => {
  test.each(['ja', 'en'] as const)('localizes links in %s while preserving queries and anchors', (locale) => {
    expect(localizeDocumentLink('/', locale)).toBe(`/${locale}`)
    expect(localizeDocumentLink('/guide/getting-started', locale)).toBe(`/${locale}/guide/getting-started`)
    expect(localizeDocumentLink('/guide/getting-started?view=all#params', locale)).toBe(
      `/${locale}/guide/getting-started?view=all#params`,
    )
    expect(localizeDocumentLink('/#overview', locale)).toBe(`/${locale}/#overview`)
  })

  test.each([
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

  test('does not mistake a locale-like article name for an existing prefix', () => {
    expect(localizeDocumentLink('/english', 'en')).toBe('/en/english')
    expect(localizeDocumentLink('/japanese', 'ja')).toBe('/ja/japanese')
  })
})

const loadArticle = async (path: string): Promise<unknown> =>
  // oxlint-disable-next-line rules/no-effect-runtime-run -- Each Vitest case runs an independent article load.
  Effect.runPromise(getPage(path).content())

describe('missing English article', () => {
  test.each(['/guide/getting-started', '/ja/guide/getting-started'])(
    'still loads the Japanese article at %s',
    async (path) => {
      await expect(loadArticle(path)).resolves.toBeDefined()
    },
  )

  test('fails instead of serving available Japanese content', async () => {
    await expect(loadArticle('/en/guide/getting-started')).rejects.toThrow(
      'Documentation article is missing: en/missing-english-translation',
    )
  })
})

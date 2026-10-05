import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vite-plus/test'
import { DocsShell, type DocsShellProps } from './docs-shell'
import { localizedPath } from '../content/locale'

const introduction = { slug: '/guide', title: 'はじめに', section: 'Guide' }
const chapter = {
  slug: '/rules/runtime',
  title: 'ランタイムとリクエストのライフサイクル',
  section: 'Rules',
  group: 'Effect',
}
const nextChapter = { ...chapter, slug: '/rules/flight', title: 'Flight' }
const navigation = [introduction, chapter, nextChapter]
const englishIntroduction = { slug: '/en/guide', title: 'Introduction', section: 'Guides' }
const englishChapter = {
  slug: '/en/rules/runtime',
  title: 'Runtime and request lifetime',
  section: 'Rules',
  group: 'Effect',
}
const englishNextChapter = {
  ...englishChapter,
  slug: '/en/rules/flight',
  title: 'Flight',
}
const englishNavigation = [englishIntroduction, englishChapter, englishNextChapter]

function render(
  current: DocsShellProps['current'],
  options: Partial<Omit<DocsShellProps, 'current' | 'children'>> = {},
) {
  return renderToStaticMarkup(
    <DocsShell current={current} navigation={navigation} headings={[]} {...options}>
      <h1>{current.title}</h1>
    </DocsShell>,
  )
}

describe('documentation hierarchy', () => {
  it('nests metadata-defined chapters once under their group and marks the active link', () => {
    const html = render(chapter)
    const sidebar = html.split('<header class="sticky')[0]!
    expect(sidebar).toMatch(/<ul[^>]+aria-label="Rules"><li[^>]*><span[^>]*>Effect<\/span><ul/)
    expect(sidebar.match(/aria-label="Effect"/g)).toHaveLength(1)
    expect(sidebar).toContain(`href="${chapter.slug}" aria-current="page"`)
    expect(sidebar).toContain(`href="${nextChapter.slug}"`)
    expect(sidebar).toMatch(/aria-label="Guide"><li[^>]*><a/)
    expect(sidebar).toContain('h-auto')
  })

  it("renders an ordered breadcrumb including only the current page's ancestors", () => {
    const grouped = render(chapter).match(/<nav aria-label="パンくずリスト"[^>]*>(.*?)<\/nav>/)?.[1]
    expect(grouped).toMatch(/<ol.*Rules.*Effect.*aria-current="page".*ランタイム/)
    const ungrouped = render(introduction).match(/<nav aria-label="パンくずリスト"[^>]*>(.*?)<\/nav>/)?.[1]
    expect(ungrouped).toContain('Guide')
    expect(ungrouped).not.toContain('Effect')
  })

  it('preserves no-JavaScript chapter links and the official upstream footer', () => {
    const html = render(chapter)
    const fallback = html.match(/<noscript>(.*?)<\/noscript>/)?.[1]
    expect(fallback).toContain(`href="${chapter.slug}" aria-current="page"`)
    expect(fallback).toContain(`Rules: Effect: ${chapter.title}`)
    expect(html).toContain('href="https://github.com/totto2727-org/oxlint"')
    expect(html).toContain('github.com/totto2727-org/oxlint')
  })

  it('renders English shell labels, grouped navigation, breadcrumbs, and table of contents', () => {
    const html = render(englishChapter, {
      locale: 'en',
      navigation: englishNavigation,
      headings: [{ id: 'request-lifetime', title: 'Request lifetime' }],
    })
    for (const label of [
      'Skip to content',
      'Filter guides',
      'placeholder="Search guides"',
      'aria-label="Breadcrumbs"',
      'Documentation',
      'aria-label="On this page"',
      'aria-label="Previous and next pages"',
      'Previous page',
      'Next page',
      'oxlint website',
    ]) {
      expect(html).toContain(label)
    }
    const sidebar = html.split('<header class="sticky')[0]!
    expect(sidebar).toMatch(/<ul[^>]+aria-label="Rules"><li[^>]*><span[^>]*>Effect<\/span><ul/)
    expect(sidebar.match(/aria-label="Effect"/g)).toHaveLength(1)
    expect(sidebar).toContain(`href="${englishChapter.slug}" aria-current="page"`)
    expect(sidebar).toContain('href="/en"')
    expect(html.match(/<nav aria-label="Breadcrumbs"[^>]*>(.*?)<\/nav>/)?.[1]).toMatch(
      /<ol.*Rules.*Effect.*aria-current="page".*Runtime and request lifetime/,
    )
    expect(html).toContain('href="#request-lifetime"')
    expect(html).toContain('Request lifetime')
    expect(html).not.toContain('パンくずリスト')
    expect(html).not.toContain('ガイドを検索')
  })

  it('keeps English no-JavaScript and previous/next links in the same language', () => {
    const html = render(englishChapter, { locale: 'en', navigation: englishNavigation })
    const fallback = html.match(/<noscript>(.*?)<\/noscript>/)?.[1]
    expect(fallback).toContain('aria-label="Documentation navigation"')
    expect(fallback).toContain(`href="${englishChapter.slug}" aria-current="page"`)
    expect(fallback).toContain(`Rules: Effect: ${englishChapter.title}`)
    for (const item of englishNavigation) {
      expect(fallback).toContain(`href="${item.slug}"`)
    }
    const adjacent = html.match(/<nav aria-label="Previous and next pages"[^>]*>(.*?)<\/nav>/)?.[1]
    expect(adjacent).toContain(`href="${englishIntroduction.slug}"`)
    expect(adjacent).toContain(`href="${englishNextChapter.slug}"`)
    expect(adjacent).not.toContain(`href="${englishChapter.slug}"`)
  })

  it.each(['ja', 'en'] as const)(
    'switches the current %s article and homepage with accessible language links',
    (locale) => {
      for (const path of ['/', '/guide/routes', '/rules/request']) {
        const current = { ...englishChapter, slug: localizedPath(path, locale) }
        const html = render(current, { locale, navigation: [current] })
        const switcher = html.match(/<nav aria-label="(?:Language|言語)"[^>]*>(.*?)<\/nav>/)?.[1]
        expect(switcher).toBeDefined()
        const links = [...switcher!.matchAll(/<a\b[^>]*>[^<]*<\/a>/g)].map((match) => match[0])
        expect(links).toHaveLength(2)
        for (const language of ['ja', 'en'] as const) {
          const link = links.find((anchor) => anchor.includes(`href="${localizedPath(path, language)}"`))
          expect(link).toBeDefined()
          expect(link).toContain(`lang="${language}"`)
          expect(link).toMatch(new RegExp(`\\bhreflang="${language}"`, 'i'))
          expect(link).toContain(language === 'en' ? '>English</a>' : '>日本語</a>')
          if (language === locale) expect(link).toContain('aria-current="true"')
          else expect(link).not.toContain('aria-current=')
        }
      }
    },
  )

  it('offers both explicit locale URLs from a legacy Japanese article', () => {
    const html = render(chapter)
    const switcher = html.match(/<nav aria-label="言語"[^>]*>(.*?)<\/nav>/)?.[1]
    expect(switcher).toContain(`href="/en${chapter.slug}"`)
    expect(switcher).toContain(`href="/ja${chapter.slug}"`)
    expect(switcher).toContain('aria-current="true"')
  })
})

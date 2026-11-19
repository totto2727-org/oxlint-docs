/* oxlint-disable eslint/max-lines-per-function, eslint/max-statements, vitest/max-expects -- Keep related markup assertions in one render per behavior. */
/* oxlint-disable eslint/prefer-named-capture-group, eslint/require-unicode-regexp -- Preserve positional captures in the existing serialized markup matchers. */
/* oxlint-disable react-perf/jsx-no-new-array-as-prop, react/jsx-props-no-spreading -- The render helper passes fixture overrides to the shell. */
/* oxlint-disable rules/no-for-loops, vitest/no-conditional-expect, vitest/no-conditional-in-test -- The assertions walk the generated navigation links and distinguish the current page. */
/* oxlint-disable typescript/no-non-null-assertion -- Required fixture landmarks fail the test if absent. */
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, test } from 'vite-plus/test'
import { DocsShell } from './docs-shell.tsx'
import type { DocsShellProps } from './docs-shell.tsx'
// oxlint-disable-next-line import/no-relative-parent-imports -- Verify generated links against the shared locale helper.
import { localizedPath } from '../content/locale.ts'

const introduction = { section: 'Guide', slug: '/guide', title: 'はじめに' }
const chapter = {
  group: 'Effect',
  section: 'Rules',
  slug: '/rules/runtime',
  title: 'ランタイムとリクエストのライフサイクル',
}
const nextChapter = { ...chapter, slug: '/rules/flight', title: 'Flight' }
const navigation = [introduction, chapter, nextChapter]
const englishIntroduction = { section: 'Guides', slug: '/en/guide', title: 'Introduction' }
const englishChapter = {
  group: 'Effect',
  section: 'Rules',
  slug: '/en/rules/runtime',
  title: 'Runtime and request lifetime',
}
const englishNextChapter = {
  ...englishChapter,
  slug: '/en/rules/flight',
  title: 'Flight',
}
const englishNavigation = [englishIntroduction, englishChapter, englishNextChapter]

const render = (
  current: DocsShellProps['current'],
  options: Partial<Omit<DocsShellProps, 'current' | 'children'>> = {},
): string =>
  renderToStaticMarkup(
    <DocsShell current={current} navigation={navigation} headings={[]} {...options}>
      <h1>{current.title}</h1>
    </DocsShell>,
  )

describe('documentation hierarchy', () => {
  test('nests metadata-defined chapters once under their group and marks the active link', () => {
    const html = render(chapter)
    const sidebar = html.split('<header class="sticky')[0]!
    expect(sidebar).toMatch(/<ul[^>]+aria-label="Rules"><li[^>]*><span[^>]*>Effect<\/span><ul/)
    expect(sidebar.match(/aria-label="Effect"/g)).toHaveLength(1)
    expect(sidebar).toContain(`href="${chapter.slug}" aria-current="page"`)
    expect(sidebar).toContain(`href="${nextChapter.slug}"`)
    expect(sidebar).toMatch(/aria-label="Guide"><li[^>]*><a/)
    expect(sidebar).toContain('h-auto')
  })

  test("renders an ordered breadcrumb including only the current page's ancestors", () => {
    const grouped = /<nav aria-label="パンくずリスト"[^>]*>(.*?)<\/nav>/.exec(render(chapter))?.[1]
    expect(grouped).toMatch(/<ol.*Rules.*Effect.*aria-current="page".*ランタイム/)
    const ungrouped = /<nav aria-label="パンくずリスト"[^>]*>(.*?)<\/nav>/.exec(render(introduction))?.[1]
    expect(ungrouped).toContain('Guide')
    expect(ungrouped).not.toContain('Effect')
  })

  test('preserves no-JavaScript chapter links and the official upstream footer', () => {
    const html = render(chapter)
    const fallback = /<noscript>(.*?)<\/noscript>/.exec(html)?.[1]
    expect(fallback).toContain(`href="${chapter.slug}" aria-current="page"`)
    expect(fallback).toContain(`Rules: Effect: ${chapter.title}`)
    expect(html).toContain('href="https://github.com/totto2727-org/oxlint"')
    expect(html).toContain('github.com/totto2727-org/oxlint')
  })

  test('renders English shell labels, grouped navigation, breadcrumbs, and table of contents', () => {
    const html = render(englishChapter, {
      headings: [{ id: 'request-lifetime', title: 'Request lifetime' }],
      locale: 'en',
      navigation: englishNavigation,
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
    expect(/<nav aria-label="Breadcrumbs"[^>]*>(.*?)<\/nav>/.exec(html)?.[1]).toMatch(
      /<ol.*Rules.*Effect.*aria-current="page".*Runtime and request lifetime/,
    )
    expect(html).toContain('href="#request-lifetime"')
    expect(html).toContain('Request lifetime')
    expect(html).not.toContain('パンくずリスト')
    expect(html).not.toContain('ガイドを検索')
  })

  test('keeps English no-JavaScript and previous/next links in the same language', () => {
    const html = render(englishChapter, { locale: 'en', navigation: englishNavigation })
    const fallback = /<noscript>(.*?)<\/noscript>/.exec(html)?.[1]
    expect(fallback).toContain('aria-label="Documentation navigation"')
    expect(fallback).toContain(`href="${englishChapter.slug}" aria-current="page"`)
    expect(fallback).toContain(`Rules: Effect: ${englishChapter.title}`)
    for (const item of englishNavigation) {
      expect(fallback).toContain(`href="${item.slug}"`)
    }
    const adjacent = /<nav aria-label="Previous and next pages"[^>]*>(.*?)<\/nav>/.exec(html)?.[1]
    expect(adjacent).toContain(`href="${englishIntroduction.slug}"`)
    expect(adjacent).toContain(`href="${englishNextChapter.slug}"`)
    expect(adjacent).not.toContain(`href="${englishChapter.slug}"`)
  })

  test.each(['ja', 'en'] as const)(
    'switches the current %s article and homepage with accessible language links',
    (locale) => {
      for (const path of ['/', '/guide/routes', '/rules/request']) {
        const current = { ...englishChapter, slug: localizedPath(path, locale) }
        const html = render(current, { locale, navigation: [current] })
        const switcher = /<nav aria-label="(?:Language|言語)"[^>]*>(.*?)<\/nav>/.exec(html)?.[1]
        expect(switcher).toBeDefined()
        const links = [...switcher!.matchAll(/<a\b[^>]*>[^<]*<\/a>/g)].map((match) => match[0])
        expect(links).toHaveLength(2)
        for (const language of ['ja', 'en'] as const) {
          const link = links.find((anchor) => anchor.includes(`href="${localizedPath(path, language)}"`))
          expect(link).toBeDefined()
          expect(link).toContain(`lang="${language}"`)
          expect(link).toMatch(new RegExp(`\\bhreflang="${language}"`, 'i'))
          expect(link).toContain(language === 'en' ? '>English</a>' : '>日本語</a>')
          if (language === locale) {
            expect(link).toContain('aria-current="true"')
          } else {
            expect(link).not.toContain('aria-current=')
          }
        }
      }
    },
  )

  test('offers both explicit locale URLs from a legacy Japanese article', () => {
    const html = render(chapter)
    const switcher = /<nav aria-label="言語"[^>]*>(.*?)<\/nav>/.exec(html)?.[1]
    expect(switcher).toContain(`href="/en${chapter.slug}"`)
    expect(switcher).toContain(`href="/ja${chapter.slug}"`)
    expect(switcher).toContain('aria-current="true"')
  })
})

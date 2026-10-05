import { readFileSync } from 'node:fs'
import { Effect } from 'effect'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vite-plus/test'
import { catalog } from './catalog'
import { documents } from './documents'
import { getPage, localizedNavigation, localizedPages, pages } from './index'
import { ruleArticles, ruleHeadings, ruleMarkdown } from './rules'

const expectedTypeScript = [
  'consistent-import-extension',
  'no-eslint-disable-comments',
  'no-jsx-script-tag',
  'no-let',
  'no-redundant-alias',
  'no-string-style',
  'require-disable-reason',
  'require-import-extension',
]
const expectedEffect = [
  'force-array-empty',
  'force-iterable-empty',
  'force-predicate',
  'force-string-empty',
  'no-effect-runtime-run',
  'no-bigint-literals',
  'no-import-from-barrel-package',
  'no-opaque-instance-fields',
  'no-unused-internal',
  'no-error-cause-option',
  'no-error-property-access',
  'no-fetch',
  'no-instanceof-error',
  'no-js-date',
  'no-node-imports',
  'no-option-tag-comparison',
  'no-raw-hono-create-middleware',
  'no-sync-decode',
  'no-type-predicate',
  'prefer-is-nullish',
  'prefer-non-unknown-decode',
  'require-top-level-decoder',
]

describe('oxlint documentation contract', () => {
  it('documents exactly the exported groups and compatibility alias', () => {
    expect(ruleArticles).toHaveLength(34)
    expect(
      ruleArticles
        .filter((rule) => rule.group === 'TypeScript' && !rule.optIn)
        .map((rule) => rule.name)
        .sort(),
    ).toEqual(expectedTypeScript.toSorted())
    expect(
      ruleArticles
        .filter((rule) => rule.group === 'Effect' && !rule.optIn)
        .map((rule) => rule.name)
        .sort(),
    ).toEqual(expectedEffect.toSorted())
    expect(new Set(ruleArticles.map((rule) => rule.name)).size).toBe(34)
    expect(
      ruleArticles
        .filter((rule) => rule.optIn)
        .map((rule) => rule.name)
        .sort(),
    ).toEqual(['force-ts-extension', 'no-effect-import-as', 'no-effect-subpath-import', 'no-js-extension-imports'])
  })
  it('registers every catalog URL explicitly and nothing else', () => {
    const entry = readFileSync(new URL('../entry.effront.tsx', import.meta.url), 'utf8')
    const routes = [...entry.matchAll(/\.page\('([^']+)'/g)].map((match) => match[1])
    expect(routes.toSorted((left, right) => String(left).localeCompare(String(right)))).toEqual(
      [...pages, ...localizedPages].map((page) => page.slug).sort(),
    )
  })
  it.each(['en', 'ja'] as const)(
    'renders all rule pages with real prose, examples and anchors in %s',
    async (locale) => {
      expect(catalog(locale)).toHaveLength(38)
      const nav = localizedNavigation(locale)
      expect(nav.every((item) => item.slug === `/${locale}` || item.slug.startsWith(`/${locale}/`))).toBe(true)
      for (const rule of ruleArticles) {
        const html = renderToStaticMarkup(await Effect.runPromise(getPage(`/${locale}/rules/${rule.name}`).content()))
        for (const heading of ruleHeadings(locale)) expect(html).toContain(`id="${heading.id}"`)
        expect(html).toContain('data-code-block')
        expect(rule.invalid).not.toBe(rule.valid)
        expect(ruleMarkdown(rule, locale)).toContain(rule.invalid)
        expect(ruleMarkdown(rule, locale)).toContain(rule.valid)
        expect(html).not.toContain('architecture-baseline')
      }
      for (const page of catalog(locale).filter((page) => page.section !== 'Rules')) {
        const slug = page.slug === '/' ? `/${locale}` : `/${locale}${page.slug}`
        const html = renderToStaticMarkup(await Effect.runPromise(getPage(slug).content()))
        for (const heading of page.headings) expect(html).toContain(`id="${heading.id}"`)
      }
    },
  )
  it('keeps preset groups to TypeScript and Effect and omits the compatibility alias', () => {
    for (const locale of ['en', 'ja'] as const) {
      const corpus = documents(locale)
      expect(Object.keys(corpus).filter((name) => name.startsWith('presets/'))).toEqual([
        'presets/typescript.md',
        'presets/effect.md',
      ])
      for (const rule of ruleArticles.filter((article) => article.optIn)) {
        expect(corpus['presets/typescript.md']).not.toContain(`[${rule.name}]`)
        expect(corpus['presets/effect.md']).not.toContain(`[${rule.name}]`)
      }
      expect(corpus['presets/typescript.md']).toContain('defineConfig')
    }
  })
  it.each(['en', 'ja'] as const)(
    'documents the shared native baseline without inherited test exemptions in %s',
    (locale) => {
      const corpus = documents(locale)
      for (const group of ['typescript', 'effect']) {
        const text = corpus[`presets/${group}.md`]!
        expect(text).toContain('Ultracite 7.12.3')
        expect(text).toContain('ultracite/oxlint/core')
        expect(text).toContain('48156546701badf2c6e60f25cf1e8511f7dc44c7/packages/cli/config/oxlint/core/index.mjs')
        expect(text).toContain('48156546701badf2c6e60f25cf1e8511f7dc44c7/apps/docs/docs/provider/oxlint.mdx')
        expect(text).toContain('{#baseline}')
        for (const nativeRule of ['unicorn/prefer-bigint-literals', 'preserve-caught-error', 'prefer-const']) {
          expect(text).toContain(nativeRule)
        }
        expect(text).not.toContain('Test-file overrides allow')
        expect(text).not.toContain('テストファイルでは no-effect-runtime-run')
        expect(text).not.toContain('テストファイルでは no-let')
        expect(text).not.toContain('**/*.test.{ts,tsx}')
        expect(text).toContain('**/*.gen.ts')
        expect(text).toContain('oxfmt')
      }
    },
  )
  it('rejects missing pages rather than returning another article', () => {
    expect(() => getPage('/en/missing')).toThrow('missing content')
  })
})

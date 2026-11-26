// oxlint-disable-next-line rules/no-node-imports -- This test reads the source manifest from the Node test runner.
import { readFile } from 'node:fs/promises'
import { presetRuleNames } from '@totto2727/oxlint'
import { Effect, Predicate } from 'effect'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, test } from 'vite-plus/test'
import { catalog } from './catalog.ts'
import { localizedPath } from './locale.ts'
import { getPage, localizedNavigation } from './pages.ts'
import { effectRuleSource, externalEffectRuleNames, retiredRuleRedirects } from './policies.ts'
import { ruleArticles } from './rules.ts'

const locales = ['en', 'ja'] as const

const renderArticle = async (slug: string): Promise<string> =>
  // oxlint-disable-next-line rules/no-effect-runtime-run -- The renderer runs at the Vitest boundary for each isolated document.
  renderToStaticMarkup(await Effect.runPromise(getPage(slug).content()))

const routeCases = locales.flatMap((locale) =>
  catalog(locale).map(({ headings, slug }) => ({ headings, path: localizedPath(slug, locale) })),
)

const exampleCases = locales.flatMap((locale) =>
  ruleArticles.map(({ name }): { path: string } => ({ path: localizedPath(`/rules/${name}`, locale) })),
)

const byName = (left: string, right: string): number => left.localeCompare(right)

describe('documentation catalog', () => {
  test('documents exactly the installed preset rules', () => {
    const documented = [...ruleArticles.map(({ name }) => name), ...externalEffectRuleNames]
    expect(documented.toSorted(byName)).toStrictEqual(presetRuleNames.toSorted(byName))
  })

  test('registers every catalog route and no retired article routes', async () => {
    const source = await readFile(new URL('../entry.effront.tsx', import.meta.url), 'utf8')
    const routes = [...source.matchAll(/\.page\('(?<path>[^']+)'/gu)]
      .map(({ groups }) => groups?.['path'])
      .filter((path) => Predicate.isNotNullish(path))
    const paths = [...catalog('ja').map(({ slug }) => slug), ...routeCases.map(({ path }) => path)]
    expect(routes.toSorted(byName)).toStrictEqual(paths.toSorted(byName))
  })

  test.each(locales)('hides retired articles from %s navigation', (locale) => {
    const removedPaths = new Set([...retiredRuleRedirects.keys()].map((path) => localizedPath(path, locale)))
    expect(localizedNavigation(locale).some(({ slug }) => removedPaths.has(slug))).toBe(false)
  })

  test('rejects missing pages instead of reading another article', () => {
    expect(() => getPage('/en/missing')).toThrow('missing content')
  })
})

describe('rendered articles', () => {
  test.each(routeCases)('renders the article and each navigation anchor at $path', async ({ headings, path }) => {
    const html = await renderArticle(path)
    expect(headings.filter(({ id }) => !html.includes(`id="${id}"`))).toStrictEqual([])
    expect(html).toContain('<h2')
  })

  test.each(exampleCases)('renders code blocks for the rule examples at $path', async ({ path }) => {
    const html = await renderArticle(path)
    expect(html.match(/data-code-block/gu)?.length).toBeGreaterThanOrEqual(2)
  })

  test.each(locales)('renders the shared language and function policies in %s', async (locale) => {
    const html = await renderArticle(localizedPath('/presets/typescript', locale))
    const policyText = [
      'eslint/no-undef',
      'TS2304',
      'eslint/sort-keys',
      'Class Variance Authority',
      'import/unambiguous',
      '**/*.d.ts',
      'declare module',
      'TS2307',
      'eslint/no-void',
      '{ allowAsStatement: true }',
      'return void save()',
      'namedComponents',
      'unnamedComponents',
    ]
    expect(policyText.filter((text) => !html.includes(text))).toStrictEqual([])
  })

  test.each(locales)('keeps the vendored rule source with the Effect reference in %s', async (locale) => {
    const html = await renderArticle(localizedPath('/presets/effect', locale))
    expect(html).toContain(effectRuleSource)
    expect(externalEffectRuleNames.every((name) => html.includes(`rules/${name}`))).toBe(true)
  })
})

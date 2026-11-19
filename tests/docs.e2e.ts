/* oxlint-disable rules/no-for-loops, eslint/no-await-in-loop -- Register parameterized browser tests and check requests serially to avoid overloading workerd. */
/* oxlint-disable eslint/no-magic-numbers, eslint/max-statements -- Keep expected HTTP status codes, inventory counts and browser interactions explicit. */
import { expect, test } from '@playwright/test'
// oxlint-disable-next-line import/no-relative-parent-imports -- Verify the shipped policy data against rendered documentation.
import { effectRuleSource, externalEffectRuleNames } from '../src/content/policies.ts'
// oxlint-disable-next-line import/no-relative-parent-imports -- Verify that each authored rule article has a working route.
import { ruleArticles } from '../src/content/rules.ts'

const redirects = new Map([
  ...[...externalEffectRuleNames, 'no-js-extension-imports'].map((name): [string, string] => [
    name,
    '/presets/effect#official-effect',
  ]),
  ['force-ts-extension', '/rules/consistent-import-extension'],
  ['no-error-cause-option', '/rules/no-optional-error-cause'],
  ['no-option-tag-comparison', '/rules/no-direct-tag-access'],
  ['no-raw-hono-create-middleware', '/#rules'],
])

for (const locale of ['en', 'ja'] as const) {
  test(`getting started shows the npm install route in ${locale}`, async ({ page }) => {
    await page.goto(`/${locale}/guide/getting-started`)
    const article = page.locator('article')
    await expect(article.locator('#install')).toBeVisible()
    await expect(article).toContainText('npm install --save-dev @totto2727/oxlint oxlint')
    await expect(article).toContainText('npm exec -- oxlint --config .oxlintrc.mjs src')
    await expect(article).not.toContainText('.tgz')
    await expect(article).not.toContainText('npm pack')
  })
  test(`all 36 local rule pages render the authored content and anchors in ${locale}`, async ({ request }) => {
    expect(ruleArticles).toHaveLength(36)
    for (const rule of ruleArticles) {
      const response = await request.get(`/${locale}/rules/${rule.name}`, { headers: { Accept: 'text/html' } })
      expect(response.status()).toBe(200)
      const body = await response.text()
      expect(body).toContain(`lang="${locale}"`)
      expect(body).toContain(`data-doc-page="/${locale}/rules/${rule.name}"`)
      for (const id of ['purpose', 'options', 'invalid', 'valid', 'fixes', 'source']) {
        expect(body).toContain(`id="${id}"`)
      }
      expect(body).toContain('data-code-block')
      expect(body).not.toContain('architecture-baseline')
    }
  })
  test(`Rules and Presets are separate in the actual ${locale} navigation`, async ({ page }) => {
    await page.goto(`/${locale}`)
    const sidebar = page.locator('[data-slot="sidebar-content"]')
    const rules = sidebar.getByRole('list', { exact: true, name: 'Rules' })
    const presets = sidebar.getByRole('list', { exact: true, name: 'Presets' })
    await expect(rules.getByRole('link')).toHaveCount(36)
    await expect(presets.getByRole('link')).toHaveCount(2)
    await expect(rules.getByRole('list', { exact: true, name: 'TypeScript' }).getByRole('link')).toHaveCount(11)
    await expect(rules.getByRole('list', { exact: true, name: 'Effect' }).getByRole('link')).toHaveCount(25)
    for (const name of externalEffectRuleNames) {
      await expect(sidebar.locator(`a[href="/${locale}/rules/${name}"]`)).toHaveCount(0)
    }
    await presets
      .getByRole('link', { exact: true, name: locale === 'en' ? 'Effect tracing' : 'Effect のトレース' })
      .click()
    await expect(page).toHaveURL(`/${locale}/presets/effect`)
    await expect(page.locator('#official-effect')).toHaveText(
      locale === 'en' ? 'Rules from Effect' : 'Effect 由来のルール',
    )
    const article = page.locator('article')
    await expect(article.locator(`a[href="${effectRuleSource}"]`)).toBeVisible()
    await expect(article).toContainText('MIT')
    await expect(article).toContainText('no-js-extension-imports')
    for (const name of externalEffectRuleNames) {
      await expect(article).toContainText(`rules/${name}`)
    }
    await expect(article.locator('#invalid, #valid, #options')).toHaveCount(0)
    await expect(article.locator('#included')).toHaveText(locale === 'en' ? 'Custom rules' : '独自ルール')
  })
}

for (const prefix of ['', '/en', '/ja']) {
  for (const accept of ['text/html', 'text/x-component']) {
    test(`retired articles redirect ${prefix || 'default locale'} ${accept}`, async ({ request }) => {
      for (const [name, target] of redirects) {
        for (const method of ['GET', 'HEAD']) {
          const response = await request.fetch(`${prefix}/rules/${name}?from=bookmark`, {
            headers: { Accept: accept },
            maxRedirects: 0,
            method,
          })
          expect(response.status()).toBe(308)
          const destination = new URL(target, 'https://oxlint.local')
          const path = destination.pathname === '/' ? prefix || '/' : `${prefix}${destination.pathname}`
          expect(response.headers()['location']).toBe(`${path}?from=bookmark${destination.hash}`)
          const body = await response.body()
          expect(body).toHaveLength(0)
        }
      }
    })
  }
}

test('retired URL navigation lands at external provenance instead of rule details', async ({ page, request }) => {
  await page.goto('/en/rules/no-js-extension-imports?from=bookmark')
  await expect(page).toHaveURL('/en/presets/effect?from=bookmark#official-effect')
  await expect(page.locator('#official-effect')).toBeVisible()
  for (const path of ['/en/rules/no-js-extension-imports-extra', '/en/rules/no-js-extension-imports/nested']) {
    const response = await request.get(path, { maxRedirects: 0 })
    expect(response.status()).toBe(404)
  }
  const post = await request.post('/en/rules/no-js-extension-imports', { maxRedirects: 0 })
  expect(post.status()).not.toBe(308)
})

test('preserves shell state across client navigation and switches article language', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/en')
  await expect(page.locator('h1')).toHaveText('Overview')
  await expect(page.locator('aside').first()).toBeVisible()
  const input = page.getByPlaceholder('Search guides')
  await expect(async () => {
    await input.fill('')
    await input.fill('extension')
    await expect(page.locator('[data-slot="sidebar-content"] a[href="/en/rules/no-let"]')).toHaveCount(0, {
      timeout: 300,
    })
  }).toPass({ timeout: 5000 })
  await page
    .locator('[data-slot="sidebar-content"] a')
    .filter({ hasText: /^require-import-extension$/u })
    .click()
  await expect(page.locator('h1')).toHaveText('require-import-extension')
  await expect(input).toHaveValue('extension')
  await expect(page.locator('#options')).toBeVisible()
  await page.getByRole('link', { exact: true, name: '日本語' }).click()
  await expect(page).toHaveURL('/ja/rules/require-import-extension')
  await expect(page.locator('#purpose')).toHaveText('目的と動作')
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja')
  expect(errors).toEqual([])
})

test('serves navigable articles without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/en/presets/typescript')
  await expect(page.locator('noscript a[href="/en/rules/no-let"]')).toBeVisible()
  await expect(page.locator('#baseline')).toHaveText('Oxlint rules')
  await expect(page.locator('article')).toContainText('They add Vitest rules only')
  await expect(page.locator('#included')).toBeVisible()
  await context.close()
})

test('keeps styles and mobile navigation usable', async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 })
  await page.goto('/en/rules/no-node-imports')
  await expect(page.locator('html')).toHaveClass('dark')
  await expect(page.locator('body')).toHaveCSS('background-color', 'oklch(0.19 0.012 75)')
  const mobileSearch = page.getByRole('dialog').getByPlaceholder('Search guides')
  await expect(async () => {
    if (!(await mobileSearch.isVisible())) {
      await page.getByRole('button', { name: 'Toggle Sidebar' }).click()
    }
    await expect(mobileSearch).toBeVisible({ timeout: 300 })
  }).toPass({ timeout: 5000 })
  await mobileSearch.fill('no-let')
  await page.getByRole('dialog').getByRole('link', { exact: true, name: 'no-let' }).click()
  await expect(page.locator('h1')).toHaveText('no-let')
})

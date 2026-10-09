import { expect, test } from '@playwright/test'
import { effectRuleSource, externalEffectRuleNames } from '../src/content/policies'
import { ruleArticles } from '../src/content/rules'

for (const locale of ['en', 'ja'] as const) {
  test(`getting started shows the npm install route in ${locale}`, async ({ page }) => {
    await page.goto(`/${locale}/guide/getting-started`)
    const article = page.locator('article')
    await expect(article.locator('#install')).toBeVisible()
    await expect(article).toContainText('npm install --save-dev @totto2727/oxlint oxlint')
    await expect(article).toContainText('npx oxlint --config .oxlintrc.mjs src')
    await expect(article).not.toContainText('.tgz')
    await expect(article).not.toContainText('npm pack')
  })
  test(`all 29 local rule pages render the authored content and anchors in ${locale}`, async ({ request }) => {
    expect(ruleArticles).toHaveLength(29)
    for (const rule of ruleArticles) {
      const response = await request.get(`/${locale}/rules/${rule.name}`, { headers: { Accept: 'text/html' } })
      expect(response.status()).toBe(200)
      const body = await response.text()
      expect(body).toContain(`lang="${locale}"`)
      expect(body).toContain(`data-doc-page="/${locale}/rules/${rule.name}"`)
      for (const id of ['purpose', 'options', 'invalid', 'valid', 'fixes', 'source'])
        expect(body).toContain(`id="${id}"`)
      expect(body).toContain('data-code-block')
      expect(body).not.toContain('architecture-baseline')
    }
  })
  test(`Rules and Presets are separate in the actual ${locale} navigation`, async ({ page }) => {
    await page.goto(`/${locale}`)
    const sidebar = page.locator('[data-slot="sidebar-content"]')
    const rules = sidebar.getByRole('list', { name: 'Rules', exact: true })
    const presets = sidebar.getByRole('list', { name: 'Presets', exact: true })
    await expect(rules.getByRole('link')).toHaveCount(29)
    await expect(presets.getByRole('link')).toHaveCount(2)
    await expect(rules.getByRole('list', { name: 'TypeScript', exact: true }).getByRole('link')).toHaveCount(9)
    await expect(rules.getByRole('list', { name: 'Effect', exact: true }).getByRole('link')).toHaveCount(20)
    for (const name of externalEffectRuleNames) {
      await expect(sidebar.locator(`a[href="/${locale}/rules/${name}"]`)).toHaveCount(0)
    }
    await presets.getByRole('link', { name: 'Effect', exact: true }).click()
    await expect(page).toHaveURL(`/${locale}/presets/effect`)
    await expect(page.locator('#official-effect')).toHaveText(
      locale === 'en' ? 'Official Effect policy layer' : '公式 Effect ポリシー層',
    )
    const article = page.locator('article')
    await expect(article.locator(`a[href="${effectRuleSource}"]`)).toBeVisible()
    await expect(article).toContainText('private')
    await expect(article).toContainText(locale === 'en' ? 'vendors MIT implementations' : 'MIT 実装を vendoring')
    await expect(article).toContainText(
      locale === 'en' ? 'explicitly off in every preset' : 'すべてのプリセットで明示的に off',
    )
    await expect(article).toContainText('mjs/cjs')
    await expect(article).toContainText('mode js')
    for (const name of externalEffectRuleNames) await expect(article).toContainText(`rules/${name}`)
    for (const name of ['unicorn/prefer-bigint-literals', 'preserve-caught-error', 'prefer-const']) {
      await expect(article).toContainText(name)
    }
    await expect(article.locator('#invalid, #valid, #options')).toHaveCount(0)
    await expect(article.locator('#included')).toHaveText(locale === 'en' ? 'Included local rules' : '収録独自ルール')
  })
}

for (const prefix of ['', '/en', '/ja']) {
  for (const accept of ['text/html', 'text/x-component']) {
    test(`retired external articles redirect ${prefix || 'default locale'} ${accept}`, async ({ request }) => {
      for (const name of externalEffectRuleNames) {
        for (const method of ['GET', 'HEAD']) {
          const response = await request.fetch(`${prefix}/rules/${name}?from=bookmark`, {
            method,
            headers: { Accept: accept },
            maxRedirects: 0,
          })
          expect(response.status()).toBe(308)
          expect(response.headers()['location']).toBe(`${prefix}/presets/effect?from=bookmark#official-effect`)
          expect(await response.body()).toHaveLength(0)
        }
      }
    })
  }
}

test('retired URL navigation lands at external provenance instead of rule details', async ({ page, request }) => {
  await page.goto('/en/rules/no-js-extension-imports?from=bookmark')
  await expect(page).toHaveURL('/en/presets/effect?from=bookmark#official-effect')
  await expect(page.locator('#official-effect')).toBeVisible()
  await expect(page.locator('h1')).toHaveText('Effect')
  for (const path of ['/en/rules/no-js-extension-imports-extra', '/en/rules/no-js-extension-imports/nested']) {
    expect((await request.get(path, { maxRedirects: 0 })).status()).toBe(404)
  }
  expect((await request.post('/en/rules/no-js-extension-imports', { maxRedirects: 0 })).status()).not.toBe(308)
})

test('preserves shell state across client navigation and switches article language', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/en')
  await expect(page.locator('h1')).toHaveText('Overview')
  await expect(page.locator('aside').first()).toBeVisible()
  const input = page.getByPlaceholder('Search guides')
  await input.fill('extension')
  await page
    .locator('[data-slot="sidebar-content"] a')
    .filter({ hasText: /^require-import-extension$/ })
    .click()
  await expect(page.locator('h1')).toHaveText('require-import-extension')
  await expect(input).toHaveValue('extension')
  await expect(page.locator('#options')).toBeVisible()
  await page.getByRole('link', { name: '日本語', exact: true }).click()
  await expect(page).toHaveURL('/ja/rules/require-import-extension')
  await expect(page.locator('#purpose')).toHaveText('目的と動作')
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja')
  expect(errors).toEqual([])
})

test('serves navigable articles without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('http://127.0.0.1:4394/en/presets/typescript')
  await expect(page.locator('h1')).toHaveText('TypeScript')
  await expect(page.locator('noscript a[href="/en/rules/no-let"]')).toBeVisible()
  await expect(page.locator('#baseline')).toHaveText('Shared native baseline')
  await expect(page.locator('article')).toContainText('Ultracite 7.12.3')
  await expect(page.locator('article')).toContainText('Tests and application sources use the same rules')
  await expect(page.locator('#included')).toBeVisible()
  await context.close()
})

test('keeps styles and mobile navigation usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/en/rules/no-node-imports')
  await expect(page.locator('html')).toHaveClass('dark')
  await expect(page.locator('body')).toHaveCSS('background-color', 'oklch(0.19 0.012 75)')
  await page.getByRole('button', { name: 'Toggle Sidebar' }).click()
  await expect(page.getByPlaceholder('Search guides').last()).toBeVisible()
  await page.getByPlaceholder('Search guides').last().fill('no-let')
  await page.getByRole('link', { name: 'no-let', exact: true }).last().click()
  await expect(page.locator('h1')).toHaveText('no-let')
})

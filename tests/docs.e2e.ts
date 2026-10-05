import { expect, test } from '@playwright/test'
import { ruleArticles } from '../src/content/rules'

for (const locale of ['en', 'ja'] as const) {
  test(`all 34 rule pages render the authored content and anchors in ${locale}`, async ({ request }) => {
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
}

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
  await expect(page.locator('article')).toContainText('Tests receive the same rules as application sources')
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

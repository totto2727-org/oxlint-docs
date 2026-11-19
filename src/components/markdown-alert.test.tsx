import { MarkdownDocument } from '@comark/react/components/MarkdownDocument'
import { createMarkdownCollection, parseMarkdown } from '@effront/markdown'
import { Effect } from 'effect'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, test } from 'vite-plus/test'
import { markdownAlertComponents } from './markdown-alert.tsx'

const render = async (markdown: string): Promise<string> => {
  const parse = Effect.gen(function* () {
    const collection = yield* createMarkdownCollection({ basePath: '/', documents: { './alert.md': markdown } })
    const entry = collection.get('/alert')
    if (!entry) {
      // oxlint-disable-next-line rules/require-tagged-error -- A missing fixture is a test setup defect, not an application error.
      throw new TypeError('Alert fixture is missing')
    }
    return yield* parseMarkdown(entry)
  })
  // oxlint-disable-next-line rules/no-effect-runtime-run -- Each case executes the real Markdown workflow at its test boundary.
  const document = await Effect.runPromise(parse)
  return renderToStaticMarkup(<MarkdownDocument value={document} components={markdownAlertComponents} />)
}

describe('markdown alerts', () => {
  test.each(['Note', 'Tip', 'Important', 'Warning', 'Caution'])(
    '%s uses the standard Comark marker and renders a named icon callout',
    async (title) => {
      expect.hasAssertions()
      const html = await render(`> [!${title.toUpperCase()}]\n> Keep this **important content**.`)
      const fragments = [
        `data-alert="${title.toLowerCase()}"`,
        `aria-label="${title}"`,
        `</svg>${title}</p>`,
        'aria-hidden="true"',
        '<strong>important content</strong>',
      ]
      fragments.forEach((fragment) => {
        expect(html).toContain(fragment)
      })
      expect(html).not.toContain(`[!${title.toUpperCase()}]`)
    },
  )

  test('leaves ordinary quotations unchanged', async () => {
    const html = await render('> This is an ordinary quotation.')
    expect(html).toContain('<blockquote>')
    expect(html).not.toContain('docs-alert')
    expect(html).not.toContain('<svg')
  })

  test('does not invent an unsupported error alert type', async () => {
    const html = await render('> [!ERROR]\n> An unsupported marker.')
    expect(html).toContain('<blockquote>')
    expect(html).not.toContain('docs-alert')
  })
})

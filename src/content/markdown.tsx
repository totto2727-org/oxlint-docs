import { createMarkdownCollection, parseMarkdown } from '@effront/markdown'
import { MarkdownDocument } from '@effront/markdown/document'
import type { MarkdownDocumentProps } from '@effront/markdown/document'
import { Data, Effect, Predicate } from 'effect'
import type { ComponentProps, ReactElement } from 'react'
// oxlint-disable-next-line import/no-relative-parent-imports -- The Markdown renderer adapts a shared application component.
import { markdownAlertComponents } from '../components/markdown-alert.tsx'
import { articleCatalog } from './catalog.ts'
import { documents } from './documents.ts'
import { englishArticleCatalog } from './en/catalog.ts'
import type { DocLocale } from './locale.ts'
import { localizedPath, localizeDocumentLink } from './locale.ts'
import type { RenderableDocPage } from './types.ts'

class MissingArticle extends Data.TaggedError('MissingArticle')<{ message: string }> {}

type Components = NonNullable<MarkdownDocumentProps['components']>

const collection = (locale: DocLocale, basePath: string): ReturnType<typeof createMarkdownCollection> => {
  const entries = Object.entries(documents(locale)).map(([key, value]) => [`./${key}`, value] as const)
  return createMarkdownCollection({ basePath, documents: Object.fromEntries(entries) })
}

const japaneseArticles = collection('ja', '/')
const englishArticles = collection('en', '/en')

const pre = ({ children, className, language }: ComponentProps<'pre'> & { language?: string }): ReactElement => (
  // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- A keyboard user must be able to focus and scroll long code examples.
  <pre className={className} data-code-block='' data-language={language ?? 'text'} tabIndex={0}>
    {children}
  </pre>
)

const makeComponents = (locale?: DocLocale): Components => {
  if (Predicate.isNullish(locale)) {
    return { ...markdownAlertComponents, ProsePre: pre }
  }
  const link = ({ children, href, ...props }: ComponentProps<'a'>): ReactElement => (
    // oxlint-disable-next-line react/jsx-props-no-spreading -- Preserve attributes provided by the Markdown rendering contract.
    <a {...props} href={localizeDocumentLink(href, locale)}>
      {children}
    </a>
  )
  return { ...markdownAlertComponents, ProseA: link, ProsePre: pre }
}

const defaultComponents = makeComponents()
const enComponents = makeComponents('en')
const jaComponents = makeComponents('ja')

const renderContent = (
  source: string,
  articles: ReturnType<typeof collection>,
  components: Components,
): ReturnType<RenderableDocPage['content']> =>
  Effect.gen(function* () {
    const entries = yield* articles
    const entry = entries.get(source)
    if (Predicate.isNullish(entry)) {
      throw new MissingArticle({ message: `Documentation article is missing: ${source.replace(/^\//u, '')}` })
    }
    const document = yield* parseMarkdown(entry)
    // oxlint-disable-next-line react/forbid-component-props -- Effront's MarkdownDocument wraps prose with its documented className prop.
    return <MarkdownDocument className='docs-markdown' components={components} value={document} />
  })

export const markdownPages = articleCatalog.map(
  ({ description, group, headings, section, slug, source, title }): RenderableDocPage => ({
    content: () => renderContent(source, japaneseArticles, defaultComponents),
    description,
    group,
    headings,
    section,
    slug,
    title,
  }),
)

export const localizedMarkdownPages = (locale: DocLocale): RenderableDocPage[] => {
  const english = locale === 'en'
  const catalog = english ? englishArticleCatalog : articleCatalog
  const articles = english ? englishArticles : japaneseArticles
  const components = english ? enComponents : jaComponents
  return catalog.map(({ description, group, headings, section, slug, source, title }): RenderableDocPage => ({
    content: () => renderContent(`${english ? '/en' : ''}${source}`, articles, components),
    description,
    group,
    headings,
    section,
    slug: localizedPath(slug, locale),
    title,
  }))
}

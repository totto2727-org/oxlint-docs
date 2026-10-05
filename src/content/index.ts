import { markdownPages, localizedMarkdownPages } from './markdown'
import type { DocLocale } from './locale'
import type { RenderableDocPage } from './types'

export const pages = markdownPages
export const localizedPages = (['ja', 'en'] as const).flatMap(localizedMarkdownPages)
const pageNavigation = (items: readonly RenderableDocPage[]) =>
  items.map(({ slug, title, section, group }) => ({ slug, title, section, ...(group ? { group } : {}) }))
export const navigation = pageNavigation(pages)
export const localizedNavigation = (locale: DocLocale) =>
  pageNavigation(localizedPages.filter((page) => page.slug === `/${locale}` || page.slug.startsWith(`/${locale}/`)))
export function getPage(slug: string): RenderableDocPage {
  const canonical = slug.replace(/\/+$/, '') || '/'
  const page = [...pages, ...localizedPages].find((candidate) => candidate.slug === canonical)
  if (!page) throw new TypeError(`Documentation route is missing content: ${slug}`)
  return page
}

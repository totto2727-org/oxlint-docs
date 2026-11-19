import { Data, Predicate } from 'effect'
import type { DocLocale } from './locale.ts'
import { localizedMarkdownPages, markdownPages } from './markdown.tsx'
import type { RenderableDocPage } from './types.ts'

type NavigationItem = Pick<RenderableDocPage, 'group' | 'section' | 'slug' | 'title'>

class MissingPage extends Data.TaggedError('MissingPage')<{ message: string }> {}

export const localizedPages = (['ja', 'en'] as const).flatMap((locale) => localizedMarkdownPages(locale))

export const navigationItem = ({ group, section, slug, title }: RenderableDocPage): NavigationItem => ({
  group,
  section,
  slug,
  title,
})

export const navigation = markdownPages.map((page) => navigationItem(page))
export const localizedNavigation = (locale: DocLocale): NavigationItem[] =>
  localizedPages
    .filter((page) => page.slug === `/${locale}` || page.slug.startsWith(`/${locale}/`))
    .map((page) => navigationItem(page))

export const getPage = (slug: string): RenderableDocPage => {
  const canonical = slug.replace(/\/+$/u, '') || '/'
  const page = [...markdownPages, ...localizedPages].find((candidate) => candidate.slug === canonical)
  if (Predicate.isNullish(page)) {
    throw new MissingPage({ message: `Documentation route is missing content: ${slug}` })
  }
  return page
}

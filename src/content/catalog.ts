import type { DocLocale } from './locale.ts'
import { ruleArticles, ruleHeadings } from './rules.ts'
import type { DocPage } from './types.ts'

export type ArticleMetadata = DocPage & { source: string }

type Translation = Record<DocLocale, string>
interface StaticArticle {
  description: Translation
  headings: (Translation & { id: string })[]
  section: DocPage['section']
  slug: string
  title: Translation
}

const articles: StaticArticle[] = [
  {
    description: {
      en: 'Choose a lint preset for TypeScript and Effect.',
      ja: 'TypeScript と Effect のリントプリセットを選びます。',
    },
    headings: [
      { en: 'Choose a preset', id: 'choose', ja: 'プリセットを選ぶ' },
      { en: 'Rule reference', id: 'rules', ja: 'ルールリファレンス' },
    ],
    section: 'Getting started',
    slug: '/',
    title: { en: 'Overview', ja: '概要' },
  },
  {
    description: { en: 'Install and run the Oxlint preset.', ja: 'Oxlint のプリセットをインストールして実行します。' },
    headings: [
      { en: 'Install', id: 'install', ja: 'インストール' },
      { en: 'Configure', id: 'configure', ja: '設定' },
      { en: 'Run and review', id: 'run', ja: '実行と確認' },
    ],
    section: 'Getting started',
    slug: '/guide/getting-started',
    title: { en: 'Getting started', ja: 'はじめに' },
  },
  {
    description: {
      en: 'See the lint settings that all three presets use.',
      ja: '全プリセットで共通のリント設定を確認します。',
    },
    headings: [
      { en: 'Usage', id: 'usage', ja: '使い方' },
      { en: 'Oxlint rules', id: 'baseline', ja: 'Oxlint のルール' },
      { en: 'Function style', id: 'function-style', ja: '関数形式' },
      { en: 'Custom rules', id: 'included', ja: '独自ルール' },
      { en: 'Exceptions', id: 'exceptions', ja: '例外' },
    ],
    section: 'Presets',
    slug: '/presets/typescript',
    title: { en: 'Shared rules', ja: '共通ルール' },
  },
  {
    description: {
      en: 'Set the tracing policy for your application or library.',
      ja: 'アプリケーションやライブラリのトレース方針を設定します。',
    },
    headings: [
      { en: 'Usage', id: 'usage', ja: '使い方' },
      { en: 'Tracing modes', id: 'baseline', ja: 'トレースモード' },
      { en: 'Custom rules', id: 'included', ja: '独自ルール' },
      { en: 'Rules from Effect', id: 'official-effect', ja: 'Effect 由来のルール' },
      { en: 'Exceptions', id: 'exceptions', ja: '例外' },
    ],
    section: 'Presets',
    slug: '/presets/effect',
    title: { en: 'Effect tracing', ja: 'Effect のトレース' },
  },
]

export const catalog = (locale: DocLocale): ArticleMetadata[] => [
  ...articles.map(({ description, headings, section, slug, title }): ArticleMetadata => ({
    description: description[locale],
    headings: headings.map((heading) => ({ id: heading.id, title: heading[locale] })),
    section,
    slug,
    source: slug === '/' ? '/index' : slug,
    title: title[locale],
  })),
  ...ruleArticles.map(({ group, name, purpose }): ArticleMetadata => {
    const [english, japanese] = purpose
    const path = `/rules/${name}`
    return {
      description: locale === 'en' ? english : japanese,
      group,
      headings: ruleHeadings(locale),
      section: 'Rules',
      slug: path,
      source: path,
      title: name,
    }
  }),
]

export const articleCatalog = catalog('ja')

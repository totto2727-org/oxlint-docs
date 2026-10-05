import { ruleArticles, ruleHeadings } from './rules'
import type { DocLocale } from './locale'
import type { DocPage } from './types'

export interface ArticleMetadata extends Omit<DocPage, 'content'> {
  readonly source: string
}

export function catalog(locale: DocLocale): readonly ArticleMetadata[] {
  const english = locale === 'en'
  return [
    {
      slug: '/',
      source: '/index',
      title: english ? 'Overview' : '概要',
      description: english
        ? '34 focused lint rules for TypeScript and Effect.'
        : 'TypeScript と Effect のための34のルール。',
      section: 'Getting started',
      headings: [
        { id: 'choose', title: english ? 'Choose your policy' : 'ポリシーを選ぶ' },
        { id: 'rules', title: english ? 'Rule reference' : 'ルールリファレンス' },
      ],
    },
    {
      slug: '/guide/getting-started',
      source: '/guide/getting-started',
      title: english ? 'Getting started' : 'はじめに',
      description: english
        ? 'Install the plugin, select a preset and run Oxlint.'
        : 'プラグインを導入し、プリセットを選んで Oxlint を実行します。',
      section: 'Getting started',
      headings: [
        { id: 'install', title: english ? 'Install' : 'インストール' },
        { id: 'configure', title: english ? 'Configure' : '設定' },
        { id: 'run', title: english ? 'Run and review' : '実行と確認' },
      ],
    },
    ...(['typescript', 'effect'] as const).map((group) => ({
      slug: `/presets/${group}`,
      source: `/presets/${group}`,
      title: group === 'typescript' ? 'TypeScript' : 'Effect',
      description: english
        ? group === 'typescript'
          ? 'Generic TypeScript policy with 8 rules.'
          : 'Effect-oriented policy with 22 rules.'
        : group === 'typescript'
          ? '汎用 TypeScript 向けの8ルール。'
          : 'Effect 向けの22ルール。',
      section: 'Presets' as const,
      headings: [
        { id: 'usage', title: english ? 'Usage' : '使い方' },
        { id: 'included', title: english ? 'Included rules' : '収録ルール' },
        { id: 'exceptions', title: english ? 'Exceptions' : '例外' },
      ],
    })),
    ...ruleArticles.map((rule) => ({
      slug: `/rules/${rule.name}`,
      source: `/rules/${rule.name}`,
      title: rule.name,
      description: rule.purpose[english ? 0 : 1],
      section: 'Rules' as const,
      group: rule.group,
      headings: ruleHeadings(locale),
    })),
  ]
}
export const articleCatalog = catalog('ja')

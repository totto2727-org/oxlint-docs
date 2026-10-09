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
        ? '29 local rules. See Presets for external policies.'
        : '29の独自ルール。外部ポリシーは Presets を参照。',
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
          ? '8 local TypeScript rules and the shared native baseline.'
          : '18 local Effect rules, 4 official rules and the shared native baseline.'
        : group === 'typescript'
          ? '8つの独自 TypeScript ルールと共通 native baseline。'
          : '18の独自 Effect ルール、4つの公式ルール、共通 native baseline。',
      section: 'Presets' as const,
      headings: [
        { id: 'usage', title: english ? 'Usage' : '使い方' },
        { id: 'baseline', title: english ? 'Shared native baseline' : '共通 native baseline' },
        { id: 'included', title: english ? 'Included local rules' : '収録独自ルール' },
        ...(group === 'effect'
          ? [{ id: 'official-effect', title: english ? 'Official Effect policy layer' : '公式 Effect ポリシー層' }]
          : []),
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

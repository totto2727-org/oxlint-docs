import type { DocLocale } from './locale'
import { effectRuleSource, externalEffectRuleNames } from './policies'
import { ruleArticles, ruleMarkdown } from './rules'

const code = (language: string, text: string) => `\`\`\`${language}\n${text}\n\`\`\``

export function documents(locale: DocLocale): Record<string, string> {
  const en = locale === 'en'
  const result: Record<string, string> = Object.fromEntries(
    ruleArticles.map((rule) => [`rules/${rule.name}.md`, ruleMarkdown(rule, locale)]),
  )
  const links = (group: 'TypeScript' | 'Effect', includeOptIn = false) =>
    ruleArticles
      .filter((rule) => rule.group === group && (includeOptIn || !rule.optIn))
      .map((rule) => `- [${rule.name}](/rules/${rule.name}): ${rule.purpose[en ? 0 : 1]}`)
      .join('\n')
  result['index.md'] = en
    ? `## Choose your policy {#choose}

@totto2727/oxlint is an Oxlint JavaScript plugin for TypeScript and Effect policies.
Choose a preset:

- [TypeScript](/presets/typescript): 8 local rules.
- [Effect](/presets/effect): 18 local rules and 4 official Effect rules.
- @totto2727/oxlint/preset: both groups.

All presets include the native Ultracite 7.12.3 core baseline.
Follow [Getting started](/guide/getting-started) to install and configure the plugin.

> [!NOTE]
> These rules check syntax, not type safety. Check each rule’s scope before enabling it.

## Rule reference {#rules}

Rules covers 29 locally authored rules: 26 preset rules and 3 opt-in compatibility rules.
The plugin exports 34 rules, including 5 external Effect adapters.
Native Ultracite rules are separate from these exports.
Presets covers external sources, included rules and disabled settings, without external rule detail pages.

The presets omit these local compatibility rules:

- [force-ts-extension](/rules/force-ts-extension): duplicates the two extension rules.
- [no-effect-import-as](/rules/no-effect-import-as) and [no-effect-subpath-import](/rules/no-effect-subpath-import): conflict with the [official Effect import policy](/presets/effect#official-effect).

### TypeScript

${links('TypeScript', true)}

### Effect

${links('Effect', true)}`
    : `## ポリシーを選ぶ {#choose}

@totto2727/oxlint は TypeScript と Effect のポリシーを提供する Oxlint JavaScript プラグインです。
プリセットを選んでください。

- [TypeScript](/presets/typescript): 8つの独自ルール。
- [Effect](/presets/effect): 18の独自ルールと4つの公式 Effect ルール。
- @totto2727/oxlint/preset: 両グループ。

全プリセットが native Ultracite 7.12.3 core baseline を含みます。
導入と設定は[はじめに](/guide/getting-started)を参照してください。

> [!NOTE]
> 構文を検査するルールであり、型安全性は証明しません。有効化する前に各ルールの対象範囲を確認してください。

## ルールリファレンス {#rules}

Rules は26のプリセットルールと3つの opt-in 互換ルール、計29の独自ルールを解説します。
プラグインは外部 Effect アダプター5つを含む34ルールを公開します。
native Ultracite ルールは、この公開ルールとは別です。
Presets は外部の出典、収録ルール、無効設定を説明します。外部ルールの詳細ページはありません。

次の独自互換ルールはプリセットに含みません。

- [force-ts-extension](/rules/force-ts-extension): 2つの拡張子ルールと重複します。
- [no-effect-import-as](/rules/no-effect-import-as) と [no-effect-subpath-import](/rules/no-effect-subpath-import): [公式 Effect import ポリシー](/presets/effect#official-effect)と競合します。

### TypeScript

${links('TypeScript', true)}

### Effect

${links('Effect', true)}`
  const manual = code(
    'json',
    '{\n  "jsPlugins": ["@totto2727/oxlint"],\n  "rules": {\n    "rules/require-import-extension": "error",\n    "rules/consistent-import-extension": ["error", { "mode": "ts" }]\n  }\n}',
  )
  const install = code(
    'sh',
    '# Before publication, install a supplied package archive:\nnpm install --save-dev ./totto2727-oxlint-0.1.0.tgz oxlint\n# After npm publication:\nnpm install --save-dev @totto2727/oxlint oxlint',
  )
  const preset = code(
    'js',
    "import { defineConfig } from 'oxlint'\nimport typescript from '@totto2727/oxlint/typescript'\n\nexport default defineConfig({ extends: [typescript] })",
  )
  result['guide/getting-started.md'] = en
    ? `## Install {#install}

Use Node.js 24 or later.
Install the plugin and Oxlint in your TypeScript project.
Use a supplied npm pack archive until the package is available on npm.
Do not substitute workspace paths.

${install}

## Configure {#configure}

Create an ESM .oxlintrc.mjs with a preset:

${preset}

Use @totto2727/oxlint/effect for Effect, or @totto2727/oxlint/preset for both groups.
Presets include the [native Ultracite baseline](/presets/typescript#baseline) and run directly with Oxlint.
You do not need the Ultracite CLI or another Ultracite preset.
React, type-aware rules, Ultracite JavaScript plugins and oxfmt integration require separate configuration.

To select individual rules, use .oxlintrc.json instead.
This configuration does not include the native baseline:

${manual}

The default plugin uses the rules/ namespace.
The named exports typescriptRuleNames, effectRuleNames and compatibilityRuleNames list each group’s rules.
Use mode js for emitted JavaScript imports.
Use mode ts for TypeScript source execution.
The rules do not infer missing extensions.
Do not combine force-ts-extension with require-import-extension and consistent-import-extension.

## Run and review {#run}

Run the preset configuration:

${code('sh', 'npx oxlint --config .oxlintrc.mjs src\nnpx oxlint --config .oxlintrc.mjs --fix src')}

Replace src with your source directory if needed.
For individual rules, use --config .oxlintrc.json instead.
Review diagnostics and fixes before committing.
Only rules with automatic fixes change code.
Preset rules apply to tests and application sources, without test-only exemptions.
For a necessary boundary exception, use oxlint-disable-next-line with -- and a specific reason.
See the [TypeScript preset](/presets/typescript), [Effect preset](/presets/effect) and [Oxlint configuration reference](https://oxc.rs/docs/guide/usage/linter/config.html).`
    : `## インストール {#install}

Node.js 24 以降を使ってください。
TypeScript プロジェクトにプラグインと Oxlint を導入します。
npm で利用可能になるまでは、配布された npm pack アーカイブを使ってください。
workspace パスで代用しないでください。

${install}

## 設定 {#configure}

ESM の .oxlintrc.mjs にプリセットを設定します。

${preset}

Effect には @totto2727/oxlint/effect、両グループには @totto2727/oxlint/preset を使います。
プリセットは [native Ultracite baseline](/presets/typescript#baseline) を含み、Oxlint で直接実行します。
Ultracite CLI や別の Ultracite プリセットは不要です。
React、type-aware ルール、Ultracite JavaScript plugins、oxfmt 統合は別途設定してください。

ルールを個別に選ぶ場合は .oxlintrc.json を使います。
この設定は native baseline を含みません。

${manual}

default export のプラグインは rules/ 名前空間を使います。
名前付き export の typescriptRuleNames、effectRuleNames、compatibilityRuleNames は各グループのルール一覧です。
JavaScript 出力の import には mode js、TypeScript ソース実行には mode ts を使います。
欠けた拡張子は推測しません。
force-ts-extension を require-import-extension と consistent-import-extension に併用しないでください。

## 実行と確認 {#run}

プリセットの設定を実行します。

${code('sh', 'npx oxlint --config .oxlintrc.mjs src\nnpx oxlint --config .oxlintrc.mjs --fix src')}

必要なら src をソースディレクトリに置き換えてください。
個別ルールの設定には --config .oxlintrc.json を使ってください。
コミット前に診断と修正を確認してください。
自動修正のあるルールだけがコードを変更します。
プリセットはテストとアプリケーションに同じルールを適用し、テスト専用の免除はありません。
必要な境界例外には、-- と具体的な理由を付けた oxlint-disable-next-line を使います。
[TypeScript プリセット](/presets/typescript)、[Effect プリセット](/presets/effect)、[Oxlint 設定リファレンス](https://oxc.rs/docs/guide/usage/linter/config.html)を参照してください。`
  for (const group of ['TypeScript', 'Effect'] as const) {
    const subpath = group.toLowerCase()
    const usage = code(
      'ts',
      `import { defineConfig } from 'oxlint'\nimport ${subpath} from '@totto2727/oxlint/${subpath}'\n\nexport default defineConfig({ extends: [${subpath}] })`,
    )
    const baseline = en
      ? `## Shared native baseline {#baseline}

All presets include a pinned MIT port of [Ultracite 7.12.3](https://www.npmjs.com/package/ultracite/v/7.12.3) native core and shared ignores.
This baseline corresponds to \`ultracite/oxlint/core\`.
Run Oxlint directly, without the full Ultracite CLI.
Sources: [native core configuration](https://github.com/haydenbleasel/ultracite/blob/48156546701badf2c6e60f25cf1e8511f7dc44c7/packages/cli/config/oxlint/core/index.mjs) and [Oxlint provider documentation](https://github.com/haydenbleasel/ultracite/blob/48156546701badf2c6e60f25cf1e8511f7dc44c7/apps/docs/docs/provider/oxlint.mdx).

All presets disable these native rules:

- \`unicorn/prefer-bigint-literals\`: conflicts with the official Effect no-bigint-literals policy.
- \`preserve-caught-error\`: requires native Error.cause instead of the local error field convention.
- \`prefer-const\`: duplicates the broader local no-let rule.

Tests and application sources use the same rules.
Presets exclude upstream per-file overrides and test-only exemptions.
TypeScript and combined presets allow no-redundant-alias in **/*.gen.ts files.
React and type-aware presets, JavaScript plugins and oxfmt integration require separate configuration.`
      : `## 共通 native baseline {#baseline}

全プリセットが [Ultracite 7.12.3](https://www.npmjs.com/package/ultracite/v/7.12.3) native core と共通 ignore の MIT 固定移植を含みます。
この baseline は \`ultracite/oxlint/core\` に対応します。
Ultracite CLI 全体は使わず、Oxlint を直接実行してください。
出典: [native core 設定](https://github.com/haydenbleasel/ultracite/blob/48156546701badf2c6e60f25cf1e8511f7dc44c7/packages/cli/config/oxlint/core/index.mjs) と [Oxlint provider ドキュメント](https://github.com/haydenbleasel/ultracite/blob/48156546701badf2c6e60f25cf1e8511f7dc44c7/apps/docs/docs/provider/oxlint.mdx)。

全プリセットで次の native ルールを無効にします。

- \`unicorn/prefer-bigint-literals\`: 公式 Effect no-bigint-literals と競合します。
- \`preserve-caught-error\`: 独自の error フィールドではなく native Error.cause を要求します。
- \`prefer-const\`: より広い独自の no-let と重複します。

テストとアプリケーションに同じルールを適用します。
上流のファイル別 override とテスト専用の免除は含みません。
TypeScript と統合プリセットは **/*.gen.ts の no-redundant-alias を許可します。
React・type-aware プリセット、JavaScript plugins、oxfmt 統合は別途設定してください。`
    const officialRules = externalEffectRuleNames
      .filter((name) => name !== 'no-js-extension-imports')
      .map((name) => `- \`rules/${name}\``)
      .join('\n')
    const officialEffect =
      group !== 'Effect'
        ? ''
        : en
          ? `## Official Effect policy layer {#official-effect}

The Effect preset enables four rules from the [official Effect Oxc sources](${effectRuleSource}).
The upstream tools package is private.
The library vendors MIT implementations in its rules/ namespace.
It does not install an external npm plugin or include the full upstream native configuration.
These rules use error severity:

${officialRules}

\`rules/no-js-extension-imports\` is exported but explicitly off in every preset.
It duplicates the local extension rules, including mjs/cjs handling.
Its TypeScript-only conversion conflicts with mode js.
Use require-import-extension and consistent-import-extension instead.`
          : `## 公式 Effect ポリシー層 {#official-effect}

Effect プリセットは[公式 Effect Oxc ソース](${effectRuleSource})の4ルールを有効にします。
上流の tools パッケージは private です。
ライブラリは MIT 実装を vendoring し、rules/ 名前空間に配置します。
外部 npm プラグインや上流の native 設定全体は取り込みません。
次のルールを error として使います。

${officialRules}

\`rules/no-js-extension-imports\` は公開しますが、すべてのプリセットで明示的に off です。
mjs/cjs を含む独自の拡張子ルールと重複します。
TypeScript への変換だけを行うため、mode js と競合します。
代わりに require-import-extension と consistent-import-extension を使ってください。`
    const exceptions =
      group === 'TypeScript'
        ? en
          ? 'The preset omits force-ts-extension to avoid duplicate reports. Extension normalization defaults to ts. Set mode js for JavaScript imports.'
          : '重複報告を避けるため force-ts-extension は含みません。拡張子の統一は既定で ts です。JavaScript import には mode js を設定してください。'
        : en
          ? 'no-effect-import-as and no-effect-subpath-import are opt-in because they conflict with the official Effect module namespace policy. The no-node-imports allowlist contains child_process, crypto, os and util. Override the rule to allow other node: names.'
          : 'no-effect-import-as と no-effect-subpath-import は公式 Effect モジュール名前空間ポリシーと競合するため opt-in です。no-node-imports は child_process、crypto、os、util を許可します。他の node: 名にはルールを上書きしてください。'
    result[`presets/${subpath}.md`] =
      `${en ? '## Usage' : '## 使い方'} {#usage}\n\n${usage}\n\n${en ? 'The preset registers the plugin and enables the local rules below at error severity. Use @totto2727/oxlint/preset for both groups.' : 'プリセットはプラグインを登録し、以下の独自ルールを error で有効にします。両グループには @totto2727/oxlint/preset を使ってください。'}\n\n${baseline}\n\n${en ? '## Included local rules' : '## 収録独自ルール'} {#included}\n\n${links(group)}\n\n${officialEffect}\n\n${en ? '## Exceptions' : '## 例外'} {#exceptions}\n\n${exceptions}\n\n${en ? 'Keep additional exceptions narrow and give specific reasons.' : '追加の例外は範囲を絞り、具体的な理由を付けてください。'}`
  }
  return result
}

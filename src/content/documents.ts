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

@totto2727/oxlint supplies an Oxlint JavaScript plugin for generic TypeScript conventions and Effect-oriented application policies.
Use the [TypeScript preset](/presets/typescript) for 8 local rules, the [Effect preset](/presets/effect) for 18 local rules plus 4 official Effect rules, or the combined package preset for both.
Rules documents locally authored policies only. Presets documents external policy sources and the reasons for disabling conflicting or overlapping settings.
Both groups share the externally defined native Ultracite 7.12.3 core baseline.
[Getting started](/guide/getting-started) walks through installation and configuration.

> [!NOTE]
> These rules are opinionated syntax checks, not type-level proofs. Review each rule's scope before enabling it.

## Rule reference {#rules}

There are 29 locally authored rule pages: 26 preset rules and 3 opt-in compatibility policies. The plugin still exports 34 rules, including 5 externally authored Effect adapters. Native Ultracite core rules are additional policy, not part of the plugin's 34 exports.
[force-ts-extension](/rules/force-ts-extension) overlaps the split extension rules.
[no-effect-import-as](/rules/no-effect-import-as) and [no-effect-subpath-import](/rules/no-effect-subpath-import) impose the opposite import convention to the official Effect barrel policy. These three local compatibility rules remain available but are not enabled by presets.
The externally derived rules have no local detail pages. See the [official Effect policy layer](/presets/effect#official-effect) for its source, inclusions and disabled-rule reason.

### TypeScript

${links('TypeScript', true)}

### Effect

${links('Effect', true)}`
    : `## ポリシーを選ぶ {#choose}

@totto2727/oxlint は、汎用 TypeScript の規約と Effect アプリケーションのポリシーを提供する Oxlint JavaScript プラグインです。
[TypeScript プリセット](/presets/typescript) は8つの独自ルール、[Effect プリセット](/presets/effect) は18の独自ルールと4つの公式 Effect ルールを含みます。両方を使う場合は統合プリセットを選びます。
Rules では独自に定義したポリシーだけを詳しく説明します。Presets では外部ポリシーの出典と、競合・重複する設定を無効化する理由を説明します。
両グループは外部定義の native Ultracite 7.12.3 core baseline を共有します。
導入手順は[はじめに](/guide/getting-started)をご覧ください。

> [!NOTE]
> これらは意見を持った構文検査であり、型による証明ではありません。有効化する前に各ルールの対象範囲を確認してください。

## ルールリファレンス {#rules}

26のプリセットルールと3つの opt-in 互換ポリシー、合計29の独自ルールを詳しく解説します。プラグインの公開 API は外部定義の Effect アダプター5つを含めた34ルールのままです。native Ultracite core は追加のポリシーであり、34の export には含みません。
[force-ts-extension](/rules/force-ts-extension) は分割された拡張子ルールと重複します。
[no-effect-import-as](/rules/no-effect-import-as) と [no-effect-subpath-import](/rules/no-effect-subpath-import) は公式 Effect barrel ポリシーと逆の import 規約です。この3つの独自互換ルールは利用可能ですが、プリセットでは有効化しません。
外部由来のルールに独自の詳細ページはありません。出典、収録ルール、無効化の理由は[公式 Effect ポリシー層](/presets/effect#official-effect)をご覧ください。

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
    '# Before publication, install a supplied package archive:\nnpm install --save-dev ./totto2727-oxlint-0.0.0.tgz oxlint\n# After npm publication:\nnpm install --save-dev @totto2727/oxlint oxlint',
  )
  const preset = code(
    'ts',
    "import { defineConfig } from 'oxlint'\nimport typescript from '@totto2727/oxlint/typescript'\n\nexport default defineConfig({ extends: [typescript] })",
  )
  result['guide/getting-started.md'] = en
    ? `## Install {#install}

Install the package and Oxlint in your TypeScript project. The package targets Node.js 24 or later.
The npm release workflow is enabled, but the first owner publication and Trusted Publisher setup are pending. Until the package is actually available in the registry, use a supplied npm pack archive. Do not substitute workspace paths.

${install}

## Configure {#configure}

Create an ESM oxlint.config.ts and import a preset object:

${preset}

Use @totto2727/oxlint/effect for Effect-only policy, or @totto2727/oxlint/preset for both groups.
The exported default plugin uses the rules/ namespace. Named exports typescriptRuleNames, effectRuleNames and compatibilityRuleNames expose group membership.
The presets already include a pinned MIT port of the native Ultracite 7.12.3 core configuration. The library does not depend on the full Ultracite CLI package, and runs directly with Oxlint. You do not need a second Ultracite preset or CLI wrapper.
React, type-aware rules, Ultracite JavaScript plugins and oxfmt integration are separate opt-in choices, not automatically enabled.
For explicit per-rule configuration in .oxlintrc.json instead of a preset (this does not apply the native core baseline):

${manual}

Use mode js for emitted JavaScript imports, or mode ts for TypeScript source execution. Missing extensions cannot be automatically inferred.
Do not enable force-ts-extension alongside the two replacement rules.

## Run and review {#run}

${code('sh', 'npx oxlint\nnpx oxlint --fix')}

Review diagnostics and fixes before committing. Only rules with a documented automatic fix change code.
Preset rules apply to test files as well as application sources. There are no test-only rule exemptions.
Use an oxlint-disable-next-line comment with -- and a concrete reason only when a genuine boundary exception is required.
See [TypeScript](/presets/typescript), [Effect](/presets/effect), and the [Oxlint configuration documentation](https://oxc.rs/docs/guide/usage/linter/config.html).`
    : `## インストール {#install}

TypeScript プロジェクトにパッケージと Oxlint を導入します。対象は Node.js 24 以降です。
npm リリース workflow は有効ですが、owner による初回公開と Trusted Publisher 設定は未完了です。レジストリで実際に利用可能になるまでは npm pack の配布アーカイブを使います。workspace パスで代用しないでください。

${install}

## 設定 {#configure}

ESM の oxlint.config.ts を作成し、プリセットオブジェクトを import します。

${preset}

Effect のみには @totto2727/oxlint/effect、両グループには @totto2727/oxlint/preset を使います。
default export のプラグインは rules/ 名前空間です。名前付き export の typescriptRuleNames、effectRuleNames、compatibilityRuleNames で所属を参照できます。
プリセットは native Ultracite 7.12.3 core 設定の MIT 固定移植を含みます。ライブラリは Ultracite CLI パッケージ全体に依存せず、Oxlint で直接実行します。別の Ultracite プリセットや CLI wrapper は不要です。
React、type-aware ルール、Ultracite JavaScript plugins、oxfmt 統合は個別の opt-in であり、自動的には有効化しません。
プリセットを使わず .oxlintrc.json で明示的にルールを選ぶ場合 (native core baseline は適用しません):

${manual}

JavaScript 出力の import には mode js、TypeScript ソース実行には mode ts を選びます。欠けた拡張子は自動推測できません。
force-ts-extension を2つの置換ルールと同時に有効にしないでください。

## 実行と確認 {#run}

${code('sh', 'npx oxlint\nnpx oxlint --fix')}

コミット前に診断と修正を確認します。自動修正を明記したルールのみがコードを変更します。
プリセットのルールはアプリケーションソースとテストファイルに同じように適用します。テスト専用のルール免除はありません。
本当に必要な境界例外だけに、-- と具体的な理由を持つ oxlint-disable-next-line を使います。
[TypeScript](/presets/typescript)、[Effect](/presets/effect)、[Oxlint の設定ドキュメント](https://oxc.rs/docs/guide/usage/linter/config.html)も参照してください。`
  for (const group of ['TypeScript', 'Effect'] as const) {
    const subpath = group.toLowerCase()
    const usage = code(
      'ts',
      `import { defineConfig } from 'oxlint'\nimport ${subpath} from '@totto2727/oxlint/${subpath}'\n\nexport default defineConfig({ extends: [${subpath}] })`,
    )
    const baseline = en
      ? `## Shared native baseline {#baseline}

Both groups and the combined preset apply a pinned MIT port of [Ultracite 7.12.3](https://www.npmjs.com/package/ultracite/v/7.12.3) native core and shared ignores, corresponding to \`ultracite/oxlint/core\`. The full Ultracite CLI is not imported. The runtime and command remain Oxlint directly.
Sources: [native core configuration](https://github.com/haydenbleasel/ultracite/blob/48156546701badf2c6e60f25cf1e8511f7dc44c7/packages/cli/config/oxlint/core/index.mjs) and [Oxlint provider documentation](https://github.com/haydenbleasel/ultracite/blob/48156546701badf2c6e60f25cf1e8511f7dc44c7/apps/docs/docs/provider/oxlint.mdx).

Three native rules are off in every group for safe composition:

- \`unicorn/prefer-bigint-literals\`: opposite to the official Effect no-bigint-literals policy.
- \`preserve-caught-error\`: assumes native Error.cause instead of the local Effect error field convention.
- \`prefer-const\`: duplicates the broader local no-let policy.

No upstream per-file overrides or test-only relaxations are inherited, but the local **/*.gen.ts no-redundant-alias allowance remains in TypeScript and combined presets.
React/type-aware presets, JavaScript plugins and oxfmt integration are not included.`
      : `## 共通 native baseline {#baseline}

両グループと統合プリセットは [Ultracite 7.12.3](https://www.npmjs.com/package/ultracite/v/7.12.3) の native core と共通 ignore の MIT 固定移植を適用します。\`ultracite/oxlint/core\` に対応し、Ultracite CLI 全体は取り込みません。実行時とコマンドは Oxlint を直接使います。
出典: [native core 設定](https://github.com/haydenbleasel/ultracite/blob/48156546701badf2c6e60f25cf1e8511f7dc44c7/packages/cli/config/oxlint/core/index.mjs) と [Oxlint provider ドキュメント](https://github.com/haydenbleasel/ultracite/blob/48156546701badf2c6e60f25cf1e8511f7dc44c7/apps/docs/docs/provider/oxlint.mdx)。

安全に合成するため、全グループで次の3つの native ルールを off にします。

- \`unicorn/prefer-bigint-literals\`: 公式 Effect の no-bigint-literals と逆のポリシーです。
- \`preserve-caught-error\`: 独自の Effect error フィールド規約ではなく native Error.cause を前提にします。
- \`prefer-const\`: より広い独自の no-let と診断が重複します。

上流のファイル別 override やテスト専用の緩和は継承せず、独自の **/*.gen.ts no-redundant-alias 許可だけを TypeScript と統合プリセットに残します。
React/type-aware プリセット、JavaScript plugins、oxfmt 統合は含みません。`
    const officialRules = externalEffectRuleNames
      .filter((name) => name !== 'no-js-extension-imports')
      .map((name) => `- \`rules/${name}\``)
      .join('\n')
    const officialEffect =
      group !== 'Effect'
        ? ''
        : en
          ? `## Official Effect policy layer {#official-effect}

The Effect preset also enables four externally authored rules from the [official Effect Oxc rule sources](${effectRuleSource}).
The upstream tools package is private. The library vendors MIT implementations and adapts them to its own rules/ plugin namespace, rather than installing an external npm plugin or importing the entire upstream native lint configuration.
Included at error severity:

${officialRules}

\`rules/no-js-extension-imports\` remains exported but is explicitly off in every preset. It overlaps the local extension family, including mjs/cjs, and its TS-only conversion conflicts with mode js. Use the local require-import-extension and consistent-import-extension rules instead.`
          : `## 公式 Effect ポリシー層 {#official-effect}

Effect プリセットは[公式 Effect Oxc ルールのソース](${effectRuleSource})に由来する4つの外部定義ルールも有効化します。
上流の tools パッケージは private です。ライブラリは MIT 実装を vendoring し、自身の rules/ プラグイン名前空間に適合させています。外部 npm プラグインのインストールや、上流の native lint 設定全体の import ではありません。
次のルールを error として収録します。

${officialRules}

\`rules/no-js-extension-imports\` は export を維持しますが、すべてのプリセットで明示的に off です。mjs/cjs を含む独自の拡張子ルールと重複し、TS 方向だけの変換が mode js と競合します。代わりに独自の require-import-extension と consistent-import-extension を使います。`
    const exceptions =
      group === 'TypeScript'
        ? en
          ? 'Generated **/*.gen.ts files allow no-redundant-alias. The compatibility force-ts-extension rule is not enabled. Extension normalization defaults to ts, and can be overridden with mode js.'
          : '生成された **/*.gen.ts では no-redundant-alias を許可します。互換ルール force-ts-extension は有効化しません。拡張子の統一は既定で ts、必要なら mode js に変更できます。'
        : en
          ? 'Legacy no-effect-import-as/no-effect-subpath-import remain opt-in because they impose the opposite convention to the official Effect module namespace policy. The no-node-imports preset allowlist contains child_process, crypto, os and util; other node: names require an explicit override.'
          : '独自の互換ルール no-effect-import-as/no-effect-subpath-import は公式 Effect の個別モジュール namespace ポリシーと逆の規約を持つため opt-in のままです。no-node-imports の既定の許可リストは child_process、crypto、os、util です。他の node: 名には明示的な上書きが必要です。'
    result[`presets/${subpath}.md`] =
      `${en ? '## Usage' : '## 使い方'} {#usage}\n\n${usage}\n\n${en ? 'The preset registers the plugin and enables the local rules below with error severity. The Effect preset additionally includes the official rules listed in its policy layer. Use @totto2727/oxlint/preset to combine both groups.' : 'プリセットはプラグインを登録し、以下の独自ルールを error として有効化します。Effect プリセットは、そのポリシー層に記載した公式ルールも含みます。両グループを組み合わせる場合は @totto2727/oxlint/preset を使います。'}\n\n${baseline}\n\n${en ? '## Included local rules' : '## 収録独自ルール'} {#included}\n\n${links(group)}\n\n${officialEffect}\n\n${en ? '## Exceptions' : '## 例外'} {#exceptions}\n\n${exceptions}\n\n${en ? 'Tests receive the same rules as application sources. No upstream test-file overrides are inherited. Any additional caller-defined exception must be narrow and reasoned.' : 'テストにもアプリケーションソースと同じルールを適用し、上流のテストファイル override は継承しません。利用者が追加する例外は範囲と理由を明確にしてください。'}`
  }
  return result
}

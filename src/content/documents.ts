import type { DocLocale } from './locale'
import { ruleArticles, ruleMarkdown } from './rules'

const code = (language: string, text: string) => `\`\`\`${language}\n${text}\n\`\`\``

export function documents(locale: DocLocale): Record<string, string> {
  const en = locale === 'en'
  const result: Record<string, string> = Object.fromEntries(
    ruleArticles.map((rule) => [`rules/${rule.name}.md`, ruleMarkdown(rule, locale)]),
  )
  const links = (group: 'TypeScript' | 'Effect') =>
    ruleArticles
      .filter((rule) => rule.group === group && !rule.optIn)
      .map((rule) => `- [${rule.name}](/rules/${rule.name}): ${rule.purpose[en ? 0 : 1]}`)
      .join('\n')
  result['index.md'] = en
    ? `## Choose your policy {#choose}

@totto2727/oxlint supplies an Oxlint JavaScript plugin for generic TypeScript conventions and Effect-oriented application policies.
Use the [TypeScript preset](/presets/typescript) for 8 custom generic rules, the [Effect preset](/presets/effect) for 22 custom Effect rules, or the combined package preset for both.
Both groups also share the native Ultracite 7.12.3 core baseline, with the explicit conflict adjustments described on the preset pages.
[Getting started](/guide/getting-started) walks through installation and configuration.

> [!NOTE]
> These rules are opinionated syntax checks, not type-level proofs. Review each rule's scope before enabling it.

## Rule reference {#rules}

There are 34 documented custom rules: 30 preset rules and four opt-in compatibility policies. Native Ultracite core rules are additional baseline policy, not part of this count.
[force-ts-extension](/rules/force-ts-extension) overlaps the split extension rules; [no-js-extension-imports](/rules/no-js-extension-imports) additionally handles mjs/cjs but conflicts with js mode and overlaps js/jsx checks.
[no-effect-import-as](/rules/no-effect-import-as) and [no-effect-subpath-import](/rules/no-effect-subpath-import) impose the opposite import convention to the official Effect barrel rule. They remain available but are not enabled by presets.

### TypeScript

${links('TypeScript')}

### Effect

${links('Effect')}`
    : `## ポリシーを選ぶ {#choose}

@totto2727/oxlint は、汎用 TypeScript の規約と Effect アプリケーションのポリシーを提供する Oxlint JavaScript プラグインです。
[TypeScript プリセット](/presets/typescript) は8つのカスタムルール、[Effect プリセット](/presets/effect) は22のカスタムルールです。両方を使う場合はパッケージの統合プリセットを選びます。
両グループは native Ultracite 7.12.3 core の共通 baseline も含みます。明示的な競合調整は各プリセットのページで説明します。
導入手順は[はじめに](/guide/getting-started)をご覧ください。

> [!NOTE]
> これらは意見を持った構文検査であり、型による証明ではありません。有効化する前に各ルールの対象範囲を確認してください。

## ルールリファレンス {#rules}

30のプリセットルールと4つの opt-in 互換ポリシー、合計34のカスタムルールを解説します。native Ultracite core のルールは追加の baseline であり、この数には含みません。
[force-ts-extension](/rules/force-ts-extension) は分割された拡張子ルールと重複します。[no-js-extension-imports](/rules/no-js-extension-imports) は mjs/cjs も扱いますが js モードと衝突し、js/jsx の診断が重複します。
[no-effect-import-as](/rules/no-effect-import-as) と [no-effect-subpath-import](/rules/no-effect-subpath-import) は公式 Effect barrel ルールと逆の import 規約です。互換用に残しますがプリセットでは有効化しません。

### TypeScript

${links('TypeScript')}

### Effect

${links('Effect')}`
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

Both group presets and the combined preset use a pinned MIT port of the native core configuration and shared ignores from [Ultracite 7.12.3](https://www.npmjs.com/package/ultracite/v/7.12.3), corresponding to its upstream \`ultracite/oxlint/core\` export.
Only these native configuration sources are included in the library. The full Ultracite CLI package and its unnecessary transitive dependencies are not imported. This avoids the unused CLI dependency advisory identified during the package audit, without changing the selected native rule policy. The runtime and command remain Oxlint directly.
Verified version sources: [native core configuration](https://github.com/haydenbleasel/ultracite/blob/48156546701badf2c6e60f25cf1e8511f7dc44c7/packages/cli/config/oxlint/core/index.mjs) and [official Oxlint provider documentation](https://github.com/haydenbleasel/ultracite/blob/48156546701badf2c6e60f25cf1e8511f7dc44c7/apps/docs/docs/provider/oxlint.mdx).
The library flattens its native core configuration and rules into each preset's top-level configuration, rather than adding a second preset to extends.
Native core settings and shared ignore patterns are retained. All upstream per-file overrides are discarded, including test-specific relaxations. Test files are not excluded by this policy.
The library's own **/*.gen.ts no-redundant-alias allowance remains in TypeScript and combined presets.

Three native rules are explicitly off in every group, including TypeScript, to make composition safe in either order:

- \`unicorn/prefer-bigint-literals\`: the opposite fix of the official Effect \`rules/no-bigint-literals\` policy.
- \`preserve-caught-error\`: assumes native Error.cause, while the custom Effect error convention preserves the original cause in an error field.
- \`prefer-const\`: duplicates declarations already covered by the broader custom \`rules/no-let\` policy when TypeScript is selected.

The count of 34 custom rules is unchanged. These three adjustments are native baseline settings, not new custom rules.
React presets, type-aware presets, Ultracite JavaScript plugins and oxfmt configuration are not imported automatically.
Keep the existing Oxlint/Vite+ command entrypoints and formatter configuration unless you independently opt into another integration.`
      : `## 共通 native baseline {#baseline}

両グループと統合プリセットは [Ultracite 7.12.3](https://www.npmjs.com/package/ultracite/v/7.12.3) の native core 設定と共通 ignore の MIT 固定移植を使います。上流の \`ultracite/oxlint/core\` export に対応します。
ライブラリにはこれらの native 設定ソースのみを取り込み、Ultracite CLI パッケージ全体と不要な間接依存を取り込みません。パッケージ監査で確認された未使用 CLI 依存の advisory を回避し、選択した native ルールのポリシーは変えません。実行時とコマンドは Oxlint を直接使います。
このバージョンの確認済み出典は [native core 設定](https://github.com/haydenbleasel/ultracite/blob/48156546701badf2c6e60f25cf1e8511f7dc44c7/packages/cli/config/oxlint/core/index.mjs) と [公式 Oxlint provider ドキュメント](https://github.com/haydenbleasel/ultracite/blob/48156546701badf2c6e60f25cf1e8511f7dc44c7/apps/docs/docs/provider/oxlint.mdx) です。
native core の設定とルールを各プリセットのトップレベルに展開し、extends に別のプリセットを追加する方式ではありません。
native core の設定と共通 ignore パターンは保持します。テスト向けの緩和を含め、上流のファイル別 override はすべて除外します。このポリシーはテストファイルを ignore しません。
ライブラリ独自の **/*.gen.ts に対する no-redundant-alias の許可は TypeScript と統合プリセットに残ります。

どちらの順序でグループを合成しても競合しないよう、TypeScript を含む全グループで3つの native ルールを明示的に off にします。

- \`unicorn/prefer-bigint-literals\`: 公式 Effect の \`rules/no-bigint-literals\` と逆方向の修正になります。
- \`preserve-caught-error\`: native Error.cause を前提とする一方、カスタム Effect 規約は元のエラーを error フィールドに保持します。
- \`prefer-const\`: TypeScript 選択時は、より広いカスタム \`rules/no-let\` と宣言の診断が重複します。

カスタムルールの合計34は変わりません。これら3つの調整は native baseline の設定であり、新しいカスタムルールではありません。
React プリセット、type-aware プリセット、Ultracite JavaScript plugins、oxfmt 設定は自動的に取り込みません。
別の統合を個別に選ぶまでは、既存の Oxlint/Vite+ コマンドと formatter 設定を維持します。`
    const exceptions =
      group === 'TypeScript'
        ? en
          ? 'Generated **/*.gen.ts files allow no-redundant-alias. The compatibility force-ts-extension rule is not enabled. Extension normalization defaults to ts, and can be overridden with mode js.'
          : '生成された **/*.gen.ts では no-redundant-alias を許可します。互換ルール force-ts-extension は有効化しません。拡張子の統一は既定で ts、必要なら mode js に変更できます。'
        : en
          ? 'The preset includes four official Effect rules, not the entire upstream native lint configuration. It permits module namespace imports and configures the barrel rule with regex patterns for effect/@effect package roots and lowercase subpaths, plus relative index imports. Legacy no-effect-import-as/no-effect-subpath-import are opt-in because they impose the opposite convention. The overlapping no-js-extension-imports is also off. no-unused-internal only scans cwd/packages/**/src .ts files and caches analysis per process. The no-node-imports preset allowlist contains child_process, crypto, os and util; other node: names require an explicit override.'
          : '公式 Effect の4ルールを含みますが、上流の native lint 設定全体ではありません。モジュールの namespace import を許可し、barrel ルールには effect/@effect のパッケージルートと小文字サブパスの正規表現および相対 index import を設定します。逆の規約を持つ no-effect-import-as/no-effect-subpath-import と重複する no-js-extension-imports は opt-in です。no-unused-internal は cwd/packages/**/src の .ts のみを走査し、解析をプロセス内でキャッシュします。no-node-imports の既定の許可リストは child_process、crypto、os、util です。他の node: 名には明示的な上書きが必要です。'
    result[`presets/${subpath}.md`] =
      `${en ? '## Usage' : '## 使い方'} {#usage}\n\n${usage}\n\n${en ? 'The preset registers the plugin and enables every listed rule with error severity. Use @totto2727/oxlint/preset to combine both groups.' : 'プリセットはプラグインを登録し、以下のルールを error として有効化します。両グループを組み合わせる場合は @totto2727/oxlint/preset を使います。'}\n\n${baseline}\n\n${en ? '## Included custom rules' : '## 収録カスタムルール'} {#included}\n\n${links(group)}\n\n${en ? '## Exceptions' : '## 例外'} {#exceptions}\n\n${exceptions}\n\n${en ? 'Tests receive the same rules as application sources. No upstream test-file overrides are inherited. Any additional caller-defined exception must be narrow and reasoned.' : 'テストにもアプリケーションソースと同じルールを適用し、上流のテストファイル override は継承しません。利用者が追加する例外は範囲と理由を明確にしてください。'}`
  }
  return result
}

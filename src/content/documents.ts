import type { DocLocale } from './locale.ts'
import { effectRuleSource } from './policies.ts'
import { ruleArticles, ruleMarkdown } from './rules.ts'

const presetSource =
  'https://github.com/totto2727-org/oxlint/blob/bed13483292d75318f9ca01e124aa666edaa8202/src/preset.ts'

const fence = (language: string, text: string): string => `\`\`\`${language}\n${text}\n\`\`\``

const install = fence('sh', 'npm install --save-dev @totto2727/oxlint oxlint oxlint-tsgolint')
const configure = fence(
  'js',
  "import { defineConfig } from 'oxlint'\nimport preset from '@totto2727/oxlint/preset/application'\n\nexport default defineConfig({ extends: [preset] })",
)
const run = fence('sh', 'npx oxlint --config .oxlintrc.mjs src\nnpx oxlint --config .oxlintrc.mjs --fix src')

const overview = {
  en: `## Choose a preset {#choose}

| Project | Import path |
| --- | --- |
| Application | \`@totto2727/oxlint/preset/application\` |
| Library | \`@totto2727/oxlint/preset/library\` |
| Mixed workspace | \`@totto2727/oxlint/preset\` |

Follow [Getting started](/guide/getting-started) to run Oxlint.
All three presets use the [same shared rules](/presets/typescript).
Only the [tracing settings](/presets/effect) differ.

## Rule reference {#rules}

The lists below link to rule pages with examples.
See [Rules from Effect](/presets/effect#official-effect) for the four rules that come from Effect.`,
  ja: `## プリセットを選ぶ {#choose}

| プロジェクト | import パス |
| --- | --- |
| アプリケーション | \`@totto2727/oxlint/preset/application\` |
| ライブラリ | \`@totto2727/oxlint/preset/library\` |
| アプリとライブラリが混在するワークスペース | \`@totto2727/oxlint/preset\` |

Oxlint の実行手順は[はじめに](/guide/getting-started)を参照してください。
3つのプリセットは[共通ルール](/presets/typescript)を使い、[トレース設定](/presets/effect)だけが異なります。

## ルールリファレンス {#rules}

以下の TypeScript と Effect の一覧から、ルールの使用例を確認できます。
Effect 由来の4ルールは [Effect 由来のルール](/presets/effect#official-effect)を参照してください。`,
}

const guide = {
  en: `## Install {#install}

Use Node.js 24 or later.
Install the lint tools as development dependencies:

${install}

## Configure {#configure}

Add this configuration to \`.oxlintrc.mjs\` in your project root:

${configure}

For a library, change the import path to \`@totto2727/oxlint/preset/library\`.
For a mixed workspace, use \`@totto2727/oxlint/preset\` and [set the tracing mode by path](/presets/effect#usage).

If you upgrade \`@totto2727/oxlint\` from version 0.1, replace the \`/typescript\` or \`/effect\` import with the [preset for your project](/#choose).
Remove the Ultracite config if you only used it to load these rules.

## Run and review {#run}

If your source directory is not \`src\`, replace \`src\` with its path.
From the project root, run the first command to find errors.
Then run the second command to apply available fixes:

${run}

Review the changes before you commit them.
See [Shared rules](/presets/typescript#exceptions) for line-level exceptions.`,
  ja: `## インストール {#install}

Node.js 24 以降を使います。
リントツールを開発用依存としてインストールします。

${install}

## 設定 {#configure}

プロジェクトルートに \`.oxlintrc.mjs\` を作成します。

${configure}

ライブラリでは import パスを \`@totto2727/oxlint/preset/library\` に変更します。
混在ワークスペースでは \`@totto2727/oxlint/preset\` を使い、[パスごとにトレースモードを設定](/presets/effect#usage)します。

バージョン 0.1 の \`/typescript\` または \`/effect\` の import は置き換えてください。
このルールを読み込むためだけに Ultracite を設定していた場合は、その設定を削除します。

## 実行と確認 {#run}

必要に応じて \`src\` をソースディレクトリに置き換えてください。
プロジェクトルートで最初のコマンドを実行してエラーを確認します。
次のコマンドで、自動修正できる箇所を修正します。

${run}

コミット前に差分を確認します。
行単位の例外は[共通ルール](/presets/typescript#exceptions)を参照してください。`,
}

const shared = {
  en: `## Usage {#usage}

Use one of the [three presets](/#choose) to load the shared rules.
To select rules individually, add \`@totto2727/oxlint\` to \`jsPlugins\`.
Use the \`rules/\` prefix for its rule names.
This method does not load the shared Oxlint rules.

## Oxlint rules {#baseline}

The presets set all seven Oxlint rule categories to \`error\`.
They enable type-aware rules, but do not report TypeScript compiler errors by default.
Set \`options.typeCheck\` to \`true\` to include compiler errors.

The presets include React and accessibility rules.
They add Vitest rules only to \`*.test.ts\` and \`*.test.tsx\` files.
In these files, use \`test\` instead of \`it\`.
The presets turn off \`no-magic-numbers\` only in these files.
Use your formatter to sort imports.
See the [preset source](${presetSource}) for the full configuration.

## Custom rules {#included}

See the [rule reference](/#rules) to find examples.
Use [require-import-extension](/rules/require-import-extension) to find missing extensions.
[consistent-import-extension](/rules/consistent-import-extension) checks extensions that are present.
If your imports point to emitted JavaScript files, set its mode to \`js\`.

## Exceptions {#exceptions}

If you must disable a rule, use \`oxlint-disable-next-line\` with the rule name.
Add \`--\` and explain why the line needs an exception.`,
  ja: `## 使い方 {#usage}

[3つのプリセット](/#choose)のいずれかで共通ルールを読み込みます。
ルールを個別に使う場合は \`jsPlugins\` に \`@totto2727/oxlint\` を追加し、ルール名に \`rules/\` を付けます。
この方法では共通の Oxlint ルールは有効になりません。

## Oxlint のルール {#baseline}

プリセットは Oxlint の全7カテゴリを \`error\` に設定します。
型情報を使うルールは有効ですが、既定では TypeScript コンパイラーのエラーを報告しません。
コンパイラーのエラーも報告するには \`options.typeCheck\` を \`true\` にします。

React とアクセシビリティのルールを含みます。
Vitest ルールは \`*.test.ts\` と \`*.test.tsx\` にのみ適用します。
これらのファイルでは \`test\` を使い、数値リテラルを許可します。
import の並び替えにはフォーマッターを使います。
全設定は[プリセットのソース](${presetSource})を参照してください。

## 独自ルール {#included}

使用例は[ルールリファレンス](/#rules)を参照してください。
拡張子がない import は [require-import-extension](/rules/require-import-extension) で検出します。
[consistent-import-extension](/rules/consistent-import-extension) は既存の拡張子を検査します。
ビルドが出力する JavaScript を参照する場合は、このルールのモードを \`js\` にします。

## 例外 {#exceptions}

やむを得ずルールを無効にする場合は、\`oxlint-disable-next-line\` にルール名を指定します。
\`--\` に続けて、その行で例外が必要な理由を書きます。`,
}

const traceMode = fence(
  'js',
  "import { defineConfig } from 'oxlint'\nimport preset from '@totto2727/oxlint/preset'\n\nexport default defineConfig({\n  extends: [preset],\n  overrides: [\n    { files: ['apps/**'], rules: { 'rules/effect-tracing': ['error', 'application'] } },\n    { files: ['packages/**'], rules: { 'rules/effect-tracing': ['error', 'library'] } },\n  ],\n})",
)

const effect = {
  en: `## Usage {#usage}

For a mixed workspace, set the tracing mode for each directory:

${traceMode}

## Tracing modes {#baseline}

| Mode | Function | Spans |
| --- | --- | --- |
| Application | Use \`Effect.fn\`. | Use \`Effect.withSpan\` when you need a span. |
| Library | Use \`Effect.fnUntraced\`. | Do not use \`Effect.withSpan\` or \`Effect.withSpanScoped\`. |
| Shared | Use either function. | Use spans if necessary. |

In all modes, keep inline \`Effect.gen\` generators anonymous.

## Custom rules {#included}

See [effect-tracing](/rules/effect-tracing) for examples and the rules for inline generators.
The other [Effect rules](/#rules) apply in all three modes.

## Rules from Effect {#official-effect}

The package includes four MIT-licensed rule implementations from [Effect’s Oxc sources](${effectRuleSource}).
All presets enable them. You do not need Effect’s private tools package.

- \`rules/no-bigint-literals\`: Use \`BigInt()\` instead of literals such as \`1n\`.
- \`rules/no-import-from-barrel-package\`: Use module imports instead of importing through a relative \`index\` file. Set \`checkPatterns\` to check specific package imports.
- \`rules/no-opaque-instance-fields\`: Do not add instance fields to classes that use an opaque type.
- \`rules/no-unused-internal\`: Remove internal exports that no other file uses.

Use the [two import extension rules](/presets/typescript#included) instead of the retired \`no-js-extension-imports\` rule.

## Exceptions {#exceptions}

If tracing costs too much in a critical application path, [disable the rule on that line](/presets/typescript#exceptions).
State why that path cannot use tracing.`,
  ja: `## 使い方 {#usage}

混在ワークスペースでは、ディレクトリごとにトレースモードを設定します。

${traceMode}

## トレースモード {#baseline}

| モード | 関数 | スパン |
| --- | --- | --- |
| アプリケーション | \`Effect.fn\` を使います。 | スパンが必要な箇所に \`Effect.withSpan\` を使います。 |
| ライブラリ | \`Effect.fnUntraced\` を使います。 | \`Effect.withSpan\` と \`Effect.withSpanScoped\` は使いません。 |
| 共通 | どちらの関数も使えます。 | 必要に応じてスパンを使います。 |

すべてのモードで、\`Effect.gen\` に直接渡すジェネレーターに名前を付けません。

## 独自ルール {#included}

ジェネレーターの扱いと使用例は [effect-tracing](/rules/effect-tracing) を参照してください。
その他の [Effect ルール](/#rules)は全モードで共通です。

## Effect 由来のルール {#official-effect}

全プリセットが [Effect の Oxc ソース](${effectRuleSource})にある MIT ライセンスの4ルールを収録します。
Effect の非公開 tools パッケージのインストールは不要です。

- \`rules/no-bigint-literals\`: \`1n\` などのリテラルの代わりに \`BigInt()\` を使います。
- \`rules/no-import-from-barrel-package\`: 相対パスの \`index\` を経由せず、個別モジュールを import します。特定のパッケージも検査する場合は \`checkPatterns\` を設定します。
- \`rules/no-opaque-instance-fields\`: 不透明型を使うクラスにインスタンスフィールドを追加しません。
- \`rules/no-unused-internal\`: 他のファイルから使われない内部 export を削除します。

廃止した \`no-js-extension-imports\` の代わりに、[2つの拡張子ルール](/presets/typescript#included)を使います。

## 例外 {#exceptions}

アプリケーションの性能上、トレースの負荷を許容できない箇所では[その行だけルールを無効に](/presets/typescript#exceptions)できます。
その箇所でトレースを使えない理由を書いてください。`,
}

const listedRules = (group: 'TypeScript' | 'Effect'): string =>
  ruleArticles
    .filter((rule) => rule.group === group)
    .map(({ name }) => `- [${name}](/rules/${name})`)
    .join('\n')

export const documents = (locale: DocLocale): Record<string, string> => ({
  ...Object.fromEntries(ruleArticles.map((rule) => [`rules/${rule.name}.md`, ruleMarkdown(rule, locale)])),
  'guide/getting-started.md': guide[locale],
  'index.md': `${overview[locale]}\n\n### TypeScript\n\n${listedRules('TypeScript')}\n\n### Effect\n\n${listedRules('Effect')}`,
  'presets/effect.md': effect[locale],
  'presets/typescript.md': shared[locale],
})

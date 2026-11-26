const presetSource = 'https://github.com/totto2727-org/oxlint/blob/main/src/preset.ts'

const functionStyle = `\`\`\`tsx
import * as React from 'react'

const formatName = function formatName(name: string) {
  return name.trim()
}

const Card = () => <article />
const MemoCard = React.memo(() => <article />)
const CardWithRef = React.forwardRef<HTMLElement>((_props, ref) => <article ref={ref} />)
\`\`\``

export const sharedPresetArticle = {
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

The shared, application and library presets turn off \`eslint/no-undef\` in JavaScript and TypeScript, including test files.
When you enable TypeScript compiler checks, an undeclared name in TypeScript can produce \`TS2304\`.

The three presets turn off \`eslint/sort-keys\`.
Changing property order can change the order of value evaluation and \`Object.keys()\` results.
Class Variance Authority (CVA) reads variant keys in that order, which can change the order of the classes in its output.

The three presets turn off \`import/unambiguous\` only in \`**/*.d.ts\` files.
An ambient module declaration can use \`declare module\` without a top-level \`import\` or \`export\`.
The rule applies to JavaScript and TypeScript implementation files, including \`.tsx\` files.
When you enable TypeScript compiler checks, an import from an unknown module can produce \`TS2307\`.

See the [preset source](${presetSource}) for the full configuration.

## Function style {#function-style}

| Rule | Severity | Setting |
| --- | --- | --- |
| \`eslint/func-style\` | \`error\` | \`expression\` |
| \`react/function-component-definition\` | \`error\` | \`namedComponents: 'arrow-function'\`, \`unnamedComponents: 'arrow-function'\` |

For ordinary functions, use arrow functions or named function expressions in variable initializers.
Use arrow functions for React components, including inline components passed to \`React.memo\` or \`React.forwardRef\`.

${functionStyle}

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

共通・アプリケーション・ライブラリの各プリセットは、テストを含む JavaScript と TypeScript で \`eslint/no-undef\` を無効にします。
TypeScript の型検査を有効にすると、TypeScript 内の未宣言の名前が \`TS2304\` として報告される場合があります。

3つのプリセットは \`eslint/sort-keys\` を無効にします。
プロパティの並び替えは、値の評価順や \`Object.keys()\` の列挙順を変えることがあります。
Class Variance Authority（CVA）はその順序でバリアントを読み取るため、出力内のクラスの順序も変わることがあります。

3つのプリセットは \`**/*.d.ts\` に限り \`import/unambiguous\` を無効にします。
アンビエントモジュールは、トップレベルの \`import\` や \`export\` を使わずに \`declare module\` で宣言できます。
JavaScript と TypeScript の実装ファイルには、\`.tsx\` を含めてこのルールを適用します。
TypeScript の型検査を有効にすると、未知のモジュールからの import が \`TS2307\` として報告される場合があります。

全設定は[プリセットのソース](${presetSource})を参照してください。

## 関数形式 {#function-style}

| ルール | 重大度 | 設定 |
| --- | --- | --- |
| \`eslint/func-style\` | \`error\` | \`expression\` |
| \`react/function-component-definition\` | \`error\` | \`namedComponents: 'arrow-function'\`, \`unnamedComponents: 'arrow-function'\` |

通常の関数には、変数の初期化でアロー関数または名前付き関数式を使えます。
React コンポーネントには、\`React.memo\` や \`React.forwardRef\` に直接渡すものも含めてアロー関数を使います。

${functionStyle}

## 独自ルール {#included}

使用例は[ルールリファレンス](/#rules)を参照してください。
拡張子がない import は [require-import-extension](/rules/require-import-extension) で検出します。
[consistent-import-extension](/rules/consistent-import-extension) は既存の拡張子を検査します。
ビルドが出力する JavaScript を参照する場合は、このルールのモードを \`js\` にします。

## 例外 {#exceptions}

やむを得ずルールを無効にする場合は、\`oxlint-disable-next-line\` にルール名を指定します。
\`--\` に続けて、その行で例外が必要な理由を書きます。`,
}

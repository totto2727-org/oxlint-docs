import type { DocLocale } from './locale'

export interface RuleArticle {
  readonly name: string
  readonly group: 'TypeScript' | 'Effect'
  readonly purpose: readonly [string, string]
  readonly details: readonly [string, string]
  readonly invalid: string
  readonly valid: string
  readonly optIn?: boolean
  readonly fixable?: boolean
  readonly options?: readonly [string, string]
}

// Authored against package/oxlint/src/rules and the original monorepo rule tests.
// Examples are syntax fixtures for this individual rule, not complete runnable programs.
export const ruleArticles: readonly RuleArticle[] = [
  {
    name: 'consistent-import-extension',
    group: 'TypeScript',
    purpose: [
      'Normalize code-module import extensions for your runtime.',
      '実行環境に合わせてコードモジュールの拡張子を統一します。',
    ],
    details: [
      'Checks static imports, re-exports and literal dynamic imports for relative paths and # subpath aliases. In ts mode, .js/.jsx become .ts/.tsx, .mjs becomes .mts and .cjs becomes .cts. In js mode, .js/.jsx/.ts/.tsx become .js, .mjs/.mts become .mjs and .cjs/.cts become .cjs. Missing extensions belong to require-import-extension. Asset extensions, bare packages and absolute paths are ignored. Query strings, fragments and quote style are preserved.',
      '相対パスと # サブパスの静的 import、再 export、文字列の動的 import を検査します。ts モードは .js/.jsx を .ts/.tsx、.mjs を .mts、.cjs を .cts に変換します。js モードは .js/.jsx/.ts/.tsx を .js、.mjs/.mts を .mjs、.cjs/.cts を .cjs に統一します。拡張子なしは require-import-extension が担当します。アセット、パッケージ名、絶対パスは対象外で、クエリ、フラグメント、引用符を保持します。',
    ],
    invalid: "import { foo } from './foo.js'",
    valid: "import { foo } from './foo.ts'",
    fixable: true,
    options: [
      '`{ mode: "ts" }` (default) or `{ mode: "js" }`. Configure `["error", { "mode": "js" }]` for emitted JavaScript. The examples below use the default ts mode.',
      '`{ mode: "ts" }`（既定）または `{ mode: "js" }`。JavaScript 出力用には `["error", { "mode": "js" }]` を設定します。以下は既定の ts モードです。',
    ],
  },
  {
    name: 'require-import-extension',
    group: 'TypeScript',
    purpose: [
      'Require explicit extensions without guessing module resolution.',
      'モジュール解決を推測せず明示的な拡張子を要求します。',
    ],
    details: [
      'Reports extensionless relative and # alias imports, including directory paths. Covers static imports, re-exports and literal dynamic imports. It does not infer .ts versus .tsx or an index filename, so it never autofixes. Bare packages and absolute paths are ignored; explicit asset extensions are allowed.',
      '相対パスと # エイリアスの拡張子なし import を、ディレクトリ指定も含めて報告します。静的 import、再 export、文字列の動的 import が対象です。.ts と .tsx、index ファイルを推測しないため自動修正しません。パッケージ名と絶対パスは対象外で、アセット拡張子も許可します。',
    ],
    invalid: "import { foo } from './foo'",
    valid: "import { foo } from './foo.ts'",
  },
  {
    name: 'force-ts-extension',
    optIn: true,
    group: 'TypeScript',
    options: [
      '`{ mode: "ts" }` (default) or `{ mode: "js" }`, matching consistent-import-extension. Missing extensions are still reported without a fix. Examples below use ts mode.',
      '`{ mode: "ts" }`（既定）または `{ mode: "js" }`。consistent-import-extension と同じ指定で、拡張子なしは修正せず報告します。以下は ts モードです。',
    ],
    purpose: [
      'Compatibility rule combining required extensions with ts normalization.',
      '拡張子の必須化と ts への統一を組み合わせる互換ルールです。',
    ],
    details: [
      'Retained for existing configurations. Reports missing extensions without a fix and normalizes all supported extension families using the same ts/js mode as consistent-import-extension, including .mjs/.mts and .cjs/.cts. Shares the same relative/# scope and import/export/dynamic-import coverage as the split rules. Prefer require-import-extension plus consistent-import-extension. Presets omit this alias to avoid duplicate reports.',
      '既存設定との互換性を保ちます。拡張子なしは修正せず報告し、consistent-import-extension と同じ ts/js モードで .mjs/.mts と .cjs/.cts を含む拡張子の各系統を統一します。分離後のルールと同じ相対/# パス、import/export/動的 import を扱います。新規設定では require-import-extension と consistent-import-extension を使ってください。重複報告を避けるためプリセットには含みません。',
    ],
    invalid: "import { foo } from './foo.js'",
    valid: "import { foo } from './foo.ts'",
    fixable: true,
  },
  {
    name: 'no-eslint-disable-comments',
    group: 'TypeScript',
    purpose: [
      'Use Oxlint suppression directives instead of ESLint directives.',
      'ESLint ではなく Oxlint の抑制コメントを使います。',
    ],
    details: [
      'Detects eslint-disable, eslint-disable-line and eslint-disable-next-line in line and block comments. The fix replaces the directive name, preserving its rule list and reason. Pair with require-disable-reason.',
      '行・ブロックコメント内の eslint-disable、eslint-disable-line、eslint-disable-next-line を検出します。ルール一覧と理由を保持して名前を置換します。require-disable-reason と併用してください。',
    ],
    invalid: '// eslint-disable-next-line no-console\nconsole.log(1)',
    valid: '// oxlint-disable-next-line no-console -- boundary logging\nconsole.log(1)',
    fixable: true,
  },
  {
    name: 'no-jsx-script-tag',
    group: 'TypeScript',
    purpose: ['Avoid native script elements in JSX.', 'JSX のネイティブ script 要素を禁止します。'],
    details: [
      'Reports lowercase `<script>` JSX elements. Components such as `<Script>` are not the same syntax and are allowed. Use your framework-owned script integration rather than manually injecting execution.',
      '小文字の `<script>` JSX 要素を報告します。`<Script>` のようなコンポーネントは別の構文であり許可します。手動挿入ではなくフレームワーク管理の統合を使います。',
    ],
    invalid: 'const el = <script>alert(1)</script>',
    valid: 'const el = <Script />',
  },
  {
    name: 'no-let',
    group: 'TypeScript',
    purpose: [
      'Prefer immutable const bindings and explicit shadowing.',
      'const と明示的なシャドーイングを優先します。',
    ],
    details: [
      'Reports every let variable declaration, once per declaration even with multiple declarators. It does not report var and does not rewrite reassignment automatically.',
      'let 宣言を報告します。複数の変数を含む宣言も報告は1回です。var はこのルールの対象外であり、再代入を自動変換しません。',
    ],
    invalid: 'let x = 1',
    valid: 'const x = 1',
  },
  {
    name: 'no-redundant-alias',
    group: 'TypeScript',
    purpose: [
      'Avoid aliases that only rename an existing value or type.',
      '既存の値や型を単に改名する別名を避けます。',
    ],
    details: [
      'Reports non-generic plain type-reference aliases and exported identifier-only variable rebindings. Local value bindings, meaningful type transformations and parameterized aliases are outside this pattern. Re-export directly; document any anti-corruption-layer exception with a suppression reason.',
      '非ジェネリックの単純な型参照エイリアスと、export された識別子だけの値の再束縛を報告します。ローカル変数、型変換、型引数付きエイリアスは対象外です。直接再 export し、境界層の例外は理由付きで抑制します。',
    ],
    invalid: 'type SentEmail = SendParams\nexport const sentEmail = sendParams',
    valid: 'export { sendParams }\ntype SentEmail = { id: string }',
  },
  {
    name: 'no-string-style',
    group: 'TypeScript',
    purpose: [
      'Use JSX object styles instead of string styles.',
      'JSX の style には文字列ではなくオブジェクトを使います。',
    ],
    details: [
      'Reports string-valued JSX style attributes. Object expressions are allowed. This is a syntactic check, not validation of individual CSS properties.',
      '文字列の JSX style 属性を報告します。オブジェクト式は許可します。CSS プロパティの妥当性ではなく構文を検査します。',
    ],
    invalid: "const el = <div style='color: red' />",
    valid: "const el = <div style={{ color: 'red' }} />",
  },
  {
    name: 'require-disable-reason',
    group: 'TypeScript',
    purpose: ['Make every Oxlint suppression explain its exception.', 'Oxlint の抑制に例外の理由を必須とします。'],
    details: [
      'Requires a non-empty reason following -- in oxlint-disable, oxlint-disable-line and oxlint-disable-next-line comments. A rule list alone or an empty reason is insufficient. Does not invent or autofix reasons.',
      'oxlint-disable、oxlint-disable-line、oxlint-disable-next-line に -- の後の空でない理由を要求します。ルール一覧だけ、または空の理由は不十分です。理由は自動生成しません。',
    ],
    invalid: '// oxlint-disable-next-line no-fetch\nfetch("x")',
    valid: '// oxlint-disable-next-line no-fetch -- external API boundary\nfetch("x")',
  },
  {
    name: 'force-array-empty',
    group: 'Effect',
    purpose: [
      'Use Effect Array predicates for empty and non-empty checks.',
      '空・非空の判定に Effect Array の述語を使います。',
    ],
    details: [
      'Reports recognized .length comparisons against 0 or 1, including reversed operands. Arbitrary thresholds, impossible negative checks and tautologies are ignored. This syntax-only rule does not prove the receiver is an array.',
      '.length と 0 または 1 の空・非空比較を、左右を逆にした比較も含めて報告します。任意の閾値、不可能な負数判定、恒真式は対象外です。受信値が配列かどうかの型検査は行いません。',
    ],
    invalid: 'if (arr.length === 0) {}',
    valid: 'if (Array.isEmpty(arr)) {}',
  },
  {
    name: 'force-iterable-empty',
    group: 'Effect',
    purpose: [
      'Use Iterable.isEmpty rather than size-based emptiness checks.',
      'size 比較ではなく Iterable.isEmpty を使います。',
    ],
    details: [
      'Checks non-computed Iterable.size calls compared with 0 or 1, using the same classification as force-array-empty. Other namespaces and arbitrary size thresholds are ignored. Negate Iterable.isEmpty for non-empty checks.',
      '非 computed の Iterable.size と 0 または 1 の比較を force-array-empty と同じ基準で検査します。他の名前空間と任意のサイズ閾値は対象外です。非空判定は Iterable.isEmpty を否定します。',
    ],
    invalid: 'if (Iterable.size(xs) === 0) {}',
    valid: 'if (Iterable.isEmpty(xs)) {}',
  },
  {
    name: 'force-predicate',
    group: 'Effect',
    purpose: [
      'Replace direct null, undefined and typeof comparisons with predicates.',
      'null、undefined、typeof の直接比較を述語に置き換えます。',
    ],
    details: [
      'Recognizes null/undefined equality checks and supported typeof string comparisons. Numeric comparisons are ignored. When prefer-is-nullish is enabled too, choose Predicate.isNullish or isNotNullish unless distinguishing null and undefined is required.',
      'null/undefined の等値比較と対応する typeof の文字列比較を検出します。数値比較は対象外です。prefer-is-nullish も有効なら、区別が必要な場合を除き Predicate.isNullish または isNotNullish を使います。',
    ],
    invalid: "if (typeof x === 'string') {}",
    valid: 'if (Predicate.isString(x)) {}',
  },
  {
    name: 'force-string-empty',
    group: 'Effect',
    purpose: [
      'Use String.isEmpty and String.isNonEmpty for empty strings.',
      '空文字列の判定に String.isEmpty と String.isNonEmpty を使います。',
    ],
    details: [
      'Detects equality and inequality against the empty string on either side. Non-empty string literals and unrelated numeric comparisons are ignored.',
      '左右いずれかが空文字列の等値・不等値比較を検出します。空でない文字列と数値の比較は対象外です。',
    ],
    invalid: "if (s === '') {}",
    valid: 'if (String.isEmpty(s)) {}',
  },
  {
    name: 'no-effect-import-as',
    optIn: true,
    group: 'Effect',
    purpose: [
      'Keep Effect ecosystem imports named and unaliased.',
      'Effect エコシステムの import を名前付きで別名なしに保ちます。',
    ],
    details: [
      'Reports namespace imports and renamed named imports from effect and @effect packages. Direct named imports are allowed. The rule is about import syntax, not all aliases in the program.',
      'effect と @effect パッケージからの名前空間 import と、別名付きの名前付き import を報告します。直接の名前付き import は許可します。プログラム内のすべての別名を禁止するルールではありません。',
    ],
    invalid: "import * as Effect from 'effect'\nimport { Schema as S } from 'effect'",
    valid: "import { Effect, Schema } from 'effect'",
  },
  {
    name: 'no-effect-runtime-run',
    group: 'Effect',
    purpose: [
      'Keep runtime execution at explicitly documented workflow boundaries.',
      'ランタイム実行を理由の明確なワークフロー境界に限定します。',
    ],
    details: [
      'Reports non-computed member calls named runCallback, runFork, runMain, runPromise, runPromiseExit or runSync regardless of receiver name. It does not automatically exempt top-level entrypoints. Use a reasoned suppression for genuine execution boundaries; compose effects elsewhere.',
      '受信名に関係なく runCallback、runFork、runMain、runPromise、runPromiseExit、runSync という非 computed メンバー呼び出しを報告します。トップレベルのエントリーポイントも自動的には除外しません。実行境界では理由付き抑制を使い、その他では Effect を合成します。',
    ],
    invalid: 'Effect.runPromise(program)',
    valid: 'program.pipe(Effect.provide(layer))',
  },
  {
    name: 'no-effect-subpath-import',
    optIn: true,
    group: 'Effect',
    purpose: [
      'Prefer public Effect package roots over deep subpaths.',
      'Effect の深いサブパスではなく公開パッケージルートを使います。',
    ],
    details: [
      'Checks static imports. Allows effect, @effect/<package>, and exactly effect/unstable/<module>. Deeper unstable paths and other Effect subpaths are reported. It does not inspect export declarations or dynamic imports.',
      '静的 import を検査します。effect、@effect/<package>、正確に effect/unstable/<module> の深さを許可します。それより深い unstable とその他の Effect サブパスは報告します。export と動的 import は検査しません。',
    ],
    invalid: "import { Schema } from 'effect/Schema'",
    valid: "import { Schema } from 'effect'",
  },
  {
    name: 'no-error-cause-option',
    group: 'Effect',
    purpose: [
      'Preserve raw errors using an explicit error field.',
      '生のエラーを明示的な error フィールドで保持します。',
    ],
    details: [
      'Reports new Error calls whose second object argument contains cause. Other constructors such as TypeError are outside this rule. Prefer an application error type that carries the original error rather than rebuilding its message.',
      'new Error の第2引数のオブジェクトに cause がある場合に報告します。TypeError などの別のコンストラクターは対象外です。メッセージを再構築せず元の error を保持するアプリケーションエラー型を使います。',
    ],
    invalid: "new Error('boom', { cause: error })",
    valid: 'new ConfigFileError({ error })',
  },
  {
    name: 'no-error-property-access',
    group: 'Effect',
    purpose: [
      'Pass raw error values through without inspecting their properties.',
      '生のエラーのプロパティを参照せず、そのまま渡します。',
    ],
    details: [
      'Reports member access on identifiers named e, error, c, cause or err, including bracket access. It is name-based and is not restricted to catch blocks. Other receiver names are not checked, so do not treat passing this rule as proof of error safety.',
      'e、error、c、cause、err という識別子のメンバー参照を、角括弧も含めて報告します。名前ベースであり catch ブロックには限定しません。他の受信名は検査しないため、合格がエラー処理の安全性の証明ではありません。',
    ],
    invalid: 'const message = error.message',
    valid: 'new ConfigFileError({ error })',
  },
  {
    name: 'no-fetch',
    group: 'Effect',
    purpose: [
      'Use Effect HttpClient instead of calling global fetch.',
      'グローバル fetch ではなく Effect HttpClient を使います。',
    ],
    details: [
      'Reports fetch(), globalThis.fetch(), window.fetch() and self.fetch(). Arbitrary client.fetch calls and references without a direct call are ignored. Model HTTP requirements as services and preserve typed errors.',
      'fetch()、globalThis.fetch()、window.fetch()、self.fetch() を報告します。任意の client.fetch と直接呼び出しでない参照は対象外です。HTTP の依存をサービスとして表し、型付きエラーを保持します。',
    ],
    invalid: "fetch('https://example.com')",
    valid: "httpClient.get('https://example.com')",
  },
  {
    name: 'no-instanceof-error',
    group: 'Effect',
    purpose: [
      'Avoid normalizing caught values using instanceof Error.',
      'instanceof Error による捕捉値の正規化を避けます。',
    ],
    details: [
      'Reports instanceof with the right-hand identifier Error. Other constructors such as TypeError are not reported. Carry unknown caught values unchanged in a structured error field.',
      '右辺が Error 識別子の instanceof を報告します。TypeError などの別のコンストラクターは報告しません。unknown の捕捉値は構造化エラーのフィールドでそのまま保持します。',
    ],
    invalid: 'const isError = error instanceof Error',
    valid: 'new ConfigFileError({ error })',
  },
  {
    name: 'no-js-date',
    group: 'Effect',
    purpose: [
      'Use Effect DateTime and Duration instead of native Date operations.',
      'ネイティブ Date 操作ではなく Effect DateTime と Duration を使います。',
    ],
    details: [
      'Reports new Date(), Date.now(), Date.parse() and Date.UTC(). Mere references and Date.prototype are allowed. Native Date at an external API boundary still needs an explicit suppression reason.',
      'new Date()、Date.now()、Date.parse()、Date.UTC() を報告します。単なる参照と Date.prototype は許可します。外部 API 境界のネイティブ Date も明示的な理由付き抑制が必要です。',
    ],
    invalid: 'const d = new Date()',
    valid: 'const d = DateTime.now()',
  },
  {
    name: 'no-node-imports',
    group: 'Effect',
    purpose: [
      'Prefer Effect Platform services over direct Node built-ins.',
      'Node 組み込みの直接 import より Effect Platform サービスを優先します。',
    ],
    details: [
      'Checks static imports and re-exports beginning with node:. Whitelists compare exact names after node:, so fs does not implicitly permit fs/promises. Bare fs, dynamic imports and require calls are outside the current listener coverage.',
      'node: で始まる静的 import と再 export を検査します。許可リストは node: の後を完全一致で比較するため、fs は fs/promises を自動許可しません。裸の fs、動的 import、require は現在の対象外です。',
    ],
    invalid: "import { readFile } from 'node:fs/promises'",
    valid: "import { Effect } from 'effect'",
    options: [
      'No options means no node: imports are allowed. Accepts a string array, `{ allow: string[] }`, or `{ allowed: string[] }`; allow and allowed are combined. Example: `["error", { "allow": ["path", "fs/promises"] }]`.',
      '未設定なら node: import は許可しません。文字列配列、`{ allow: string[] }`、`{ allowed: string[] }` を受け付けます。allow と allowed は結合します。例: `["error", { "allow": ["path", "fs/promises"] }]`。',
    ],
  },
  {
    name: 'no-option-tag-comparison',
    group: 'Effect',
    purpose: [
      'Use Option.isSome and Option.isNone instead of comparing _tag.',
      '_tag 比較ではなく Option.isSome と Option.isNone を使います。',
    ],
    details: [
      'Recognizes comparisons against Some and None and supplies a predicate replacement. This is syntax-based, not a type check proving the object is an Option. Ensure the Option identifier is available when accepting the fix.',
      'Some と None の比較を認識し、述語に置き換えます。対象が Option かを証明する型検査ではありません。修正を適用するときは Option 識別子を import してください。',
    ],
    invalid: "if (opt._tag === 'Some') {}",
    valid: 'if (Option.isSome(opt)) {}',
    fixable: true,
  },
  {
    name: 'no-raw-hono-create-middleware',
    group: 'Effect',
    purpose: [
      'Keep Hono middleware creation behind an Effect-aware wrapper.',
      'Hono ミドルウェアの生成を Effect 対応ラッパーに集約します。',
    ],
    details: [
      'Tracks createMiddleware imported directly or with an alias from hono/factory, and namespace-member calls from that module. Use an application-owned wrapper to centralize runtime execution, dependencies and error handling. No wrapper package is supplied by this plugin.',
      'hono/factory から直接または別名で import した createMiddleware と、同モジュールの名前空間メンバー呼び出しを追跡します。アプリケーション側のラッパーに実行・依存・エラー処理を集約してください。このプラグインはラッパーパッケージを提供しません。',
    ],
    invalid:
      "import { createMiddleware } from 'hono/factory'\nconst middleware = createMiddleware((c, next) => next())",
    valid:
      "import { createEffectMiddleware } from './middleware.ts'\nconst middleware = createEffectMiddleware(handler)",
  },
  {
    name: 'no-sync-decode',
    group: 'Effect',
    purpose: [
      'Keep Schema decoding in Effect or Exit rather than Sync or Promise.',
      'Schema のデコードを Sync や Promise ではなく Effect または Exit に保ちます。',
    ],
    details: [
      'Reports Schema.decodeSync, decodePromise, decodeUnknownSync and decodeUnknownPromise calls. Use decodeEffect or decodeUnknownEffect, or decodeExit where appropriate. Other namespace names are ignored.',
      'Schema.decodeSync、decodePromise、decodeUnknownSync、decodeUnknownPromise の呼び出しを報告します。decodeEffect、decodeUnknownEffect、または適切な場合に decodeExit を使います。他の名前空間は対象外です。',
    ],
    invalid: 'Schema.decodeSync(schema)(input)',
    valid: 'Schema.decodeEffect(schema)(input)',
  },
  {
    name: 'no-type-predicate',
    group: 'Effect',
    purpose: [
      'Prefer schema-derived validation to hand-written type predicates.',
      '手書きの型述語より Schema による検証を優先します。',
    ],
    details: [
      'Reports TypeScript type predicate annotations, including arrow and function declarations. Ordinary boolean return annotations are allowed. Use Schema or existing Effect predicates where validation and narrowing need to stay aligned.',
      'アロー関数と関数宣言を含む TypeScript の型述語注釈を報告します。通常の boolean 戻り値は許可します。検証と型絞り込みを一致させるため Schema または既存の Effect 述語を使います。',
    ],
    invalid: 'const isUser = (value: unknown): value is User => true',
    valid: 'const check = (value: unknown): boolean => Boolean(value)',
  },
  {
    name: 'prefer-is-nullish',
    group: 'Effect',
    purpose: [
      'Treat null and undefined uniformly unless the distinction is intentional.',
      '区別が意図的でない限り null と undefined を統一して扱います。',
    ],
    details: [
      'Reports Predicate.isNull, isNotNull, isUndefined and isNotUndefined calls. Prefer isNullish/isNotNullish. If a boundary must distinguish null and undefined, suppress with an explicit reason instead of weakening the shared policy.',
      'Predicate.isNull、isNotNull、isUndefined、isNotUndefined の呼び出しを報告します。isNullish/isNotNullish を使ってください。境界で区別が必要なら共通ポリシーを弱めず、理由付きで抑制します。',
    ],
    invalid: 'if (Predicate.isNull(x)) {}',
    valid: 'if (Predicate.isNullish(x)) {}',
  },
  {
    name: 'prefer-non-unknown-decode',
    group: 'Effect',
    purpose: [
      'Use typed Schema decoders when the input type is already known.',
      '入力型が既知なら型付き Schema デコーダーを使います。',
    ],
    details: [
      'Reports Schema.decodeUnknownEffect and Schema.decodeUnknownExit calls in favor of decodeEffect/decodeExit. The check does not infer the actual input type. Truly unknown external data is a valid reasoned exception.',
      'Schema.decodeUnknownEffect と decodeUnknownExit を報告し、decodeEffect/decodeExit を推奨します。実際の入力型を推論する検査ではありません。真に unknown の外部入力は理由付き例外にできます。',
    ],
    invalid: 'Schema.decodeUnknownEffect(schema)(input)',
    valid: 'Schema.decodeEffect(schema)(input)',
  },
  {
    name: 'require-top-level-decoder',
    group: 'Effect',
    purpose: [
      'Construct and cache schema decoders at module scope.',
      'Schema デコーダーをモジュールスコープで構築・キャッシュします。',
    ],
    details: [
      'Inside any tracked function, reports calls whose non-computed member is Schema.decode* or HttpClientResponse.schema*. Hoist construction and invoke the cached function inside the workflow. The listener matches prefixes and names, not type information.',
      '追跡する関数内で、非 computed の Schema.decode* または HttpClientResponse.schema* 呼び出しを報告します。構築を上位に移し、ワークフロー内ではキャッシュした関数を呼びます。型情報ではなく名前と接頭辞で判定します。',
    ],
    invalid: 'const f = () => Schema.decodeEffect(schema)(input)',
    valid: 'const decode = Schema.decodeEffect(schema)\nconst f = () => decode(input)',
  },
]

export const ruleHeadings = (locale: DocLocale) => [
  { id: 'purpose', title: locale === 'en' ? 'Purpose and behavior' : '目的と動作' },
  { id: 'options', title: locale === 'en' ? 'Options' : 'オプション' },
  { id: 'invalid', title: locale === 'en' ? 'Invalid example' : '違反例' },
  { id: 'valid', title: locale === 'en' ? 'Valid example' : '許可例' },
  { id: 'fixes', title: locale === 'en' ? 'Fixes and exceptions' : '修正と例外' },
  { id: 'source', title: locale === 'en' ? 'Source and tests' : 'ソースとテスト' },
]

export function ruleMarkdown(rule: RuleArticle, locale: DocLocale): string {
  const language = locale === 'en' ? 0 : 1
  const headings = ruleHeadings(locale)
  const section = (index: number) => `## ${headings[index]!.title} {#${headings[index]!.id}}`
  const fence = (code: string) => `\`\`\`tsx\n${code}\n\`\`\``
  const options =
    rule.options?.[language] ??
    (locale === 'en'
      ? 'No configurable options. Enable with `"rules/' + rule.name + '": "error"`.'
      : '設定可能なオプションはありません。`"rules/' + rule.name + '": "error"` で有効化します。')
  const fixes = rule.fixable
    ? locale === 'en'
      ? 'This rule supplies an automatic code fix. Review the resulting import bindings and runtime resolution before applying it.'
      : 'コードの自動修正を提供します。import の束縛と実行時の解決を確認してから適用してください。'
    : locale === 'en'
      ? 'This rule reports diagnostics without an automatic fix. Rewrite the code deliberately rather than guessing its intended semantics.'
      : '診断のみを提供し、自動修正しません。意図を推測せず明示的に書き換えてください。'
  const exception =
    locale === 'en'
      ? 'For a genuine boundary exception, use an `oxlint-disable-next-line rules/' +
        rule.name +
        ' -- reason` comment. Examples illustrate this rule alone and may omit imports and declarations.'
      : '必要な境界例外には `oxlint-disable-next-line rules/' +
        rule.name +
        ' -- 理由` を使います。例はこのルール単体の構文を示し、import や宣言を省略する場合があります。'
  const base = 'https://github.com/totto2727-org/oxlint/blob/main/'
  const source = `src/rules/${rule.name}.ts`
  const status = rule.optIn
    ? locale === 'en'
      ? 'Opt-in compatibility rule. Not enabled by either preset because its import convention conflicts or its diagnostics overlap with the selected default policy.'
      : 'opt-in の互換ルールです。選択した既定ポリシーと import 規約が衝突、または診断が重複するため、どちらのプリセットでも有効化しません。'
    : locale === 'en'
      ? `Enabled by the ${rule.group} preset.`
      : `${rule.group} プリセットで有効です。`
  return [
    section(0),
    rule.purpose[language],
    rule.details[language],
    section(1),
    options,
    section(2),
    fence(rule.invalid),
    section(3),
    fence(rule.valid),
    section(4),
    fixes,
    exception,
    section(5),
    status,
    `[${rule.name}.ts](${base}${source}) · [Tests](${base}src/rules/${rule.name}.test.ts)`,
  ].join('\n\n')
}

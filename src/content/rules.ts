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
      'The rule checks relative paths and # subpath aliases containing a slash in static imports, re-exports and literal dynamic imports. In ts mode, .js/.jsx become .ts/.tsx, .mjs becomes .mts and .cjs becomes .cts. In js mode, .js/.jsx/.ts/.tsx become .js, .mjs/.mts become .mjs and .cjs/.cts become .cjs. Use require-import-extension for missing extensions. The rule ignores asset extensions, bare packages and absolute paths. Fixes preserve query strings, fragments and quotes. Slashless aliases such as #utils are outside its scope.',
      '相対パスと / を含む # サブパスの静的 import、再 export、文字列の動的 import を検査します。ts モードは .js/.jsx を .ts/.tsx、.mjs を .mts、.cjs を .cts に変換します。js モードは .js/.jsx/.ts/.tsx を .js、.mjs/.mts を .mjs、.cjs/.cts を .cjs に変換します。拡張子なしは require-import-extension で検査します。アセット拡張子、パッケージ名、絶対パスは対象外です。修正はクエリ、フラグメント、引用符を保持します。#utils など / のないエイリアスは対象外です。',
    ],
    invalid: "import { foo } from './foo.js'",
    valid: "import { foo } from './foo.ts'",
    fixable: true,
    options: [
      '`{ mode: "ts" }` is the default. Use `{ mode: "js" }` for emitted JavaScript. Example: `["error", { "mode": "js" }]`. These examples use ts mode. Check runtime module resolution before applying fixes.',
      '既定は `{ mode: "ts" }` です。JavaScript 出力には `{ mode: "js" }` を使います。例: `["error", { "mode": "js" }]`。以下は ts モードです。修正前に実行時のモジュール解決を確認してください。',
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
      'The rule reports missing extensions in relative paths and # aliases containing a slash, including directory paths. It checks static imports, re-exports and literal dynamic imports. The rule cannot choose .ts, .tsx or an index filename and provides no fix. It ignores bare packages, absolute paths and slashless aliases such as #utils. It allows explicit asset extensions.',
      '相対パスと / を含む # エイリアスの拡張子なしを、ディレクトリ指定も含めて報告します。静的 import、再 export、文字列の動的 import が対象です。.ts、.tsx、index ファイルを選べないため自動修正しません。パッケージ名、絶対パス、#utils など / のないエイリアスは対象外です。明示的なアセット拡張子は許可します。',
    ],
    invalid: "import { foo } from './foo'",
    valid: "import { foo } from './foo.ts'",
  },
  {
    name: 'force-ts-extension',
    optIn: true,
    group: 'TypeScript',
    options: [
      '`{ mode: "ts" }` is the default. Set `{ mode: "js" }` for JavaScript, as with consistent-import-extension. These examples use ts mode. Check runtime module resolution before applying fixes.',
      '既定は `{ mode: "ts" }` です。consistent-import-extension と同様に、JavaScript には `{ mode: "js" }` を設定します。以下は ts モードです。修正前に実行時のモジュール解決を確認してください。',
    ],
    purpose: [
      'Require extensions and normalize them in ts or js mode.',
      '拡張子を必須とし、ts または js モードで統一します。',
    ],
    details: [
      'The rule reports missing extensions without a fix. It normalizes extensions in ts/js mode like consistent-import-extension, including .mjs/.mts and .cjs/.cts. It checks relative paths and # aliases containing a slash in static imports, re-exports and literal dynamic imports. Slashless aliases such as #utils are outside its scope. Use require-import-extension plus consistent-import-extension instead. Presets omit this compatibility rule to avoid duplicate reports.',
      '拡張子なしは修正せず報告します。consistent-import-extension と同じ ts/js モードで .mjs/.mts と .cjs/.cts も統一します。相対パスと / を含む # エイリアスの静的 import、再 export、文字列の動的 import が対象です。#utils など / のないエイリアスは対象外です。代わりに require-import-extension と consistent-import-extension を使ってください。重複報告を避けるため、この互換ルールはプリセットに含みません。',
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
      'The rule detects eslint-disable, eslint-disable-line and eslint-disable-next-line in line and block comments. Fixes replace the directive name and keep the rule list and reason. Also enable require-disable-reason.',
      '行・ブロックコメントの eslint-disable、eslint-disable-line、eslint-disable-next-line を検出します。修正は名前だけを置換し、ルール一覧と理由を保持します。require-disable-reason も有効にしてください。',
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
      'The rule reports lowercase `<script>` JSX elements but allows components such as `<Script>`. Use your framework’s script integration.',
      '小文字の `<script>` JSX 要素を報告します。`<Script>` などのコンポーネントは許可します。フレームワークの script 統合を使ってください。',
    ],
    invalid: 'const el = <script>alert(1)</script>',
    valid: 'const el = <Script />',
  },
  {
    name: 'no-let',
    group: 'TypeScript',
    purpose: ['Use const bindings instead of let.', 'let ではなく const を使います。'],
    details: [
      'The rule reports each let declaration once, even when it declares multiple variables. The rule ignores var and does not fix reassignment.',
      'let 宣言ごとに1回報告します。複数の変数を含む宣言も同じです。var は対象外で、再代入は自動修正しません。',
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
      'The rule reports plain type-reference aliases without type parameters or arguments. It also reports exported variables whose identifier initializer only renames a value. Local variables and type transformations are outside its scope. Re-export values directly. Give a suppression reason for aliases at an application boundary.',
      '型パラメーターや型引数のない単純な型参照エイリアスを報告します。識別子で初期化して値を改名する export 変数も対象です。ローカル変数と型変換は対象外です。値は直接再 export してください。アプリケーション境界の別名には抑制理由を付けます。',
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
      'The rule reports literal string JSX style attributes, such as style="color:red". The rule does not check strings inside braces or string variables. It allows object expressions and does not validate CSS properties.',
      'style="color:red" のような文字列リテラルの JSX style 属性を報告します。波括弧内の文字列や文字列変数は検査しません。オブジェクト式は許可し、CSS プロパティの妥当性は検査しません。',
    ],
    invalid: "const el = <div style='color: red' />",
    valid: "const el = <div style={{ color: 'red' }} />",
  },
  {
    name: 'require-disable-reason',
    group: 'TypeScript',
    purpose: ['Require a reason for each Oxlint suppression.', 'Oxlint の抑制に例外の理由を必須とします。'],
    details: [
      'The rule requires a non-empty reason after -- in oxlint-disable, oxlint-disable-line and oxlint-disable-next-line comments. A rule list alone does not satisfy the rule. Write the reason yourself.',
      'oxlint-disable、oxlint-disable-line、oxlint-disable-next-line に -- の後の空でない理由を要求します。ルール一覧だけでは不十分です。理由は自分で書いてください。',
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
      'The rule reports .length comparisons with 0 or 1 that test emptiness, including reversed operands. The rule ignores other thresholds, impossible negative checks and always-true checks. It checks syntax, not whether the receiver is an array.',
      '.length と 0 または 1 による空・非空比較を報告します。左右を逆にした比較も対象です。他の閾値、不可能な負数判定、常に真になる判定は対象外です。構文のみを検査し、対象が配列かは判定しません。',
    ],
    invalid: 'if (arr.length === 0) {}',
    valid: 'if (Array.isArrayEmpty(arr)) {}',
  },
  {
    name: 'force-iterable-empty',
    group: 'Effect',
    purpose: [
      'Use Iterable.isEmpty rather than size-based emptiness checks.',
      'size 比較ではなく Iterable.isEmpty を使います。',
    ],
    details: [
      'The rule checks Iterable.size calls compared with 0 or 1 using the force-array-empty criteria. The rule ignores bracket calls, other namespaces and other thresholds. Use !Iterable.isEmpty for non-empty checks.',
      'Iterable.size と 0 または 1 の比較を force-array-empty と同じ基準で検査します。角括弧による呼び出し、他の名前空間、他の閾値は対象外です。非空判定には !Iterable.isEmpty を使います。',
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
      'The rule reports null/undefined equality checks and supported typeof string comparisons. The rule ignores numeric comparisons. With prefer-is-nullish enabled, use Predicate.isNullish or isNotNullish unless you need to distinguish null from undefined.',
      'null/undefined の等値比較と対応する typeof の文字列比較を報告します。数値比較は対象外です。prefer-is-nullish も有効なら、区別が必要な場合以外は Predicate.isNullish または isNotNullish を使います。',
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
      'The rule reports equality and inequality comparisons with an empty string on either side. The rule ignores non-empty string literals and numeric comparisons.',
      '左右どちらかが空文字列の等値・不等値比較を報告します。空でない文字列リテラルと数値比較は対象外です。',
    ],
    invalid: "if (s === '') {}",
    valid: 'if (String.isEmpty(s)) {}',
  },
  {
    name: 'no-effect-import-as',
    optIn: true,
    group: 'Effect',
    purpose: ['Keep Effect imports named and unaliased.', 'Effect の import を名前付き・別名なしにします。'],
    details: [
      'The rule reports namespace imports and renamed named imports from effect and @effect packages. The rule allows direct named imports and does not check other aliases.',
      'effect と @effect パッケージの名前空間 import と別名付きの名前付き import を報告します。直接の名前付き import は許可します。他の別名は検査しません。',
    ],
    invalid: "import * as Effect from 'effect'\nimport { Schema as S } from 'effect'",
    valid: "import { Effect, Schema } from 'effect'",
  },
  {
    name: 'no-effect-runtime-run',
    group: 'Effect',
    purpose: ['Keep runtime execution at documented boundaries.', 'ランタイム実行を理由の明確な境界に限定します。'],
    details: [
      'The rule reports member calls named runCallback, runFork, runMain, runPromise, runPromiseExit or runSync on any receiver. The rule ignores bracket calls but does not exempt top-level entrypoints. Give a suppression reason at execution boundaries. Compose effects elsewhere.',
      '対象名に関係なく runCallback、runFork、runMain、runPromise、runPromiseExit、runSync のメンバー呼び出しを報告します。角括弧による呼び出しは対象外ですが、トップレベルも除外しません。実行境界では理由付きで抑制します。その他では Effect を合成してください。',
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
      'The rule checks static imports and allows effect, @effect/<package> and exactly effect/unstable/<module>. The rule reports deeper unstable paths and other Effect subpaths. It does not check re-exports or dynamic imports.',
      '静的 import を検査します。effect、@effect/<package>、effect/unstable/<module> の深さを許可します。それより深い unstable パスと他の Effect サブパスは報告します。再 export と動的 import は検査しません。',
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
      'The rule reports new Error calls with cause in any object argument. The rule ignores other constructors, including TypeError. Use an application error type that stores the original error without rebuilding its message.',
      'new Error のいずれかのオブジェクト引数に cause があると報告します。TypeError などの他のコンストラクターは対象外です。メッセージを再構築せず、元の error を保持するアプリケーションエラー型を使ってください。',
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
      'The rule reports property access on identifiers named e, error, c, cause or err, including bracket access. The rule checks names inside and outside catch blocks. It ignores other names, so passing does not prove safe error handling.',
      'e、error、c、cause、err のプロパティ参照を報告します。角括弧も対象です。catch 内外で名前を検査します。他の名前は対象外のため、合格はエラー処理の安全性を証明しません。',
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
      'The rule reports fetch(), globalThis.fetch(), window.fetch() and self.fetch(). The rule ignores other client.fetch calls and references without a call. Use HTTP services that preserve typed errors.',
      'fetch()、globalThis.fetch()、window.fetch()、self.fetch() を報告します。他の client.fetch と呼び出しでない参照は対象外です。型付きエラーを保持する HTTP サービスを使ってください。',
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
      'The rule reports instanceof when its right operand is the Error identifier. The rule ignores other constructors, including TypeError. Store unknown caught values unchanged in a structured error field.',
      '右辺が Error 識別子の instanceof を報告します。TypeError などの他のコンストラクターは対象外です。unknown の捕捉値は構造化エラーのフィールドにそのまま保持してください。',
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
      'The rule reports new Date() and Date.now, Date.parse or Date.UTC member access, including references without calls. The rule allows the Date identifier and Date.prototype. Give a suppression reason when an external API requires native Date.',
      'new Date() と Date.now、Date.parse、Date.UTC のメンバー参照を報告します。呼び出しでない参照も対象です。Date 識別子と Date.prototype は許可します。外部 API がネイティブ Date を要求する場合は抑制理由を付けてください。',
    ],
    invalid: 'const d = new Date()',
    valid: 'const d = DateTime.now',
  },
  {
    name: 'no-node-imports',
    group: 'Effect',
    purpose: [
      'Prefer Effect Platform services over direct Node built-ins.',
      'Node 組み込みの直接 import より Effect Platform サービスを優先します。',
    ],
    details: [
      'The rule checks static imports and re-exports beginning with node:. The allowlist matches exact names after node:, so fs does not allow fs/promises. The rule ignores bare fs, dynamic imports and require calls.',
      'node: で始まる静的 import と再 export を検査します。許可リストは node: の後と完全一致で比較します。fs は fs/promises を許可しません。裸の fs、動的 import、require は対象外です。',
    ],
    invalid: "import { readFile } from 'node:fs/promises'",
    valid: "import { Effect } from 'effect'",
    options: [
      'Without options, the rule allows no node: imports. Set a string array, `{ allow: string[] }` or `{ allowed: string[] }`. The rule combines allow and allowed. Example: `["error", { "allow": ["path", "fs/promises"] }]`.',
      '未設定では node: import を許可しません。文字列配列、`{ allow: string[] }`、`{ allowed: string[] }` を指定できます。allow と allowed は結合します。例: `["error", { "allow": ["path", "fs/promises"] }]`。',
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
      'The rule replaces _tag comparisons with Some or None using Option predicates. The rule checks syntax, not whether the object is an Option. Make the Option identifier available before applying the fix.',
      '_tag と Some または None の比較を Option 述語に置き換えます。構文のみを検査し、対象が Option かは判定しません。修正前に Option 識別子を使える状態にしてください。',
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
      'The rule reports named createMiddleware imports from hono/factory, including aliases and unused imports. It also reports namespace-member calls to that function. Use your own wrapper to centralize execution, dependencies and error handling. This plugin does not supply a wrapper.',
      'hono/factory の名前付き createMiddleware import を報告します。別名と未使用 import も対象です。名前空間メンバーによる同関数の呼び出しも報告します。独自のラッパーに実行・依存・エラー処理を集約してください。このプラグインはラッパーを提供しません。',
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
      'The rule reports Schema.decodeSync, decodePromise, decodeUnknownSync and decodeUnknownPromise calls. Use decodeEffect or decodeUnknownEffect, or decodeExit when appropriate. The rule ignores other namespaces.',
      'Schema.decodeSync、decodePromise、decodeUnknownSync、decodeUnknownPromise を報告します。decodeEffect、decodeUnknownEffect、または適切なら decodeExit を使ってください。他の名前空間は対象外です。',
    ],
    invalid: 'Schema.decodeSync(schema)(input)',
    valid: 'Schema.decodeEffect(schema)(input)',
  },
  {
    name: 'no-type-predicate',
    group: 'Effect',
    purpose: [
      'Use Schema validation instead of handwritten type predicates.',
      '手書きの型述語より Schema による検証を優先します。',
    ],
    details: [
      'The rule reports TypeScript type predicate annotations in arrows and function declarations. The rule allows boolean return annotations. Use Schema or existing Effect predicates to keep validation and type narrowing consistent.',
      'アロー関数や関数宣言の TypeScript 型述語注釈を報告します。boolean 戻り値注釈は許可します。検証と型絞り込みを一致させるには Schema または既存の Effect 述語を使ってください。',
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
      'The rule reports Predicate.isNull, isNotNull, isUndefined and isNotUndefined member access, including references without calls. Use isNullish or isNotNullish. Give a suppression reason when a boundary requires the distinction between null and undefined.',
      'Predicate.isNull、isNotNull、isUndefined、isNotUndefined のメンバー参照を報告します。呼び出しでない参照も対象です。isNullish または isNotNullish を使ってください。境界で null と undefined の区別が必要なら抑制理由を付けます。',
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
      'The rule reports Schema.decodeUnknownEffect and Schema.decodeUnknownExit calls. Use decodeEffect or decodeExit. The rule does not infer input types. Give a suppression reason for unknown external data.',
      'Schema.decodeUnknownEffect と Schema.decodeUnknownExit を報告します。decodeEffect または decodeExit を使ってください。入力型は推論しません。unknown の外部入力には抑制理由を付けます。',
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
      'The rule reports Schema.decode* and HttpClientResponse.schema* calls inside tracked functions. The rule matches names and prefixes, not types, and ignores bracket calls. Construct the decoder at module scope. Call the cached decoder inside the workflow.',
      '追跡する関数内の Schema.decode* と HttpClientResponse.schema* 呼び出しを報告します。型ではなく名前と接頭辞で判定します。角括弧による呼び出しは対象外です。モジュールスコープでデコーダーを構築し、ワークフロー内ではキャッシュしたデコーダーを呼んでください。',
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
      ? 'This rule provides automatic fixes. Review each fix before applying it.'
      : '自動修正を提供します。適用前に修正内容を確認してください。'
    : locale === 'en'
      ? 'This rule provides no automatic fix. Rewrite the code to preserve its intended behavior.'
      : '自動修正はありません。意図した動作を保つように書き換えてください。'
  const exception =
    locale === 'en'
      ? 'For a boundary exception, use `oxlint-disable-next-line rules/' +
        rule.name +
        ' -- reason`. Examples cover this rule only and may omit imports or declarations.'
      : '必要な境界例外には `oxlint-disable-next-line rules/' +
        rule.name +
        ' -- 理由` を使います。例はこのルールのみを示し、import や宣言を省略する場合があります。'
  const base = 'https://github.com/totto2727-org/oxlint/blob/main/'
  const source = `src/rules/${rule.name}.ts`
  const status = rule.optIn
    ? locale === 'en'
      ? 'Opt-in compatibility rule. Both presets omit it because its import convention conflicts with their policy or its reports duplicate other rules.'
      : 'opt-in の互換ルールです。import 規約の競合または報告の重複を避けるため、両プリセットに含みません。'
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

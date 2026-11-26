/* oxlint-disable eslint/max-lines -- Keep both translations and examples together for every rule. */
import type { DocLocale } from './locale.ts'

/* oxlint-disable rules/no-readonly -- Preserve the public immutable article contract. */
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

// Keep this inventory in sync with the installed shared preset.
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
      'The rule checks relative paths and # subpath aliases containing a slash in static imports, re-exports and literal dynamic imports. In ts mode, .js/.jsx become .ts/.tsx, .mjs becomes .mts and .cjs becomes .cts. In js mode, .js/.jsx/.ts/.tsx become .js, .mjs/.mts become .mjs and .cjs/.cts become .cjs. Use [require-import-extension](/rules/require-import-extension) for missing extensions. The rule ignores asset extensions, bare packages and absolute paths. Fixes preserve query strings, fragments and quotes. Slashless aliases such as #utils are outside its scope.',
      '相対パスと / を含む # サブパスの静的 import、再 export、文字列の動的 import を検査します。ts モードは .js/.jsx を .ts/.tsx、.mjs を .mts、.cjs を .cts に変換します。js モードは .js/.jsx/.ts/.tsx を .js、.mjs/.mts を .mjs、.cjs/.cts を .cjs に変換します。拡張子なしは [require-import-extension](/rules/require-import-extension) で検査します。アセット拡張子、パッケージ名、絶対パスは対象外です。修正はクエリ、フラグメント、引用符を保持します。#utils など / のないエイリアスは対象外です。',
    ],
    invalid: "import { foo } from './foo.js'",
    valid: "import { foo } from './foo.ts'",
    fixable: true,
    options: [
      '`{ mode: "ts" }` is the default. Use `{ mode: "js" }` for emitted JavaScript. Example: `["error", { "mode": "js" }]`. The import examples below use ts mode. Check runtime module resolution before applying fixes.',
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
      'The rule reports missing extensions in relative paths and # aliases containing a slash, including directory paths. It checks static imports, re-exports and literal dynamic imports. The rule cannot choose .ts, .tsx or an index filename and provides no fix. It ignores bare packages, absolute paths and slashless aliases such as #utils. It allows explicit asset extensions. Use [consistent-import-extension](/rules/consistent-import-extension) to normalize extensions.',
      '相対パスと / を含む # エイリアスの拡張子なしを、ディレクトリ指定も含めて報告します。静的 import、再 export、文字列の動的 import が対象です。.ts、.tsx、index ファイルを選べないため自動修正しません。パッケージ名、絶対パス、#utils など / のないエイリアスは対象外です。明示的なアセット拡張子は許可します。拡張子の統一には [consistent-import-extension](/rules/consistent-import-extension) を使います。',
    ],
    invalid: "import { foo } from './foo'",
    valid: "import { foo } from './foo.ts'",
  },
  {
    name: 'effect-tracing',
    group: 'Effect',
    options: [
      'Set `["error", "application"]` or `["error", "library"]`. The application and library presets set their respective modes. The shared preset leaves the mode unset. Without a mode, only the `Effect.gen` check runs.',
      '`["error", "application"]` または `["error", "library"]` を指定します。application と library の各プリセットは対応するモードを設定します。共通プリセットではモードを設定しません。未指定では `Effect.gen` のみを検査します。',
    ],
    purpose: ['Keep tracing in the application.', 'トレースをアプリケーション側に集約します。'],
    details: [
      'Keep `Effect.gen` generator callbacks anonymous in every mode. Applications use `Effect.fn`. The application mode reports `Effect.fnUntraced` and `Effect.fnUntracedEager`. Libraries use `Effect.fnUntraced`. The library mode reports `Effect.withSpan` and `Effect.withSpanScoped`.',
      'どのモードでも `Effect.gen` のジェネレーターコールバックは無名にします。アプリケーションでは `fnUntraced` や `fnUntracedEager` の代わりに `Effect.fn` を使います。ライブラリーでは `fn` の代わりに `fnUntraced` を使い、`withSpan` と `withSpanScoped` はアプリケーションに任せます。',
    ],
    invalid: "import { Effect } from 'effect'\nEffect.gen(function* load() {})",
    valid: "import { Effect } from 'effect'\nEffect.gen(function* () {})",
  },
  {
    name: 'no-eslint-disable-comments',
    group: 'TypeScript',
    purpose: [
      'Use Oxlint suppression directives instead of ESLint directives.',
      'ESLint ではなく Oxlint の抑制コメントを使います。',
    ],
    details: [
      'The rule detects eslint-disable, eslint-disable-line and eslint-disable-next-line in line and block comments. Fixes replace the directive name and keep the rule list and reason. To require a reason for each suppression, also enable [require-disable-reason](/rules/require-disable-reason).',
      '行・ブロックコメントの eslint-disable、eslint-disable-line、eslint-disable-next-line を検出します。修正は名前だけを置換し、ルール一覧と理由を保持します。各抑制に理由を必須にするには、[require-disable-reason](/rules/require-disable-reason) も有効にします。',
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
      'The rule reports lowercase `<script>` JSX elements. It allows components such as `<Script>`. Use your framework’s script integration.',
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
      'The rule reports each `let` declaration once. It ignores `var`. If you reassign a variable, refactor the code or give a reason for an exception.',
      '`let` 宣言ごとに1回報告します。`var` は対象外です。再代入する変数がある場合は、コードを書き換えるか、例外の理由を書いてください。',
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
    valid: "export { sendParams as sentEmail } from './send.ts'\ntype SentEmail = { id: string }",
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
    name: 'no-index-filename',
    group: 'TypeScript',
    purpose: ['Give modules descriptive filenames.', 'モジュールの内容が分かるファイル名を使います。'],
    details: [
      'Checks the basename, not the source text. Only `index.ts` and `index.tsx` are reported. Rename the file and update its importers.',
      'ソース本文ではなくファイル名を検査します。`index.ts` と `index.tsx` だけを報告します。ファイル名を変え、参照元の import を更新してください。',
    ],
    invalid: '// Filename: src/feature/index.ts\nexport const feature = true',
    valid: '// Filename: src/feature.ts\nexport const feature = true',
  },
  {
    name: 'no-local-export-list',
    group: 'TypeScript',
    purpose: ['Export bindings at their declarations.', '宣言箇所でバインディングを export します。'],
    details: [
      'Reports nonempty export lists without `from`, including type exports and previously imported bindings. Use `export` on local declarations or re-export directly from another module. Empty `export {}` is allowed.',
      '型や import 済みのバインディングも含め、`from` のない空でない export リストを報告します。ローカル宣言に `export` を付けるか、別モジュールから直接再 export します。空の `export {}` は許可します。',
    ],
    invalid: 'const limit = 10\nexport { limit }',
    valid: 'export const limit = 10',
  },
  {
    name: 'require-vitest-hooks',
    group: 'TypeScript',
    purpose: ['Run shared test setup and cleanup in hooks.', 'テスト共通の準備と後片付けをフックで実行します。'],
    details: [
      'Checks standalone expressions at test module scope and in suite callback blocks. Recognizes imports from `vitest`, `vite-plus/test`, and `@effect/vitest`. Test, suite, hook, and mock registrations are allowed. Keep per-test values inside tests.',
      'テストモジュールの直下とスイートコールバックのブロック内で、単独の式を検査します。`vitest`、`vite-plus/test`、`@effect/vitest` の import を認識します。テスト、スイート、フック、モックの登録は許可します。テストごとの値はテスト内に置きます。',
    ],
    invalid: "import { test } from 'vitest'\nresetDb()\ntest('reads data', run)",
    valid: "import { beforeEach, test } from 'vitest'\nbeforeEach(resetDb)\ntest('reads data', run)",
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
    valid: "import { Array } from 'effect'\nif (Array.isArrayEmpty(arr)) {}",
  },
  {
    name: 'force-iterable-empty',
    group: 'Effect',
    purpose: [
      'Use Iterable.isEmpty rather than size-based emptiness checks.',
      'size 比較ではなく Iterable.isEmpty を使います。',
    ],
    details: [
      'The rule checks Iterable.size calls compared with 0 or 1 using the [force-array-empty](/rules/force-array-empty) criteria. The rule ignores bracket calls, other namespaces and other thresholds. Use `!Iterable.isEmpty(xs)` for a non-empty check.',
      'Iterable.size と 0 または 1 の比較を [force-array-empty](/rules/force-array-empty) と同じ基準で検査します。角括弧による呼び出し、他の名前空間、他の閾値は対象外です。非空判定には `!Iterable.isEmpty(xs)` を使います。',
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
    valid: "import { String } from 'effect'\nif (String.isEmpty(s)) {}",
  },
  {
    name: 'no-effect-import-as',
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
    group: 'Effect',
    purpose: [
      'Prefer public Effect package roots over deep subpaths.',
      'Effect の深いサブパスではなく公開パッケージルートを使います。',
    ],
    details: [
      'Use `effect`, an `@effect/<package>` root, or a [category entry](https://github.com/totto2727-org/oxlint/blob/bed13483292d75318f9ca01e124aa666edaa8202/src/rules/no-effect-subpath-import.ts#L7-L17) such as `effect/http` or `effect/unstable/cli`. The rule reports other Effect paths except `effect/schema/SchemaJITCompiler/enable`. It ignores re-exports and dynamic imports.',
      '`effect`、`@effect/<package>` のルート、または `effect/http` や `effect/unstable/cli` のような[カテゴリ](https://github.com/totto2727-org/oxlint/blob/bed13483292d75318f9ca01e124aa666edaa8202/src/rules/no-effect-subpath-import.ts#L7-L17)を使います。それ以外の Effect のパスは `effect/schema/SchemaJITCompiler/enable` を除いて報告します。再 export と動的 import は対象外です。',
    ],
    invalid: "import { Schema } from 'effect/Schema'",
    valid: "import { Schema } from 'effect'",
  },
  {
    name: 'no-optional-error-cause',
    group: 'Effect',
    purpose: [
      'Make a tagged error’s cause required if the error declares one.',
      'タグ付きエラーで cause を宣言する場合は必須にします。',
    ],
    details: [
      'Reports optional `cause` fields on recognized Effect Data and Schema tagged error classes. This includes `cause?` in types or class bodies and Schema fields using `optional` or `optionalKey`. It does not check native error constructor options.',
      '認識できる Effect Data と Schema のタグ付きエラークラスで、オプションの `cause` フィールドを報告します。型やクラス本体の `cause?` と、`optional` や `optionalKey` を使う Schema フィールドが対象です。ネイティブエラーのコンストラクター引数は検査しません。',
    ],
    invalid: "import { Data } from 'effect'\nclass Failure extends Data.TaggedError('Failure')<{ cause?: unknown }> {}",
    valid: "import { Data } from 'effect'\nclass Failure extends Data.TaggedError('Failure')<{ cause: unknown }> {}",
  },
  {
    name: 'no-error-property-access',
    group: 'Effect',
    purpose: [
      'Pass raw error values through without inspecting their properties.',
      '生のエラーのプロパティを参照せず、そのまま渡します。',
    ],
    details: [
      'Reports dot or bracket access on a `catch` binding or the first `catch` callback parameter in a recognized `Effect.try` or `Effect.tryPromise` call. It tracks bindings, not names. Keep the original value as a tagged error’s `cause`.',
      '`catch` のバインディング、または認識できる `Effect.try` と `Effect.tryPromise` の `catch` コールバックの第1引数に対するドット参照と角括弧参照を報告します。名前ではなくバインディングを追跡します。元の値はタグ付きエラーの `cause` に保持します。',
    ],
    invalid: 'try { load() } catch (cause) { log(cause.message) }',
    valid: 'try { load() } catch (cause) { throw new ConfigFileError({ cause }) }',
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
      'The rule reports new Date() and Date.now, Date.parse or Date.UTC member access, including references without calls. The rule allows the Date identifier and Date.prototype. If an external API requires native Date, give a suppression reason.',
      'new Date() と Date.now、Date.parse、Date.UTC のメンバー参照を報告します。呼び出しでない参照も対象です。Date 識別子と Date.prototype は許可します。外部 API がネイティブ Date を要求する場合は抑制理由を付けてください。',
    ],
    invalid: 'const d = new Date()',
    valid:
      "import { DateTime, Effect } from 'effect'\n\nconst renderDate = Effect.gen(function* () {\n  const date = yield* DateTime.now\n  return DateTime.formatIso(date)\n})",
  },
  {
    name: 'no-raw-crypto',
    group: 'Effect',
    purpose: ['Use Effect services for cryptography.', '暗号処理には Effect のサービスを使います。'],
    details: [
      'The rule reports direct use of the global Web Crypto API and runtime imports of Node crypto. Use the services in effect/crypto for hashing, signing and secure randomness. Supply the implementation at the runtime boundary.',
      'グローバルな Web Crypto API の直接利用と、Node crypto の実行時 import を報告します。ハッシュ、署名、暗号学的乱数には effect/crypto のサービスを使い、実行境界で実装を供給します。',
    ],
    invalid: "import { randomUUID } from 'node:crypto'\nconst id = randomUUID()",
    valid:
      "import { Effect } from 'effect'\nimport { SecureRandom } from 'effect/crypto'\nconst id = Effect.gen(function* () {\n  const random = yield* SecureRandom.SecureRandom\n  return yield* random.uuidV4()\n})",
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
    valid: "import { FileSystem } from 'effect'",
    options: [
      'Without options, the rule allows no node: imports. Set a string array, `{ allow: string[] }` or `{ allowed: string[] }`. The rule combines allow and allowed. Example: `["error", { "allow": ["path", "fs/promises"] }]`.',
      '未設定では node: import を許可しません。文字列配列、`{ allow: string[] }`、`{ allowed: string[] }` を指定できます。allow と allowed は結合します。例: `["error", { "allow": ["path", "fs/promises"] }]`。',
    ],
  },
  {
    name: 'no-direct-tag-access',
    group: 'Effect',
    purpose: [
      'Use predicates or pattern matching instead of reading `_tag`.',
      '`_tag` の直接参照ではなく述語やパターンマッチを使います。',
    ],
    details: [
      'Reports dot and literal bracket access, optional chaining, destructuring, and `"_tag" in value`. It checks syntax, not receiver types. Use Option, Result, or Exit predicates, or `Match.tag` for domain values.',
      'ドット参照、リテラルの角括弧参照、オプショナルチェーン、分割代入、`"_tag" in value` を報告します。型ではなく構文を検査します。Option、Result、Exit の述語や、ドメイン値に対する `Match.tag` を使ってください。',
    ],
    invalid: "if (opt._tag === 'Some') {}",
    valid: 'if (Option.isSome(opt)) {}',
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
      'Reports TypeScript type predicate syntax, including `value is User` and `asserts value`. A `boolean` return annotation is allowed. Use `Schema.is` if you need validation and type narrowing.',
      '`value is User` や `asserts value` などの TypeScript の型述語構文を報告します。戻り値の `boolean` 注釈は許可します。検証と型の絞り込みが必要なら `Schema.is` を使います。',
    ],
    invalid: 'const isUser = (value: unknown): value is User => true',
    valid: 'const isUser = Schema.is(User)',
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
      'Use typed Schema decoders for input that matches the encoded type.',
      '入力の型が Schema のエンコード型に適合する場合は、型付きデコーダーを使います。',
    ],
    details: [
      'The rule reports Schema.decodeUnknownEffect and Schema.decodeUnknownExit calls. If the input type matches the schema’s encoded type, use decodeEffect or decodeExit. The rule does not infer types. For unknown external data, give a suppression reason.',
      'Schema.decodeUnknownEffect と Schema.decodeUnknownExit を報告します。入力の型が Schema のエンコード型に適合する場合は、decodeEffect または decodeExit を使ってください。型は推論しません。unknown の外部入力には抑制理由を付けます。',
    ],
    invalid: "Schema.decodeUnknownEffect(Schema.String)('ready')",
    valid: "Schema.decodeEffect(Schema.String)('ready')",
  },
  {
    name: 'no-for-loops',
    group: 'Effect',
    purpose: [
      'Use collection or Effect combinators for iteration.',
      '反復処理にはコレクションや Effect のコンビネーターを使います。',
    ],
    details: [
      'The rule reports classic `for`, `for...of`, `for await...of`, and `for...in`, but not `while`. Use Array or Iterable combinators for synchronous iteration, `Effect.forEach` for effects, or `Stream.runForEach` for streams. Use `Object.keys` or `Object.entries` for own properties.',
      '通常の `for`、`for...of`、`for await...of`、`for...in` を報告します。`while` は対象外です。同期処理には Array や Iterable、Effect の反復には `Effect.forEach`、ストリームには `Stream.runForEach` を使います。オブジェクト自身のプロパティには `Object.keys` や `Object.entries` を使います。',
    ],
    invalid: 'for (const value of values) visit(value)',
    valid: "import { Iterable } from 'effect'\n\nIterable.forEach(values, visit)",
  },
  {
    name: 'no-readonly',
    group: 'Effect',
    purpose: ['Derive immutable data types from Effect Schema.', 'Effect Schema から不変データ型を導出します。'],
    details: [
      'Reports `readonly` on class and type members, constructor parameter properties, mapped types (including `-readonly`), and array or tuple type operators. It does not report the `Readonly<T>` utility type.',
      'クラスや型のメンバー、コンストラクターのパラメータープロパティ、マップ型（`-readonly` を含む）、配列やタプルの型演算子に使う `readonly` を報告します。ユーティリティー型 `Readonly<T>` は対象外です。',
    ],
    invalid: 'type User = { readonly name: string }',
    valid: 'const UserSchema = Schema.Struct({ name: Schema.String })\ntype User = typeof UserSchema.Type',
  },
  {
    name: 'prefer-schema-format-validation',
    group: 'Effect',
    purpose: ['Put input format checks in a named Schema.', '入力形式の検査を名前付き Schema にまとめます。'],
    details: [
      'Reports regex literal `.test()` checks in `if` guards that throw or use `return yield* new …`. It also recognizes negation and `||`, but not a regex stored in a variable. Keep related length or range constraints in the same schema.',
      '例外を投げるか `return yield* new …` を実行する `if` ガードで、正規表現リテラルの `.test()` を報告します。否定と `||` も認識しますが、変数に格納した正規表現は対象外です。関連する長さや範囲の制約も同じ Schema に置きます。',
    ],
    invalid: 'if (!/^[a-z]+$/u.test(input)) throw new InvalidInput()',
    valid:
      'const Slug = Schema.String.check(Schema.isPattern(/^[a-z]+$/u))\nconst decodeSlug = Schema.decodeUnknownEffect(Slug)',
  },
  {
    name: 'require-tagged-data',
    group: 'Effect',
    purpose: [
      'Use Effect constructors to define tagged data.',
      'タグ付きデータは Effect のコンストラクターで定義します。',
    ],
    details: [
      'Reports hand-written `_tag` keys in objects, classes, and type members, including literal brackets. Use `Data.TaggedClass`, `Data.taggedEnum`, `Schema.TaggedClass`, or `Schema.TaggedStruct` to generate the tag.',
      'オブジェクト、クラス、型のメンバーで手書きした `_tag` キーを報告します。リテラルの角括弧も対象です。`Data.TaggedClass`、`Data.taggedEnum`、`Schema.TaggedClass`、`Schema.TaggedStruct` でタグを生成します。',
    ],
    invalid: "type State = { _tag: 'Ready'; value: string }",
    valid: "class Ready extends Data.TaggedClass('Ready')<{ value: string }> {}",
  },
  {
    name: 'require-tagged-error',
    group: 'Effect',
    purpose: [
      'Define domain errors with tagged error constructors.',
      'ドメインエラーにはタグ付きエラーのコンストラクターを使います。',
    ],
    details: [
      'Reports calls to, construction of, and subclassing of built-in errors and recognized Effect `Data.Error` imports. It does not report shadowed built-in names or ambient class declarations. Use `Data.TaggedError` or `Schema.TaggedErrorClass`.',
      '組み込みエラーと認識できる Effect の `Data.Error` に対し、呼び出し、インスタンス生成、継承を報告します。ローカル宣言で隠れた組み込み名やアンビエントクラス宣言は対象外です。`Data.TaggedError` や `Schema.TaggedErrorClass` を使います。',
    ],
    invalid: "throw new Error('Invalid input')",
    valid:
      "class InvalidInput extends Data.TaggedError('InvalidInput')<{ message: string }> {}\nEffect.fail(new InvalidInput({ message: 'Invalid input' }))",
  },
  {
    name: 'require-top-level-decoder',
    group: 'Effect',
    purpose: [
      'Construct and cache schema decoders at module scope.',
      'Schema デコーダーをモジュールスコープで構築・キャッシュします。',
    ],
    details: [
      'The rule reports Schema.decode* and HttpClientResponse.schema* calls inside tracked functions. The rule matches names and prefixes, not types. It checks function declarations, function expressions, and arrow functions. Bracket notation, such as `Schema["decodeEffect"]`, is outside its scope. Create the decoder at module scope and call it in the function.',
      '追跡する関数内の Schema.decode* と HttpClientResponse.schema* 呼び出しを報告します。型ではなく名前と接頭辞で判定します。関数宣言、関数式、アロー関数を検査します。`Schema["decodeEffect"]` のような角括弧による呼び出しは対象外です。モジュールスコープでデコーダーを構築し、関数内で呼び出してください。',
    ],
    invalid: 'const f = () => Schema.decodeEffect(schema)(input)',
    valid: 'const decode = Schema.decodeEffect(schema)\nconst f = () => decode(input)',
  },
]

/* oxlint-enable rules/no-readonly */

export const ruleHeadings = (locale: DocLocale): { id: string; title: string }[] => [
  { id: 'purpose', title: locale === 'en' ? 'Purpose and behavior' : '目的と動作' },
  { id: 'options', title: locale === 'en' ? 'Options' : 'オプション' },
  { id: 'invalid', title: locale === 'en' ? 'Invalid example' : '違反例' },
  { id: 'valid', title: locale === 'en' ? 'Valid example' : '許可例' },
  { id: 'fixes', title: locale === 'en' ? 'Fixes and exceptions' : '修正と例外' },
  { id: 'source', title: locale === 'en' ? 'Source and tests' : 'ソースとテスト' },
]

const fence = (code: string): string => `\`\`\`tsx\n${code}\n\`\`\``
const sourceBase = 'https://github.com/totto2727-org/oxlint/blob/b4038e28d70dcc8fb35ea10526619577390e9acc/src/rules/'

const languageIndex = { en: 0, ja: 1 } as const
const filenameException = [
  'The rule reports line 1. If a tool requires this filename, turn off the rule for that path in your Oxlint config.',
  '1行目に報告されます。ツールがこのファイル名を要求する場合は、Oxlint の設定でそのパスだけルールを無効にしてください。',
] as const

const ruleFixes = (rule: RuleArticle, locale: DocLocale): string => {
  const language = languageIndex[locale]
  const fixed = [
    'Review the automatic fix before applying it.',
    '自動修正を適用する前に、修正内容を確認してください。',
  ] as const
  const manual = ['No automatic fix.', '自動修正はありません。'] as const
  const fixes = (rule.fixable === true ? fixed : manual)[language]
  if (rule.name === 'require-disable-reason') {
    return fixes
  }
  if (rule.name === 'no-index-filename') {
    return `${fixes}\n\n${filenameException[language]}`
  }
  const exception =
    locale === 'en'
      ? `Add \`// oxlint-disable-next-line rules/${rule.name} -- reason\` above the diagnostic line. Explain the exception in \`reason\`.`
      : `例外が必要な行の直前に \`// oxlint-disable-next-line rules/${rule.name} -- 理由\` を書き、\`理由\` を具体的な説明に置き換えてください。`
  return `${fixes}\n\n${exception}`
}

export const ruleMarkdown = (rule: RuleArticle, locale: DocLocale): string => {
  const language = languageIndex[locale]
  const options =
    rule.options?.[language] ??
    (locale === 'en'
      ? `No configurable options. Enable with \`"rules/${rule.name}": "error"\`.`
      : `設定可能なオプションはありません。\`"rules/${rule.name}": "error"\` で有効化します。`)
  const exampleNote =
    locale === 'en'
      ? 'Examples cover this rule only. They may omit imports or declarations.'
      : '例はこのルールのみを示します。import や宣言を省略する場合があります。'
  const source = `[${rule.name}.ts](${sourceBase}${rule.name}.ts) · [Tests](${sourceBase}${rule.name}.test.ts)`
  const sections = [
    rule.details[language],
    options,
    `${exampleNote}\n\n${fence(rule.invalid)}`,
    fence(rule.valid),
    ruleFixes(rule, locale),
    source,
  ]
  return ruleHeadings(locale)
    .map(({ id, title }, index) => `## ${title} {#${id}}\n\n${sections[index] ?? ''}`)
    .join('\n\n')
}

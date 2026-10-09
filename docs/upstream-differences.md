# Documentation-shell reuse and differences

## Reviewed baseline

Reference repository: <https://github.com/totto2727-org/effront>.
Reviewed source revision: `b561905cd773363a8d834ecf1a8279d551eee379`.
Source application: `app/docs` at that revision.
Published runtime packages: `@effront/core`, `@effront/markdown`, `@effront/vite`, `@effront/tailwind`, and `@effront/alchemy`, all version `0.3.1` from npm.
No Effront runtime source is vendored or patched by this repository.
The source Effront repository is read-only during site work.

## Reused areas

- `src/components/docs-shell.tsx`: same persistent shell, sidebar filtering, breadcrumb, locale switcher, no-JavaScript navigation, previous/next links and table of contents. Only product name, tagline and footer destination change.
- `src/components/ui/`, `src/lib/utils.ts` and `src/styles.css`: same responsive sidebar, primitives, theme tokens, prose styles, code and mobile behavior. Formatting follows this repository's Vite+ policy.
- `src/components/code-block*` and `src/components/markdown-alert*`: same reusable components and rendering tests.
- `src/response-cache.ts` and its unit tests: same status/method/Accept opt-in policy, private fallback, browser revalidation, long-lived CDN headers and `Vary: accept` handling.
- `src/content/markdown.tsx`: same `createMarkdownCollection` → `parseMarkdown` → `MarkdownDocument` server pipeline, scrollable code component, alert components, and localized prose links.
- `tests/vite.config.ts`, `tests/playwright.config.ts` and cache acceptance: same authentication-free local Cloudflare-runtime host pattern, with site identity and tested content URLs adapted.

## Site-specific differences

All Effront consumer articles, implementation excerpts, architecture baselines and excerpt-comparison tests are excluded.
Oxlint rule descriptions, options, syntax fixtures, installation steps and presets replace that content.
`src/content/rules.ts` authors English and Japanese rule prose together; `documents.ts` constructs deterministic Markdown documents without reading source files, Git or network at render time.
`catalog.ts` keeps route/navigation metadata and stable heading IDs aligned across locales.
`entry.effront.tsx` registers each authored route explicitly to retain framework collision checks and native 404 behavior.
Root documents and local acceptance tests are specific to this standalone application.
The dependency manifest retains exact published Effront `0.3.1` packages and no workspace links, while Effect and its platform packages use stable `^4.0.1` ranges and Vite Plus and the Vite core alias use `^1.0.0`.
Effect imports use the stable `effect/http` module path, and published dependency metadata resolves to one Effect version without overrides.
Vite Plus task inputs and outputs are nested under `cache` per the [run configuration](https://viteplus.dev/config/run), preserving [automatic tracking](https://viteplus.dev/guide/automatic-data-tracking) and local build output restoration.
The development-only Nix overlay is pinned at `af16f6183aec0717d8975ee858c910ab43babee6` for the stable Vite Plus `1.0.0` global CLI, independently of the local `^1.0.0` toolchain.
These are documentation-application dependency and configuration adaptations against the same reviewed baseline.
Alchemy and its Cloudflare runtime use `2.0.0-beta.81`, whose published dependency metadata supports stable Effect 4, rather than the reference's prerelease-Effect runtime.
The template's bootstrap CLI, npm launcher and native Nix package are replaced with site compilation and a development-only Nix shell because they were not documentation hosts.
Application publication workflows remain disabled.
The Alchemy stack and deployment workflow reuse Effront's Cloudflare-backed state/provider architecture, with independent oxlint-docs identity and a production-only oxlint.totto2727.dev custom domain.
Unlike the reference's branch preview workflow, this application deploys main only, validates before deployment and checks published content afterward.

## Published Effront compatibility

Official npm `latest` metadata on 2026-10-09 identifies all five Effront packages as `0.3.1`.
Published metadata: [core](https://www.npmjs.com/package/@effront/core/v/0.3.1), [markdown](https://www.npmjs.com/package/@effront/markdown/v/0.3.1), [vite](https://www.npmjs.com/package/@effront/vite/v/0.3.1), [tailwind](https://www.npmjs.com/package/@effront/tailwind/v/0.3.1) and [alchemy](https://www.npmjs.com/package/@effront/alchemy/v/0.3.1).
The published artifacts include the stable Effect module paths and compatible dependency metadata that previously required local patches for `0.2.0`.
All three compatibility patches and their pnpm and Bun registrations are removed.
No dependency overrides are required: the dependency graph resolves Effect and its platform packages to `4.0.1`, React and React DOM to `19.3.0`, and Vite peers to the application's direct Vite Plus core alias.
The installation remains registry-based and reproducible, without local file links, workspace dependencies or package publication.
The unpatched packages pass the local formatting, lint, type, unit, build and browser acceptance tasks.
The original Effront source comparison and attribution remain intact.

## Official Effect rule documentation

Five rule descriptions reference the official Effect Oxc sources at [b1d200c40a1dad69def51ebdbf0a1a612a12b8ac](https://github.com/Effect-TS/effect/tree/b1d200c40a1dad69def51ebdbf0a1a612a12b8ac/packages/tools/oxc/src/oxlint/rules).
Only the library vendors those MIT rule implementations. This site contains authored prose and syntax fixtures, not vendored compiler/plugin runtime sources.
Four upstream rules are enabled by the Effect preset. The overlapping no-js-extension-imports and two legacy opposite import-convention rules remain opt-in.
The scanner's packages/**/src .ts scope and process-lifetime cache are documented, rather than promising unsupported flat-src coverage.
See THIRD-PARTY-NOTICES.md for attribution.

## Ultracite baseline documentation

The library presets use a pinned MIT port of the native core configuration and shared ignores from [Ultracite 7.12.3](https://www.npmjs.com/package/ultracite/v/7.12.3), corresponding to its upstream `ultracite/oxlint/core` export.
The library includes only these native settings, not the full Ultracite CLI package or unused CLI transitive dependencies.
This scoped port avoids the CLI dependency advisory found by the library audit without changing the native baseline policy, and the consumer runs directly with Oxlint.
Verified package gitHead/source comparison revision: `48156546701badf2c6e60f25cf1e8511f7dc44c7`.
Direct references: [core configuration](https://github.com/haydenbleasel/ultracite/blob/48156546701badf2c6e60f25cf1e8511f7dc44c7/packages/cli/config/oxlint/core/index.mjs) and [official provider documentation](https://github.com/haydenbleasel/ultracite/blob/48156546701badf2c6e60f25cf1e8511f7dc44c7/apps/docs/docs/provider/oxlint.mdx).
Native rule counts are not frozen in site prose because package/runtime-enabled counts include different scopes and can change.
This site documents that configuration and the library's conflict adjustments, without adding Ultracite as a site dependency or vendoring its source.
Both groups retain shared native settings/ignores but discard all upstream file overrides, with no test-only exemptions.
The library-owned generated **/*.gen.ts no-redundant-alias allowance remains.
The native prefer-bigint-literals, preserve-caught-error and prefer-const rules are explicitly off in both groups for compatibility and duplicate-diagnostic avoidance.
React/type-aware presets, JavaScript plugins, oxfmt integration and CLI replacement remain separate opt-in choices.
This is authored policy documentation, not an additional site lint/formatter migration.

## Operational impact

Run `vp run dev`, `build` and `preview` against the local host configuration.
The copied Worker enables the same native Workers cache integration, but local checks validate origin policy only, not managed CDN hit rates or version isolation.
Public docs are not personalized, including requests carrying cookies or authorization headers.
Do not add user-specific content behind this public-cache middleware.
Keep source-specific rule behavior synchronized with the library without editing the library from this repository.

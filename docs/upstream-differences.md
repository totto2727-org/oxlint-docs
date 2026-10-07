# Documentation-shell reuse and differences

## Reviewed baseline

Reference repository: <https://github.com/totto2727-org/effront>.
Reviewed source revision: `b561905cd773363a8d834ecf1a8279d551eee379`.
Source application: `app/docs` at that revision.
Published runtime packages: `@effront/core`, `@effront/markdown`, `@effront/vite`, `@effront/tailwind`, and `@effront/alchemy`, all version `0.2.0` from npm.
No Effront runtime source is vendored or changed by this repository.
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
Rules navigation and articles contain 29 locally authored policies, grouped into TypeScript and Effect. Presets navigation separately describes external policy provenance and conflict adjustments.
The entry adds a global HTTP middleware using the reference site's retired-article redirect pattern. GET/HEAD requests for the five retired external-rule article paths receive 308 redirects to the locale-matched Effect preset's official-effect section, preserving queries for both HTML and Flight.
This is documentation-route customization only. The reused shell, styles, cache policy and upstream Effront runtime source are unchanged.
Root documents and local acceptance tests are specific to this standalone application.
The dependency manifest has exact current Effront catalog pins, published Effront packages and no workspace links.
The template's bootstrap CLI, npm launcher and native Nix package are replaced with site compilation and a development-only Nix shell because they were not documentation hosts.
Application publication workflows remain disabled.
The Alchemy stack and deployment workflow reuse Effront's Cloudflare-backed state/provider architecture, with independent oxlint-docs identity and a production-only oxlint.totto2727.dev custom domain.
Unlike the reference's branch preview workflow, this application deploys main only, validates before deployment and checks published content afterward.

## Official Effect rule documentation

The Effect preset page references the official Effect Oxc sources at [b1d200c40a1dad69def51ebdbf0a1a612a12b8ac](https://github.com/Effect-TS/effect/tree/b1d200c40a1dad69def51ebdbf0a1a612a12b8ac/packages/tools/oxc/src/oxlint/rules), listing inclusions and a concise disabled-rule reason instead of reproducing external rule details.
Only the library vendors those MIT implementations and adapts them to its own rules/ namespace. The upstream tools package is private, not a separately installed npm plugin. This site contains no vendored compiler/plugin runtime sources.
Four upstream rules are enabled by the Effect preset. no-js-extension-imports remains exported but explicitly off in all presets because it overlaps the local extension family, including mjs/cjs, and conflicts with js mode.
The local no-effect-import-as/no-effect-subpath-import compatibility rules retain detail pages but remain opt-in because they impose the opposite import convention.
The plugin API retains 34 exported rules, but only 29 are locally authored. The site's reference follows policy authorship, not namespace or adapter count.
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

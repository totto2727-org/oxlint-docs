# oxlint-docs

## Scope and boundaries

Own this standalone documentation application only.
`package/effront/app/docs` and `package/oxlint/src` are read-only references.
Production deployment is explicitly configured for oxlint.totto2727.dev with Alchemy/Cloudflare.
Do not change unrelated cloud resources, publish this application to npm, or commit credentials.
Keep application npm/FlakeHub publication workflows disabled.
Read [reuse and differences](docs/upstream-differences.md) before changing copied shell or cache behavior.
Do not create `CLAUDE.md`.

## File layout

- `src/entry.effront.tsx`: explicit routes, persistent shared layout, article metadata and public cache middleware.
- `src/entry.workers.ts`: same Effront/Alchemy Worker entry and native cache opt-in as the reference site.
- `src/components/`, `src/lib/utils.ts`, `src/styles.css`: reused shell, UI primitives, highlighting, alerts and exact theme tokens.
- `src/content/rules.ts`: bilingual authored rule purpose, behavior, options, invalid/valid fixtures, fixes and source links.
- `src/content/documents.ts`: deterministic server-side Markdown corpus for rules and guides.
- `src/content/catalog.ts`, `en/catalog.ts`, `index.ts`, `locale.ts`: typed metadata and localized navigation, without cross-language fallback.
- `src/content/markdown.tsx`: shared Effront Markdown collection/parser/document renderer.
- `src/response-cache.ts`: public-doc-only origin cache headers, with reusable unit tests.
- `tests/`: real local site browser and cache acceptance, without cloud authentication.
- `vite.config.ts`: all task entrypoints, formatting, lint, type checking and test policy.
- `flake.nix`: pinned development shell. No obsolete CLI package or executable is exported.
- `pnpm-lock.yaml`, `bun.lock`, `bun.nix`: installation lock and mirrored Bun/Nix dependency sources.

## Development

Run commands from this repository root inside `nix develop`.
Install with `vp install --frozen-lockfile`.
`vp run dev` starts the authentication-free host on 127.0.0.1:1339.
`vp run build` compiles the Worker and assets into `dist/`; `vp run preview` serves that build locally.
`vp run fix` applies Vite+ formatting and lint fixes.
`vp run ci` runs independent checks, unit tests and production compilation with default caching.
`vp run test:browser` builds and exercises the actual local app. Browser setup uses `vp exec playwright install chromium` if necessary.
Browser traces stay under ignored `tmp/`.
Local dev/build/preview and browser tests do not evaluate an Alchemy stack.
`build:production` evaluates the production host integration, while uncached `deploy:plan` and `deploy` access Cloudflare using the production stage.
`alchemy.run.ts` owns the independent oxlint-docs state, and `.github/workflows/deploy-docs.yml` deploys main only using the protected docs-production environment.
Only production attaches the custom domain. Never place a local OAuth token in GitHub secrets.

After dependency changes run `vp install`, `bun install --lockfile-only --ignore-scripts` and `bun2nix -o bun.nix`, then review and commit all three locks.
Keep published Effront 0.2.0 and current reference catalog versions pinned, without workspace dependencies.
`pnpm-workspace.yaml` centralizes overrides and reviewed workerd platform-binary installation policy.
Do not change `flake.lock` unless changing Nix inputs intentionally.
Keep the strictest then node-ts TypeScript presets, JSX/bundler options needed by the app, and exact current React/Effect versions.
Use Vite+ formatting with no semicolons, single quotes, width 120 and unwrapped Markdown prose.
Keep shared CI actions on `@main` and the existing Nix environment loading.

## Documentation contract

Every exported rule needs purpose, supported options/defaults, valid/invalid syntax fixtures, fixability and practical scope limitations in English and Japanese.
Examples show one rule's diagnostics and may omit declarations, not necessarily a complete runnable program or proof that every other rule passes.
Group navigation only into TypeScript and Effect. Identify retained conflicting or overlapping rules as opt-in, not a third preset group.
Read actual rule source/tests and current group/preset exports before changing content.
The library's TypeScript and Effect presets share a pinned MIT port of native Ultracite 7.12.3 core flattened into top-level configuration, without the full Ultracite CLI dependency, upstream per-file overrides or test-only exemptions.
Document its three native conflict settings and retained generated-file allowance separately from the 34 custom rules.
Do not silently apply the library's Ultracite baseline to this documentation application's own Vite+ lint or formatter configuration.
Update both locales, catalogs, explicit routes and regression tests together.
Preserve stable heading IDs and localized links.
Keep parsing/loading in the server graph and shared shell state persistent across route changes.
Never fetch GitHub, execute Git or read external rule files during page rendering.
Do not restore obsolete Effront architecture excerpts or their tests.

## Cache validation

Keep reused response-cache unit tests and local HTML/Flight policy tests.
Only public documentation may use this middleware. Never cache personalized content with it.
Local workerd does not prove managed CDN HITs. Verify deployed HTML and Flight origin policy separately after deployment.
Temporary task artifacts belong under ignored `tmp/` and are excluded from commits.

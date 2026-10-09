# oxlint-docs

## Repository structure

| Path                                      | Purpose                                                  |
| ----------------------------------------- | -------------------------------------------------------- |
| `src/entry.effront.tsx`                   | Routes, layout, metadata, redirects and cache middleware |
| `src/entry.workers.ts`                    | Production Worker entry and native cache integration     |
| `src/components/`, `src/styles.css`       | Shared shell, controls and styles                        |
| `src/content/rules.ts`                    | English and Japanese local rule reference                |
| `src/content/policies.ts`                 | External Effect rule names and source revision           |
| `src/content/documents.ts`                | Rendered guides, presets and rule articles               |
| `src/content/catalog.ts`, `en/catalog.ts` | Metadata and navigation                                  |
| `src/content/markdown.tsx`                | Server-side Markdown rendering                           |
| `src/response-cache.ts`                   | Public response-cache policy                             |
| `tests/`                                  | Local HTTP and browser acceptance tests                  |
| `vite.config.ts`                          | Task entry points                                        |

## Development commands

### Execution rules

Run commands from the repository root inside `nix develop`.
Local tasks do not evaluate an Alchemy deployment stack.

### Standard tasks

| Command                         | Result                                              |
| ------------------------------- | --------------------------------------------------- |
| `bun install --frozen-lockfile` | Install locked dependencies                         |
| `vp run dev`                    | Serve locally at `127.0.0.1:1339`                   |
| `vp run build`                  | Build the local Worker and assets in `dist/`        |
| `vp run preview`                | Serve the local build                               |
| `vp run fix`                    | Format and apply supported lint fixes               |
| `vp run ci`                     | Check formatting, lint, types, unit tests and build |
| `vp run test:browser`           | Build and test the local app in Chromium            |

Use `vp exec playwright install chromium` if the browser is absent.
After dependency changes, update the Bun lock and Nix dependency file:

```sh
bun install
bun2nix -o bun.nix
```

## Architecture

### Content

- Give each local rule purpose, options/defaults, examples, fixability, limits and source links in both languages.
- Include only the 29 local rules in rule pages and navigation. Three compatibility rules are opt-in.
- Keep Rules and Presets separate. Group rules into TypeScript and Effect only.
- Describe external source, included names and disabled-rule reasons on preset pages. Do not duplicate external rule details.
- Identify Effect rules as incorporated MIT implementations, not a separately installed plugin.
- Keep old external-rule URL redirects to the localized Effect preset. Preserve queries for HTML and Flight.
- Read actual rule source, tests and preset exports before changing a claim.
- Treat examples as single-rule demonstrations. State when declarations are omitted.
- Preserve heading IDs, localized links, explicit routes and persistent shell state.
- Parse Markdown on the server. Do not fetch sources or run Git during rendering.
- Apply English writing principles to source prose. Review Japanese translation accuracy separately.
- Keep the shared Ultracite configuration, its three conflict settings and generated-file allowance in preset documentation.
- Do not apply the library's baseline to this app's formatter or lint configuration.
- Update both languages and relevant tests together.

### Cache checks

Keep the response-cache unit tests and HTML/Flight acceptance tests.
Use this cache policy for public content only. Do not add personalized content.
Local workerd tests prove origin headers, not managed CDN cache hits.
Check deployed HTML and Flight headers separately after an authorized deployment.

### Production

`alchemy.run.ts` owns the independent `oxlint-docs` state.
Only production uses `oxlint.totto2727.dev`.
`build:production` evaluates the production integration.
`deploy:plan` and `deploy` use `ALCHEMY_STAGE=production` and `--stage production`.
These tasks access Cloudflare and require authorization.
The main-only workflow uses the protected `docs-production` environment.
Keep validation in CI. Deployment must not run validation or wait for the CI workflow.
The owner manages its `CLOUDFLARE_ACCOUNT_ID` variable and `CLOUDFLARE_API_TOKEN` secret.
Do not copy local OAuth credentials into GitHub or change unrelated cloud resources.

## Development tools

Use compatible caret ranges for published npm dependencies, including prereleases. Do not use workspace links.
Use Bun as the only package manager. Select the newest installable versions that satisfy `minimumReleaseAge = 86400` in `bunfig.toml`. Do not add release-age exclusions.
Keep Vite Plus and its Vite core alias aligned. Only the [official Vite+ core and bundled Vitest overrides](https://viteplus.dev/guide/local-cli#manual-installation) are permitted, with exact versions matching the installed toolchain.
Keep those official overrides in `package.json`. Update `bun.lock` and `bun.nix` together. Do not add another package-manager lockfile.
Resolve other dependency coherence through compatible manifest and peer ranges, not overrides.
Keep reviewed workerd and esbuild installation policy in `trustedDependencies`.
Change `flake.lock` only when changing Nix inputs.
Keep strictest before node-ts, the required JSX options and current React/Effect versions.
Keep no semicolons, single quotes, width 120 and unwrapped Markdown.
Keep shared CI actions on `@main` and preserve their Nix environment loading.

## Package-specific rules

- Change this application only. Treat `package/effront/app/docs` and `package/oxlint/src` as read-only references.
- Do not merge PRs, deploy or change credentials without an explicit user request.
- Keep README content for site users. Put maintenance and deployment instructions here.
- Do not retain npm or FlakeHub publication workflows for this site.
- Keep temporary files under ignored `tmp/`. Do not commit them.
- Use `AGENTS.md`. Do not create `CLAUDE.md`.

## Task-specific documentation

Read [documentation reuse](./docs/reuse.md) before changing copied behavior.

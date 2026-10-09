# Documentation reuse

## Baseline

Reference: [Effront](https://github.com/totto2727-org/effront), `app/docs` at `b561905cd773363a8d834ecf1a8279d551eee379`.
Effront is the source of reused site components, not an upstream repository for this independent application.
This app uses published `@effront/*` runtime packages at `0.3.1`.
It does not incorporate or change Effront runtime source.
Licenses are in [third-party notices](../THIRD-PARTY-NOTICES.md).

## Reused areas

| Area                                  | Local paths                                                    |
| ------------------------------------- | -------------------------------------------------------------- |
| Persistent shell and navigation       | `src/components/docs-shell.tsx`                                |
| Controls, theme and responsive styles | `src/components/ui/`, `src/lib/utils.ts`, `src/styles.css`     |
| Code blocks and alerts                | `src/components/code-block*`, `src/components/markdown-alert*` |
| Public response-cache policy          | `src/response-cache.ts` and its tests                          |
| Server Markdown pipeline              | `src/content/markdown.tsx`                                     |
| Local Cloudflare-runtime test host    | `tests/vite.config.ts`, `tests/playwright.config.ts`           |

The shell changes only product text and destination links.
Style and cache behavior remain unchanged.

## Site changes

- Replace Effront articles with Oxlint guides, presets and local rule references.
- Store both languages in `src/content/`. Do not read Git, source files or the network during rendering.
- Register authored routes explicitly and retain native 404 behavior.
- Show 29 local rules in TypeScript and Effect groups. Keep two preset pages separate.
- Redirect five external-rule URLs to the localized Effect preset's `official-effect` section.
  GET/HEAD redirects use status 308 and preserve queries for HTML and Flight.
- Build a documentation Worker and use a development-only Nix shell. Do not export an npm CLI or native executable.
- Keep application publication workflows disabled.
- Use independent `oxlint-docs` Alchemy state and the production-only domain `oxlint.totto2727.dev`.
- Deploy main only through the existing validation and deployment workflow, not branch previews.

These are application changes. The shared shell behavior, styles, cache policy and Effront runtime source are unchanged.

## Published runtime compatibility

The five published Effront packages use version `0.3.1` without workspace links.
Published metadata: [core](https://www.npmjs.com/package/@effront/core/v/0.3.1), [markdown](https://www.npmjs.com/package/@effront/markdown/v/0.3.1), [vite](https://www.npmjs.com/package/@effront/vite/v/0.3.1), [tailwind](https://www.npmjs.com/package/@effront/tailwind/v/0.3.1) and [alchemy](https://www.npmjs.com/package/@effront/alchemy/v/0.3.1).
These packages provide stable Effect module paths and compatible dependency metadata.
All three local compatibility patches and their pnpm and Bun registrations are removed.
No dependency overrides are required.
Effect and its platform packages use `^4.0.1` and resolve to `4.0.1`.
React and React DOM resolve to `19.3.0`.
Vite Plus and the Vite core alias use `^1.0.0`.
Alchemy and its Cloudflare runtime use `2.0.0-beta.81`, which supports stable Effect 4.
Effect HTTP imports use `effect/http`.
The development-only Nix overlay uses revision `af16f6183aec0717d8975ee858c910ab43babee6` for the global Vite Plus `1.0.0` CLI.
Vite Plus task inputs and outputs use the nested `cache` configuration.
See [run configuration](https://viteplus.dev/config/run) and [automatic tracking](https://viteplus.dev/guide/automatic-data-tracking).
The original Effront source attribution remains unchanged.

## External policy documentation

Only the library incorporates external lint sources. This site describes their preset use.

| Source                                                                                                                                                      | Compared revision                          | Documentation scope                                     |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------- |
| [Effect Oxc rules](https://github.com/Effect-TS/effect/tree/b1d200c40a1dad69def51ebdbf0a1a612a12b8ac/packages/tools/oxc/src/oxlint/rules)                   | `b1d200c40a1dad69def51ebdbf0a1a612a12b8ac` | Included names, source and disabled-rule reasons        |
| [Ultracite 7.12.3 core](https://github.com/haydenbleasel/ultracite/blob/48156546701badf2c6e60f25cf1e8511f7dc44c7/packages/cli/config/oxlint/core/index.mjs) | `48156546701badf2c6e60f25cf1e8511f7dc44c7` | Shared settings, ignores and three conflict adjustments |

The plugin exports 29 local rules and five incorporated Effect rules.
The private Effect tools package is not a separately installed plugin.
The Effect preset enables four external rules and disables `no-js-extension-imports` to avoid overlap and opposite fixes in `js` mode.
The two local import-compatibility rules remain opt-in because they impose the opposite convention.
Ultracite documentation covers native settings only, not its CLI, React, JavaScript-plugin, type-aware or formatter layers.
Both groups discard external file overrides and test exemptions.
TypeScript and combined presets retain the `**/*.gen.ts` alias allowance.

## Operational limits

Local dev, build and preview use the local host configuration.
Local cache tests validate origin headers, not managed CDN hits or version isolation.
The public cache policy also applies to requests with cookies or authorization headers.
Do not add personalized content behind this middleware.
Keep rule descriptions synchronized with the library's source and tests.

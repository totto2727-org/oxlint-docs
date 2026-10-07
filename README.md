# @totto2727/oxlint documentation

Standalone English and Japanese documentation for [@totto2727/oxlint](https://github.com/totto2727-org/oxlint).
The site reuses the Effront documentation shell, styles, Markdown rendering and public response-cache policy with published `@effront/*` 0.2.0 dependencies.
The bilingual Rules reference documents 29 locally authored rules, including three opt-in legacy policies, grouped into TypeScript and Effect.
Separate Presets pages describe the external native Ultracite 7.12.3 core baseline and official Effect policy layer, with source links, included rule names and concise reasons for disabled or conflicting settings, not duplicated external rule details.
The plugin API still exports 34 rules: 29 local rules and five vendored MIT Effect adapters. These adapters are not a separately installed external npm plugin, and the upstream tools package is private.
The Effect preset enables four adapters and explicitly disables no-js-extension-imports in every preset because the local extension family covers mjs/cjs and supports both ts and js modes. Old external-rule article URLs redirect to the localized Effect preset section.

## Run locally

```sh
nix develop
vp install --frozen-lockfile
vp run dev
```

Open <http://127.0.0.1:1339/en> or <http://127.0.0.1:1339/ja>.
The unprefixed routes preserve Japanese as the default locale.
The local host is authentication-free and does not evaluate an Alchemy deployment stack.

```sh
vp run build
vp run preview
```

`dist/` contains the built Worker and browser assets, not a portable npm CLI or a standalone native executable.
This private application is not published to npm. Production is configured at <https://oxlint.totto2727.dev> using the same Alchemy/Cloudflare deployment architecture as Effront.
Nix supplies the pinned development environment only.

## Validation

```sh
vp run fix
vp run ci
vp exec playwright install chromium
vp run test:browser
```

`ci` checks formatting, lint, TypeScript, rendering/cache tests and production compilation.
Browser acceptance uses the real built application on an authentication-free local host.
The browser suite covers all localized local-rule pages, separate Rules/Presets navigation, external policy provenance and retired URL redirects, persistent navigation, no-JavaScript links, mobile navigation, and HTML/Flight cache headers.
It does not prove managed CDN cache hits or deploy anything.

## Production deployment

`alchemy.run.ts` uses independent `oxlint-docs` Cloudflare-backed state.
The centralized deploy tasks set both `ALCHEMY_STAGE=production` and `--stage production`. Keep these aligned when invoking Alchemy directly.
Only stage `production` attaches the custom domain `oxlint.totto2727.dev` in the existing `totto2727.dev` zone.
The Worker retains Effront native HTML/Flight cache integration.

```sh
vp run deploy:plan
vp run deploy
```

These commands access remote resources and require an authenticated Cloudflare profile or `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`.
Do not commit credentials or copy a local OAuth credential into GitHub.
`.github/workflows/deploy-docs.yml` validates and deploys automatically after pushes to `main`, or manual dispatch on `main`, then verifies a published rule page.
Configure the `docs-production` environment to permit only `main`, with `CLOUDFLARE_ACCOUNT_ID` as a variable and a dedicated `CLOUDFLARE_API_TOKEN` secret.
The API token needs the permissions required by Alchemy Worker deployment, Cloudflare-backed state and the existing zone's custom-domain management.
Automatic deployment cannot run until that secret is provisioned by the owner.
See [Alchemy Cloudflare authentication](https://alchemy.run/docs/providers/cloudflare/) and [Workers custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/).

## Maintain the site

See [AGENTS.md](AGENTS.md) for file ownership and tasks, [reuse and differences](docs/upstream-differences.md) for the Effront baseline, and [third-party notices](THIRD-PARTY-NOTICES.md) for licenses.

## License

[MIT](LICENSE), copyright 2026 totto2727.

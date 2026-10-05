# oxlint-docs

## Scope

This repository owns the standalone documentation site for `@totto2727/oxlint`.
Use `package/effront/app/docs` as the read-only reference for the shared documentation shell, styles, Markdown renderer, response cache, and reusable tests.
Do not edit Effront or the oxlint rule sources from this repository.
Keep publication disabled and do not deploy or commit secrets.

## Development

Run from this repository root inside `nix develop`.
Install with `vp install --frozen-lockfile`.
Use `vp run fix` for formatting and lint fixes and `vp run ci` for aggregate validation.
Keep task entrypoints in `vite.config.ts`.
Initialization retains the native bootstrap build (`build/oxlint-docs`) and portable bundle (`dist/main.mjs`) separately.
Run `env -i PATH= "$PWD/build/oxlint-docs"` to verify the native executable without Node or Bun.
Expect `@totto2727/oxlint documentation` with exit status zero.
Native outputs use `output: ['build/**']` and exclude `build/**` from automatic inputs.
Keep default task caching and test cached output restoration when changing tasks.

## Files and dependencies

`src/main.ts` is the bootstrap CLI, `src/greet.ts` its pure behavior, and `src/greet.test.ts` its tests.
`flake.nix` pins the development environment and exports the native package and overlay; `package.nix` uses the shared bun2nix builder.
After dependency changes run `vp install`, `bun install --lockfile-only --ignore-scripts`, and `bun2nix -o bun.nix`, and commit all three locks together.
Do not update `flake.lock` without intentional Nix input changes.
Keep TypeScript presets in strictest then node-ts order.
Use Vite+ formatting with no semicolons, single quotes, width 120, and unwrapped Markdown prose.
Keep shared GitHub actions on `@main` and preserve CI's Nix environment loading.
Both publication workflows remain disabled.
Temporary artifacts belong under ignored `tmp/`.
Do not create `CLAUDE.md`.

## Documentation requirements

Rule documentation must be verified against actual rule source and tests, including options and valid/invalid examples.
Group presets only into generic TypeScript and Effect-oriented rules.
Document import extension modes `js` and `ts`, plus the `force-ts-extension` compatibility alias.
Preserve the reusable Effront shell and cache tests but remove Effront-specific architecture content and excerpt tests.
Use published Effront 0.2.0 packages when available, without workspace links in the final manifest.
Maintain English and Japanese catalogs without cross-language fallback.
Validate the actual local site using an authentication-free test host without deploying.

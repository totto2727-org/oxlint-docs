# @totto2727/oxlint documentation

Standalone documentation application for [@totto2727/oxlint](https://github.com/totto2727-org/oxlint).
This initialization establishes the private repository and pinned Vite+ development environment.
The documentation site is implemented in a separate change using the Effront documentation shell.

## Development

Run `nix develop`, then `vp install --frozen-lockfile`.
Use `vp run fix` and `vp run ci` to validate the initialization.
The current bootstrap command `vp run bin` prints `@totto2727/oxlint documentation`.
The native bootstrap executable is `build/oxlint-docs`; the separate portable bundle is `dist/main.mjs`.
No npm publication, FlakeHub publication, or deployment is enabled.
See [AGENTS.md](AGENTS.md) for development boundaries.

## License

[MIT](LICENSE), copyright 2026 totto2727.

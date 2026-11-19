export const externalEffectRuleNames = [
  'no-bigint-literals',
  'no-import-from-barrel-package',
  'no-opaque-instance-fields',
  'no-unused-internal',
] as const

export const effectRuleSource =
  'https://github.com/Effect-TS/effect/tree/b1d200c40a1dad69def51ebdbf0a1a612a12b8ac/packages/tools/oxc/src/oxlint/rules'

export const retiredRuleRedirects = new Map([
  ...[...externalEffectRuleNames, 'no-js-extension-imports'].map((name): [string, string] => [
    `/rules/${name}`,
    '/presets/effect#official-effect',
  ]),
  ['/rules/force-ts-extension', '/rules/consistent-import-extension'],
  ['/rules/no-error-cause-option', '/rules/no-optional-error-cause'],
  ['/rules/no-option-tag-comparison', '/rules/no-direct-tag-access'],
  ['/rules/no-raw-hono-create-middleware', '/#rules'],
])

// Externally authored policies are documented as preset provenance, not local rule articles.
export const externalEffectRuleNames = [
  'no-bigint-literals',
  'no-import-from-barrel-package',
  'no-js-extension-imports',
  'no-opaque-instance-fields',
  'no-unused-internal',
] as const

export const effectSourceRevision = 'b1d200c40a1dad69def51ebdbf0a1a612a12b8ac'
export const effectRuleSource = `https://github.com/Effect-TS/effect/tree/${effectSourceRevision}/packages/tools/oxc/src/oxlint/rules`

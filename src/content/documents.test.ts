import { describe, expect, test } from 'vite-plus/test'
import { documents } from './documents.ts'

describe('getting started', () => {
  test.each(['en', 'ja'] as const)('documents a runnable application preset in %s', (locale) => {
    const guide = documents(locale)['guide/getting-started.md']
    expect(guide).toContain('npm install --save-dev @totto2727/oxlint oxlint oxlint-tsgolint')
    expect(guide).toContain("from '@totto2727/oxlint/preset/application'")
    expect(guide).toContain('npm exec -- oxlint --config .oxlintrc.mjs src')
    expect(guide).toContain('npm exec -- oxlint --config .oxlintrc.mjs --fix src')
  })
})

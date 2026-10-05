import { expect, test } from 'vite-plus/test'

import { greet } from './greet.ts'

test('identifies the documentation application', () => {
  expect(greet()).toEqual('@totto2727/oxlint documentation')
})

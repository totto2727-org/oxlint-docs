import { effrontAlchemy } from '@effront/alchemy/cloudflare/vite'
import { effrontTailwind } from '@effront/tailwind'
import { effront } from '@effront/vite'
import { defineConfig } from 'vite-plus'

export default defineConfig({
  plugins: [effrontTailwind({ stylesheet: './src/styles.css' }), effront(), effrontAlchemy()],
  fmt: {
    arrowParens: 'always',
    jsxSingleQuote: true,
    printWidth: 120,
    proseWrap: 'preserve',
    semi: false,
    singleQuote: true,
  },
  lint: {
    plugins: ['eslint', 'typescript', 'unicorn', 'oxc', 'react'],
    options: { typeAware: true, typeCheck: true },
  },
  test: { include: ['src/**/*.test.{ts,tsx}'] },
  run: {
    tasks: {
      dev: 'vp dev --config tests/vite.config.ts --host 127.0.0.1 --port 1339',
      build: {
        command: 'vp build --config tests/vite.config.ts',
        cache: {
          input: [{ auto: true }, '!dist/**', '!tmp/**'],
          output: ['dist/**'],
        },
      },
      preview: 'vp preview --config tests/vite.config.ts --host 127.0.0.1 --port 1339',
      'build:production': {
        command: 'ALCHEMY_STAGE=production vp build',
        cache: {
          input: [{ auto: true }, '!dist/**', '!tmp/**'],
          output: ['dist/**'],
        },
      },
      'deploy:plan': { command: 'ALCHEMY_STAGE=production alchemy plan --stage production --no-input', cache: false },
      deploy: { command: 'ALCHEMY_STAGE=production alchemy deploy --stage production --yes --no-input', cache: false },
      check: 'vp check',
      fix: 'vp check --fix',
      test: 'vp test run',
      'test:browser': 'playwright test --config tests/playwright.config.ts',
      ci: { command: '', dependsOn: ['check', 'test', 'build'] },
    },
  },
})

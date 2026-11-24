import { effrontAlchemy } from '@effront/alchemy/cloudflare/vite'
import { effrontTailwind } from '@effront/tailwind'
import { effront } from '@effront/vite'
import { generateIgnorePatterns } from '@totto2727/gitignore-patterns'
import preset from '@totto2727/oxlint/preset/application'
import { defineConfig } from 'vite-plus'

const ignorePatterns = await generateIgnorePatterns(new URL('.', import.meta.url))

// oxlint-disable-next-line import/no-default-export -- Vite loads the default configuration export.
export default defineConfig({
  fmt: {
    arrowParens: 'always',
    ignorePatterns,
    jsxSingleQuote: true,
    printWidth: 120,
    proseWrap: 'preserve',
    semi: false,
    singleQuote: true,
  },
  lint: {
    ...preset,
    env: { browser: true },
    ignorePatterns,
    options: { ...preset.options, typeCheck: true },
  },
  plugins: [
    effrontTailwind({ stylesheet: './src/styles.css' }),
    effront({ application: './src/entry.effront.tsx' }),
    effrontAlchemy(),
  ],
  run: {
    tasks: {
      build: {
        cache: {
          input: [{ auto: true }, '!dist/**', '!tmp/**'],
          output: ['dist/**'],
        },
        command: 'vp build --config tests/vite.config.ts',
      },
      'build:production': {
        cache: {
          input: [{ auto: true }, '!dist/**', '!tmp/**'],
          output: ['dist/**'],
        },
        command: 'ALCHEMY_STAGE=production vp build',
      },
      check: 'vp check',
      ci: { command: '', dependsOn: ['check', 'test', 'build'] },
      deploy: { cache: false, command: 'ALCHEMY_STAGE=production alchemy deploy --stage production --yes --no-input' },
      'deploy:plan': { cache: false, command: 'ALCHEMY_STAGE=production alchemy plan --stage production --no-input' },
      dev: 'vp dev --config tests/vite.config.ts --host 127.0.0.1 --port 1339',
      fix: 'vp check --fix',
      preview: 'vp preview --config tests/vite.config.ts --host 127.0.0.1 --port 1339',
      test: 'vp test run',
      'test:browser': 'playwright test --config tests/playwright.config.ts',
    },
  },
  test: { dir: 'src' },
})

import { Application } from '@effront/core'
import { Context, Effect, Layer, Predicate } from 'effect'
import { HttpRouter, HttpServerRequest, HttpServerResponse } from 'effect/http'
import { DocsShell } from './components/docs-shell.tsx'
import { documentLocale, documentPath, localizedPath } from './content/locale.ts'
import { getPage, localizedNavigation, navigation, navigationItem } from './content/pages.ts'
import { retiredRuleRedirects } from './content/policies.ts'
import { responseCache } from './response-cache.ts'
import type { ReactElement } from 'react'
import type { RenderableDocPage } from './content/types.ts'

class RequestPath extends Context.Service<RequestPath, string>()('oxlint-docs/RequestPath') {}
const RequestPathLive = Layer.effect(
  RequestPath,
  Effect.map(HttpServerRequest.HttpServerRequest, (request) => new URL(request.url, 'https://oxlint.local').pathname),
)
const hasLocalePath = (path: string): boolean => /^\/(?:en|ja)(?:\/|$)/u.test(path)

// Retired rule articles redirect before route matching for both HTML and Flight.
const RetiredRuleRedirects = HttpRouter.middleware(
  (httpEffect) =>
    Effect.gen(function* () {
      const request = yield* HttpServerRequest.HttpServerRequest
      const url = new URL(request.url, 'https://oxlint.local')
      if (request.method === 'GET' || request.method === 'HEAD') {
        const path = documentPath(url.pathname).replace(/\/+$/u, '')
        const target = retiredRuleRedirects.get(path)
        if (Predicate.isNotNullish(target)) {
          const destination = new URL(target, url.origin)
          const location = hasLocalePath(url.pathname)
            ? localizedPath(destination.pathname, documentLocale(url.pathname))
            : destination.pathname
          return HttpServerResponse.redirect(`${location}${url.search}${destination.hash}`, { status: 308 })
        }
      }
      return yield* httpEffect
    }),
  { global: true },
)
const EFFRONT = Application.effront<RequestPath>()
const ResponseCache = EFFRONT.Middleware.make(responseCache)
const RootLayout = EFFRONT.Layout.make({
  render: ({ children }) =>
    Effect.map(RequestPath, (pathname) => {
      const page = getPage(pathname)
      const locale = documentLocale(pathname)
      const prefixed = hasLocalePath(pathname)
      return (
        <html lang={locale} className='dark'>
          <head>
            <meta charSet='utf-8' />
            <meta name='viewport' content='width=device-width, initial-scale=1' />
          </head>
          <body>
            <DocsShell
              current={navigationItem(page)}
              navigation={prefixed ? localizedNavigation(locale) : navigation}
              locale={locale}
              headings={page.headings}
            >
              {children}
            </DocsShell>
          </body>
        </html>
      )
    }),
})
const renderArticleHeader = ({
  description,
  section,
  title,
}: Pick<RenderableDocPage, 'description' | 'section' | 'title'>): ReactElement => (
  <header className='not-prose mb-10 border-b pb-8'>
    <p className='mb-3 text-xs font-semibold uppercase tracking-widest text-emerald-700'>{section}</p>
    <h1 className='text-3xl font-semibold tracking-tight sm:text-4xl'>{title}</h1>
    <p className='mt-4 text-base leading-8 text-muted-foreground'>{description}</p>
  </header>
)

const documentPage = (slug: string): ReturnType<typeof EFFRONT.Page.make> => {
  const page = getPage(slug)
  return EFFRONT.Page.make({
    render: () =>
      Effect.map(page.content(), (content) => (
        <>
          <title>{`${page.title} | @totto2727/oxlint`}</title>
          <meta name='description' content={page.description} />
          <article className='prose prose-neutral max-w-none dark:prose-invert' data-doc-page={page.slug}>
            {renderArticleHeader(page)}
            {content}
          </article>
        </>
      )),
  })
}
// Explicit routes preserve the framework's compile-time collision checks.
const routes = EFFRONT.withMiddleware(ResponseCache)
  .Routes.make({ layout: RootLayout })
  .page('/', documentPage('/'))
  .page('/guide/getting-started', documentPage('/guide/getting-started'))
  .page('/presets/typescript', documentPage('/presets/typescript'))
  .page('/presets/effect', documentPage('/presets/effect'))
  .page('/rules/consistent-import-extension', documentPage('/rules/consistent-import-extension'))
  .page('/rules/require-import-extension', documentPage('/rules/require-import-extension'))
  .page('/rules/effect-tracing', documentPage('/rules/effect-tracing'))
  .page('/rules/no-index-filename', documentPage('/rules/no-index-filename'))
  .page('/rules/no-local-export-list', documentPage('/rules/no-local-export-list'))
  .page('/rules/require-vitest-hooks', documentPage('/rules/require-vitest-hooks'))
  .page('/rules/no-eslint-disable-comments', documentPage('/rules/no-eslint-disable-comments'))
  .page('/rules/no-jsx-script-tag', documentPage('/rules/no-jsx-script-tag'))
  .page('/rules/no-let', documentPage('/rules/no-let'))
  .page('/rules/no-redundant-alias', documentPage('/rules/no-redundant-alias'))
  .page('/rules/no-string-style', documentPage('/rules/no-string-style'))
  .page('/rules/require-disable-reason', documentPage('/rules/require-disable-reason'))
  .page('/rules/force-array-empty', documentPage('/rules/force-array-empty'))
  .page('/rules/force-iterable-empty', documentPage('/rules/force-iterable-empty'))
  .page('/rules/force-predicate', documentPage('/rules/force-predicate'))
  .page('/rules/force-string-empty', documentPage('/rules/force-string-empty'))
  .page('/rules/no-effect-import-as', documentPage('/rules/no-effect-import-as'))
  .page('/rules/no-effect-runtime-run', documentPage('/rules/no-effect-runtime-run'))
  .page('/rules/no-effect-subpath-import', documentPage('/rules/no-effect-subpath-import'))
  .page('/rules/no-optional-error-cause', documentPage('/rules/no-optional-error-cause'))
  .page('/rules/no-error-property-access', documentPage('/rules/no-error-property-access'))
  .page('/rules/no-fetch', documentPage('/rules/no-fetch'))
  .page('/rules/no-instanceof-error', documentPage('/rules/no-instanceof-error'))
  .page('/rules/no-js-date', documentPage('/rules/no-js-date'))
  .page('/rules/no-node-imports', documentPage('/rules/no-node-imports'))
  .page('/rules/no-raw-crypto', documentPage('/rules/no-raw-crypto'))
  .page('/rules/no-direct-tag-access', documentPage('/rules/no-direct-tag-access'))
  .page('/rules/no-for-loops', documentPage('/rules/no-for-loops'))
  .page('/rules/no-readonly', documentPage('/rules/no-readonly'))
  .page('/rules/prefer-schema-format-validation', documentPage('/rules/prefer-schema-format-validation'))
  .page('/rules/require-tagged-data', documentPage('/rules/require-tagged-data'))
  .page('/rules/require-tagged-error', documentPage('/rules/require-tagged-error'))
  .page('/rules/no-sync-decode', documentPage('/rules/no-sync-decode'))
  .page('/rules/no-type-predicate', documentPage('/rules/no-type-predicate'))
  .page('/rules/prefer-is-nullish', documentPage('/rules/prefer-is-nullish'))
  .page('/rules/prefer-non-unknown-decode', documentPage('/rules/prefer-non-unknown-decode'))
  .page('/rules/require-top-level-decoder', documentPage('/rules/require-top-level-decoder'))
  .page('/en', documentPage('/en'))
  .page('/en/guide/getting-started', documentPage('/en/guide/getting-started'))
  .page('/en/presets/typescript', documentPage('/en/presets/typescript'))
  .page('/en/presets/effect', documentPage('/en/presets/effect'))
  .page('/en/rules/consistent-import-extension', documentPage('/en/rules/consistent-import-extension'))
  .page('/en/rules/require-import-extension', documentPage('/en/rules/require-import-extension'))
  .page('/en/rules/effect-tracing', documentPage('/en/rules/effect-tracing'))
  .page('/en/rules/no-index-filename', documentPage('/en/rules/no-index-filename'))
  .page('/en/rules/no-local-export-list', documentPage('/en/rules/no-local-export-list'))
  .page('/en/rules/require-vitest-hooks', documentPage('/en/rules/require-vitest-hooks'))
  .page('/en/rules/no-eslint-disable-comments', documentPage('/en/rules/no-eslint-disable-comments'))
  .page('/en/rules/no-jsx-script-tag', documentPage('/en/rules/no-jsx-script-tag'))
  .page('/en/rules/no-let', documentPage('/en/rules/no-let'))
  .page('/en/rules/no-redundant-alias', documentPage('/en/rules/no-redundant-alias'))
  .page('/en/rules/no-string-style', documentPage('/en/rules/no-string-style'))
  .page('/en/rules/require-disable-reason', documentPage('/en/rules/require-disable-reason'))
  .page('/en/rules/force-array-empty', documentPage('/en/rules/force-array-empty'))
  .page('/en/rules/force-iterable-empty', documentPage('/en/rules/force-iterable-empty'))
  .page('/en/rules/force-predicate', documentPage('/en/rules/force-predicate'))
  .page('/en/rules/force-string-empty', documentPage('/en/rules/force-string-empty'))
  .page('/en/rules/no-effect-import-as', documentPage('/en/rules/no-effect-import-as'))
  .page('/en/rules/no-effect-runtime-run', documentPage('/en/rules/no-effect-runtime-run'))
  .page('/en/rules/no-effect-subpath-import', documentPage('/en/rules/no-effect-subpath-import'))
  .page('/en/rules/no-optional-error-cause', documentPage('/en/rules/no-optional-error-cause'))
  .page('/en/rules/no-error-property-access', documentPage('/en/rules/no-error-property-access'))
  .page('/en/rules/no-fetch', documentPage('/en/rules/no-fetch'))
  .page('/en/rules/no-instanceof-error', documentPage('/en/rules/no-instanceof-error'))
  .page('/en/rules/no-js-date', documentPage('/en/rules/no-js-date'))
  .page('/en/rules/no-node-imports', documentPage('/en/rules/no-node-imports'))
  .page('/en/rules/no-raw-crypto', documentPage('/en/rules/no-raw-crypto'))
  .page('/en/rules/no-direct-tag-access', documentPage('/en/rules/no-direct-tag-access'))
  .page('/en/rules/no-for-loops', documentPage('/en/rules/no-for-loops'))
  .page('/en/rules/no-readonly', documentPage('/en/rules/no-readonly'))
  .page('/en/rules/prefer-schema-format-validation', documentPage('/en/rules/prefer-schema-format-validation'))
  .page('/en/rules/require-tagged-data', documentPage('/en/rules/require-tagged-data'))
  .page('/en/rules/require-tagged-error', documentPage('/en/rules/require-tagged-error'))
  .page('/en/rules/no-sync-decode', documentPage('/en/rules/no-sync-decode'))
  .page('/en/rules/no-type-predicate', documentPage('/en/rules/no-type-predicate'))
  .page('/en/rules/prefer-is-nullish', documentPage('/en/rules/prefer-is-nullish'))
  .page('/en/rules/prefer-non-unknown-decode', documentPage('/en/rules/prefer-non-unknown-decode'))
  .page('/en/rules/require-top-level-decoder', documentPage('/en/rules/require-top-level-decoder'))
  .page('/ja', documentPage('/ja'))
  .page('/ja/guide/getting-started', documentPage('/ja/guide/getting-started'))
  .page('/ja/presets/typescript', documentPage('/ja/presets/typescript'))
  .page('/ja/presets/effect', documentPage('/ja/presets/effect'))
  .page('/ja/rules/consistent-import-extension', documentPage('/ja/rules/consistent-import-extension'))
  .page('/ja/rules/require-import-extension', documentPage('/ja/rules/require-import-extension'))
  .page('/ja/rules/effect-tracing', documentPage('/ja/rules/effect-tracing'))
  .page('/ja/rules/no-index-filename', documentPage('/ja/rules/no-index-filename'))
  .page('/ja/rules/no-local-export-list', documentPage('/ja/rules/no-local-export-list'))
  .page('/ja/rules/require-vitest-hooks', documentPage('/ja/rules/require-vitest-hooks'))
  .page('/ja/rules/no-eslint-disable-comments', documentPage('/ja/rules/no-eslint-disable-comments'))
  .page('/ja/rules/no-jsx-script-tag', documentPage('/ja/rules/no-jsx-script-tag'))
  .page('/ja/rules/no-let', documentPage('/ja/rules/no-let'))
  .page('/ja/rules/no-redundant-alias', documentPage('/ja/rules/no-redundant-alias'))
  .page('/ja/rules/no-string-style', documentPage('/ja/rules/no-string-style'))
  .page('/ja/rules/require-disable-reason', documentPage('/ja/rules/require-disable-reason'))
  .page('/ja/rules/force-array-empty', documentPage('/ja/rules/force-array-empty'))
  .page('/ja/rules/force-iterable-empty', documentPage('/ja/rules/force-iterable-empty'))
  .page('/ja/rules/force-predicate', documentPage('/ja/rules/force-predicate'))
  .page('/ja/rules/force-string-empty', documentPage('/ja/rules/force-string-empty'))
  .page('/ja/rules/no-effect-import-as', documentPage('/ja/rules/no-effect-import-as'))
  .page('/ja/rules/no-effect-runtime-run', documentPage('/ja/rules/no-effect-runtime-run'))
  .page('/ja/rules/no-effect-subpath-import', documentPage('/ja/rules/no-effect-subpath-import'))
  .page('/ja/rules/no-optional-error-cause', documentPage('/ja/rules/no-optional-error-cause'))
  .page('/ja/rules/no-error-property-access', documentPage('/ja/rules/no-error-property-access'))
  .page('/ja/rules/no-fetch', documentPage('/ja/rules/no-fetch'))
  .page('/ja/rules/no-instanceof-error', documentPage('/ja/rules/no-instanceof-error'))
  .page('/ja/rules/no-js-date', documentPage('/ja/rules/no-js-date'))
  .page('/ja/rules/no-node-imports', documentPage('/ja/rules/no-node-imports'))
  .page('/ja/rules/no-raw-crypto', documentPage('/ja/rules/no-raw-crypto'))
  .page('/ja/rules/no-direct-tag-access', documentPage('/ja/rules/no-direct-tag-access'))
  .page('/ja/rules/no-for-loops', documentPage('/ja/rules/no-for-loops'))
  .page('/ja/rules/no-readonly', documentPage('/ja/rules/no-readonly'))
  .page('/ja/rules/prefer-schema-format-validation', documentPage('/ja/rules/prefer-schema-format-validation'))
  .page('/ja/rules/require-tagged-data', documentPage('/ja/rules/require-tagged-data'))
  .page('/ja/rules/require-tagged-error', documentPage('/ja/rules/require-tagged-error'))
  .page('/ja/rules/no-sync-decode', documentPage('/ja/rules/no-sync-decode'))
  .page('/ja/rules/no-type-predicate', documentPage('/ja/rules/no-type-predicate'))
  .page('/ja/rules/prefer-is-nullish', documentPage('/ja/rules/prefer-is-nullish'))
  .page('/ja/rules/prefer-non-unknown-decode', documentPage('/ja/rules/prefer-non-unknown-decode'))
  .page('/ja/rules/require-top-level-decoder', documentPage('/ja/rules/require-top-level-decoder'))
const application = EFFRONT.make({ layer: Layer.mergeAll(RequestPathLive, RetiredRuleRedirects), routes })
// oxlint-disable-next-line import/no-default-export -- Effront loads its server application from the default export.
export default application

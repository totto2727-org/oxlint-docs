import { Fragment } from 'react'
import type { CSSProperties, JSX } from 'react'
/* oxlint-disable import/max-dependencies -- Shiki languages are statically selected to keep rendering offline and WASM-free. */
/* oxlint-disable react/jsx-max-depth, react/no-array-index-key -- Immutable token and line positions are stable keys in this server-rendered code tree. */
import { Predicate } from 'effect'
import { createHighlighterCoreSync } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import bash from 'shiki/langs/bash.mjs'
import css from 'shiki/langs/css.mjs'
import diff from 'shiki/langs/diff.mjs'
import javascript from 'shiki/langs/javascript.mjs'
import json from 'shiki/langs/json.mjs'
import jsonc from 'shiki/langs/jsonc.mjs'
import jsx from 'shiki/langs/jsx.mjs'
import tsx from 'shiki/langs/tsx.mjs'
import typescript from 'shiki/langs/typescript.mjs'
import githubDark from 'shiki/themes/github-dark.mjs'
import type { TokenStyles } from 'shiki/types'

// Imported by RSC content modules, never by the client shell. All registrations are
// Local static imports: no bundle loader, network request, or Oniguruma/WASM asset.
// https://shiki.style/guide/bundles#fine-grained-bundle
// https://shiki.style/guide/regex-engines#javascript-regexp-engine
// oxlint-disable-next-line node/no-sync -- This initializes imported grammars in memory and performs no I/O.
const highlighter = createHighlighterCoreSync({
  engine: createJavaScriptRegexEngine(),
  langs: [bash, css, diff, javascript, json, jsonc, jsx, tsx, typescript],
  themes: [githubDark],
})

const languages = {
  bash: 'bash',
  css: 'css',
  diff: 'diff',
  javascript: 'javascript',
  js: 'javascript',
  json: 'json',
  jsonc: 'jsonc',
  jsx: 'jsx',
  sh: 'bash',
  shell: 'bash',
  text: 'text',
  ts: 'typescript',
  tsx: 'tsx',
  typescript: 'typescript',
} as const

export type CodeLanguage = keyof typeof languages

export type CodeBlockProps = Readonly<{ code: string; language?: CodeLanguage }>

const theme = highlighter.getTheme('github-dark')
const rootStyle: CSSProperties = { backgroundColor: theme.bg, color: theme.fg }
const fontStyle = { bold: 2, italic: 1, none: 0, underline: 4 }

// oxlint-disable-next-line eslint/no-bitwise -- TextMate combines these styles into a bitmask.
const hasFontStyle = (flags: number, mask: number): boolean => Boolean(flags & mask)

const tokenStyle = (token: TokenStyles): CSSProperties => {
  const flags = token.fontStyle ?? fontStyle.none
  return {
    color: token.color ?? theme.fg,
    ...(Predicate.isNullish(token.bgColor) ? {} : { backgroundColor: token.bgColor }),
    ...(hasFontStyle(flags, fontStyle.italic) ? { fontStyle: 'italic' } : {}),
    ...(hasFontStyle(flags, fontStyle.bold) ? { fontWeight: 'bold' } : {}),
    ...(hasFontStyle(flags, fontStyle.underline) ? { textDecoration: 'underline' } : {}),
  }
}

// Server-rendered tokens stay text nodes, including HTML-looking source excerpts.
export const CodeBlock = ({ code, language = 'text' }: CodeBlockProps): JSX.Element => {
  if (!Object.hasOwn(languages, language)) {
    // oxlint-disable-next-line rules/require-tagged-error -- Preserve the TypeError contract for callers passing an invalid language.
    throw new TypeError('CodeBlock received an unsupported language.')
  }
  const lang = languages[language]
  const lines = highlighter.codeToTokensBase(code, { lang, theme: 'github-dark' })
  // Shiki omits line delimiters from tokens. Reinsert the original delimiters,
  // Not an unconditional trailing newline or trimmed/normalized source string.
  const endings = code.match(/\r?\n/gu) ?? []

  return (
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- Keyboard users must be able to focus and scroll wide code excerpts.
    <pre className='shiki github-dark' data-code-block='' data-language={lang} style={rootStyle} tabIndex={0}>
      <code>
        {lines.map((line, lineIndex) => (
          <Fragment key={lineIndex}>
            <span className='line'>
              {line.map((token, tokenIndex) => (
                <span key={tokenIndex} style={tokenStyle(token)}>
                  {token.content}
                </span>
              ))}
            </span>
            {endings[lineIndex] ?? ''}
          </Fragment>
        ))}
      </code>
    </pre>
  )
}

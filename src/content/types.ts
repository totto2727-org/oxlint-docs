import type { MarkdownError } from '@effront/markdown'
import { Schema } from 'effect'
import type { Effect } from 'effect'
import type { ReactNode } from 'react'

const heading = Schema.Struct({ id: Schema.String, title: Schema.String })
const metadata = Schema.Struct({
  description: Schema.String,
  group: Schema.optional(Schema.String),
  headings: Schema.Array(heading),
  section: Schema.Literals(['Getting started', 'Presets', 'Rules']),
  slug: Schema.String,
  title: Schema.String,
})

export type DocPage = typeof metadata.Type
export type RenderableDocPage = DocPage & { content: () => Effect.Effect<ReactNode, MarkdownError> }

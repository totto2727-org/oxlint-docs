import type { JSX, ReactNode } from 'react'
import { Info, Lightbulb, MessageSquareWarning, OctagonAlert, TriangleAlert } from 'lucide-react'

const alerts = {
  caution: { Icon: OctagonAlert, title: 'Caution' },
  important: { Icon: MessageSquareWarning, title: 'Important' },
  note: { Icon: Info, title: 'Note' },
  tip: { Icon: Lightbulb, title: 'Tip' },
  warning: { Icon: TriangleAlert, title: 'Warning' },
} as const

type AlertComponent = (props: { children?: ReactNode }) => JSX.Element

const alertComponent = (type: keyof typeof alerts): AlertComponent => {
  const { title, Icon } = alerts[type]
  // oxlint-disable-next-line react/only-export-components -- Comark looks up server-rendered alerts in the exported registry.
  const MarkdownAlert = ({ children }: { children?: ReactNode }): JSX.Element => (
    <aside className='docs-alert' data-alert={type} aria-label={title}>
      <p className='docs-alert-title'>
        <Icon size={16} aria-hidden='true' />
        {title}
      </p>
      <div className='docs-alert-body'>{children}</div>
    </aside>
  )
  return MarkdownAlert
}

// Comark's default alert plugin resolves its `as` attribute through this map.
export const markdownAlertComponents = {
  caution: alertComponent('caution'),
  important: alertComponent('important'),
  note: alertComponent('note'),
  tip: alertComponent('tip'),
  warning: alertComponent('warning'),
}

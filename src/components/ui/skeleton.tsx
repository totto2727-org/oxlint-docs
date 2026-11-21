// oxlint-disable-next-line import/no-relative-parent-imports -- Shared class merging lives in the app's library directory.
import { cn } from '../../lib/utils.ts'

// oxlint-disable-next-line eslint/func-style -- React's component-definition rule requires a named declaration.
export function Skeleton({ className, ...props }: React.ComponentProps<'div'>): React.JSX.Element {
  // oxlint-disable-next-line react/jsx-props-no-spreading -- Forward native div attributes to the placeholder.
  return <div data-slot='skeleton' className={cn('animate-pulse rounded-md bg-accent', className)} {...props} />
}

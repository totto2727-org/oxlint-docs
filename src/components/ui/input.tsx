'use client'

/* oxlint-disable react/jsx-props-no-spreading -- Forward native input attributes, including form and accessibility props. */
import * as React from 'react'
// oxlint-disable-next-line import/no-relative-parent-imports -- Shared class merging lives in the app's library directory.
import { cn } from '../../lib/utils.ts'

export const Input = ({ className, type, ...props }: React.ComponentProps<'input'>): React.JSX.Element => (
  <input
    type={type}
    data-slot='input'
    className={cn(
      'h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  />
)

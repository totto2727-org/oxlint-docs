'use client'

/* oxlint-disable react/forbid-component-props, react/jsx-props-no-spreading -- Forward styled native attributes to Radix's separator. */

import * as React from 'react'
import { Separator as SeparatorPrimitive } from 'radix-ui'
// oxlint-disable-next-line import/no-relative-parent-imports -- Reuse the application's class merging helper.
import { cn } from '../../lib/utils.ts'

export const Separator = ({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>): React.JSX.Element => (
  <SeparatorPrimitive.Root
    data-slot='separator'
    decorative={decorative}
    orientation={orientation}
    className={cn(
      'shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
      className,
    )}
    {...props}
  />
)

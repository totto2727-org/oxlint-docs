'use client'

import * as React from 'react'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
// oxlint-disable-next-line import/no-relative-parent-imports -- Reuse the application's class merging helper.
import { cn } from '../../lib/utils.ts'

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    defaultVariants: { size: 'default', variant: 'default' },
    variants: {
      size: { default: 'h-9 px-4 py-2', icon: 'size-9' },
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
    },
  },
)

export const Button = ({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean }): React.JSX.Element => {
  const Comp = asChild ? Slot.Root : 'button'
  // oxlint-disable-next-line react/forbid-component-props, react/jsx-props-no-spreading -- The Radix Slot must receive native button props and the merged class name.
  return <Comp data-slot='button' className={cn(buttonVariants({ size, variant }), className)} {...props} />
}

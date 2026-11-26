'use client'

/* oxlint-disable react/no-multi-comp -- Keep the related Radix tooltip slots together. */
/* oxlint-disable react/forbid-component-props, react/jsx-props-no-spreading -- These wrappers forward Radix attributes and Tailwind styles. */
import * as React from 'react'
import { Tooltip as TooltipPrimitive } from 'radix-ui'
// oxlint-disable-next-line import/no-relative-parent-imports -- Reuse the application's class merging helper.
import { cn } from '../../lib/utils.ts'

export const TooltipProvider = ({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>): React.JSX.Element => (
  <TooltipPrimitive.Provider data-slot='tooltip-provider' delayDuration={delayDuration} {...props} />
)

export const Tooltip = (props: React.ComponentProps<typeof TooltipPrimitive.Root>): React.JSX.Element => (
  <TooltipPrimitive.Root data-slot='tooltip' {...props} />
)

export const TooltipTrigger = (props: React.ComponentProps<typeof TooltipPrimitive.Trigger>): React.JSX.Element => (
  <TooltipPrimitive.Trigger data-slot='tooltip-trigger' {...props} />
)

export const TooltipContent = ({
  className,
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>): React.JSX.Element => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      data-slot='tooltip-content'
      sideOffset={sideOffset}
      className={cn(
        'z-50 rounded-md bg-foreground px-2.5 py-1.5 text-xs text-background shadow-md data-[state=closed]:animate-out data-[state=open]:animate-in',
        className,
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
)

'use client'

/* oxlint-disable react/no-multi-comp, react/jsx-max-depth -- Keep the related Radix dialog slots and their accessible portal structure together. */
/* oxlint-disable react/forbid-component-props, react/jsx-props-no-spreading -- These wrappers forward Radix attributes and Tailwind styles. */
import * as React from 'react'
import { XIcon } from 'lucide-react'
import { Dialog as SheetPrimitive } from 'radix-ui'
// oxlint-disable-next-line import/no-relative-parent-imports -- Reuse the application's class merging helper.
import { cn } from '../../lib/utils.ts'

export const Sheet = (props: React.ComponentProps<typeof SheetPrimitive.Root>): React.JSX.Element => (
  <SheetPrimitive.Root data-slot='sheet' {...props} />
)

export const SheetContent = ({
  className,
  children,
  side = 'right',
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: 'top' | 'right' | 'bottom' | 'left'
  showCloseButton?: boolean
}): React.JSX.Element => (
  <SheetPrimitive.Portal data-slot='sheet-portal'>
    <SheetPrimitive.Overlay
      data-slot='sheet-overlay'
      className='fixed inset-0 z-50 bg-black/40 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0'
    />
    <SheetPrimitive.Content
      data-slot='sheet-content'
      className={cn(
        'fixed z-50 flex flex-col bg-background shadow-xl outline-none transition ease-in-out data-[state=closed]:animate-out data-[state=closed]:duration-200 data-[state=open]:animate-in data-[state=open]:duration-300',
        side === 'left' &&
          'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
        side === 'right' &&
          'inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm',
        side === 'top' &&
          'inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
        side === 'bottom' &&
          'inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <SheetPrimitive.Close className='absolute top-3 right-3 rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none'>
          <XIcon className='size-4' />
          <span className='sr-only'>Close</span>
        </SheetPrimitive.Close>
      )}
    </SheetPrimitive.Content>
  </SheetPrimitive.Portal>
)

export const SheetHeader = (props: React.ComponentProps<'div'>): React.JSX.Element => (
  <div data-slot='sheet-header' {...props} />
)

export const SheetTitle = (props: React.ComponentProps<typeof SheetPrimitive.Title>): React.JSX.Element => (
  <SheetPrimitive.Title data-slot='sheet-title' {...props} />
)

export const SheetDescription = (props: React.ComponentProps<typeof SheetPrimitive.Description>): React.JSX.Element => (
  <SheetPrimitive.Description data-slot='sheet-description' {...props} />
)

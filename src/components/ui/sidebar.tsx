'use client'

/* oxlint-disable react/no-multi-comp, react/jsx-max-depth, react/forbid-component-props, react/jsx-props-no-spreading -- Retain the compound sidebar and forward styled native and Radix props unchanged. */
/* oxlint-disable react/function-component-definition -- The preset's eslint/func-style requires function expressions. */
/* oxlint-disable eslint/max-lines, eslint/max-lines-per-function, import/max-dependencies -- Keep this copied compound sidebar and its dependency wiring together. */
/* oxlint-disable react-perf/jsx-no-new-function-as-prop -- Sidebar callbacks capture the current handlers and ref. */
/* oxlint-disable react/only-export-components -- The compound sidebar exports its associated context hook. */
import * as React from 'react'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import { PanelLeftIcon } from 'lucide-react'
import { Slot } from 'radix-ui'
import { Predicate, String } from 'effect'
// oxlint-disable-next-line import/no-relative-parent-imports -- Reuse the application's shared class merger.
import { cn } from '../../lib/utils.ts'
import { Button } from './button.tsx'
import { Input } from './input.tsx'
import { Separator } from './separator.tsx'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './sheet.tsx'
import { Skeleton } from './skeleton.tsx'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip.tsx'
import { useIsMobile } from './use-mobile.ts'

const SIDEBAR_WIDTH = '17rem'
const SIDEBAR_WIDTH_MOBILE = '19rem'
const SIDEBAR_WIDTH_ICON = '3rem'
type SidebarStyle = React.CSSProperties & {
  '--sidebar-width': string
  '--sidebar-width-icon'?: string
}
const mobileSidebarStyle: SidebarStyle = { '--sidebar-width': SIDEBAR_WIDTH_MOBILE }

interface SidebarContextProps {
  state: 'expanded' | 'collapsed'
  open: boolean
  setOpen: (value: boolean | ((value: boolean) => boolean)) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
}
const SidebarContext = React.createContext<SidebarContextProps | undefined>(undefined)

export const useSidebar = (): SidebarContextProps => {
  const context = React.useContext(SidebarContext)
  if (!context) {
    // oxlint-disable-next-line rules/require-tagged-error -- A missing provider is a React integration defect, not a recoverable application error.
    throw new Error('useSidebar must be used within a SidebarProvider.')
  }
  return context
}

// oxlint-disable-next-line eslint/max-statements -- This provider keeps the controlled state, effect, and render setup together.
export const SidebarProvider = ({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}): React.JSX.Element => {
  const isMobile = useIsMobile()
  // oxlint-disable-next-line react-perf/jsx-no-new-object-as-prop -- Compose caller-supplied styles over the defaults each render.
  const wrapperStyle: SidebarStyle = {
    '--sidebar-width': SIDEBAR_WIDTH,
    '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
    ...style,
  }
  const [openMobile, setOpenMobile] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const open = openProp ?? uncontrolledOpen
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const next = Predicate.isFunction(value) ? value(open) : value
      if (setOpenProp) {
        setOpenProp(next)
      } else {
        setUncontrolledOpen(next)
      }
      // oxlint-disable-next-line unicorn/no-document-cookie -- Keep the existing synchronous write and browser support for the sidebar preference.
      document.cookie = `sidebar_state=${next}; path=/; max-age=604800`
    },
    [open, setOpenProp],
  )
  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile(!openMobile)
    } else {
      setOpen((value) => !value)
    }
  }, [isMobile, openMobile, setOpen])
  React.useEffect(() => {
    const handler = (event: KeyboardEvent): void => {
      if (event.key === 'b' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        toggleSidebar()
      }
    }
    globalThis.addEventListener('keydown', handler)
    return () => {
      globalThis.removeEventListener('keydown', handler)
    }
  }, [toggleSidebar])
  const value = React.useMemo(
    () => ({
      isMobile,
      open,
      openMobile,
      setOpen,
      setOpenMobile,
      state: open ? ('expanded' as const) : ('collapsed' as const),
      toggleSidebar,
      triggerRef,
    }),
    [open, setOpen, openMobile, isMobile, toggleSidebar, triggerRef],
  )
  return (
    <SidebarContext.Provider value={value}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot='sidebar-wrapper'
          style={wrapperStyle}
          className={cn('group/sidebar-wrapper flex min-h-svh w-full', className)}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
}

export const Sidebar = ({
  side = 'left',
  collapsible = 'offcanvas',
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  side?: 'left' | 'right'
  collapsible?: 'offcanvas' | 'icon' | 'none'
}): React.JSX.Element => {
  const { isMobile, state, openMobile, setOpenMobile, triggerRef } = useSidebar()
  if (collapsible === 'none') {
    return (
      <div
        data-slot='sidebar'
        className={cn('flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          data-sidebar='sidebar'
          data-mobile='true'
          side={side}
          onCloseAutoFocus={(event) => {
            event.preventDefault()
            triggerRef.current?.focus()
          }}
          className='w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground'
          style={mobileSidebarStyle}
        >
          <SheetHeader className='sr-only'>
            <SheetTitle>Documentation navigation</SheetTitle>
            <SheetDescription>Browse Effront documentation.</SheetDescription>
          </SheetHeader>
          <div className='flex h-full w-full flex-col'>{children}</div>
        </SheetContent>
      </Sheet>
    )
  }
  return (
    <div
      className='group peer hidden text-sidebar-foreground md:block'
      data-state={state}
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      data-side={side}
      data-slot='sidebar'
    >
      <div
        data-slot='sidebar-gap'
        className='relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear group-data-[collapsible=offcanvas]:w-0'
      />
      <div
        data-slot='sidebar-container'
        className={cn(
          'fixed inset-y-0 z-30 hidden h-svh w-(--sidebar-width) border-r border-sidebar-border transition-[left,width] duration-200 ease-linear md:flex',
          side === 'left'
            ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
            : 'right-0',
          className,
        )}
        {...props}
      >
        <div data-sidebar='sidebar' data-slot='sidebar-inner' className='flex h-full w-full flex-col bg-sidebar'>
          {children}
        </div>
      </div>
    </div>
  )
}

export const SidebarTrigger = ({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>): React.JSX.Element => {
  const { toggleSidebar, triggerRef } = useSidebar()
  return (
    <Button
      ref={triggerRef}
      data-sidebar='trigger'
      variant='ghost'
      size='icon'
      className={cn('size-9', className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeftIcon />
      <span className='sr-only'>Toggle navigation</span>
    </Button>
  )
}
export const SidebarInset = ({ className, ...props }: React.ComponentProps<'div'>): React.JSX.Element => (
  <div
    data-slot='sidebar-inset'
    className={cn('relative flex w-full min-w-0 flex-1 flex-col bg-background', className)}
    {...props}
  />
)

export const SidebarHeader = ({ className, ...props }: React.ComponentProps<'div'>): React.JSX.Element => (
  <div
    data-sidebar='header'
    data-slot='sidebar-header'
    className={cn('flex flex-col gap-2 p-3', className)}
    {...props}
  />
)

export const SidebarContent = ({ className, ...props }: React.ComponentProps<'div'>): React.JSX.Element => (
  <div
    data-sidebar='content'
    data-slot='sidebar-content'
    className={cn('flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden', className)}
    {...props}
  />
)

export const SidebarFooter = ({ className, ...props }: React.ComponentProps<'div'>): React.JSX.Element => (
  <div
    data-sidebar='footer'
    data-slot='sidebar-footer'
    className={cn('flex flex-col gap-2 p-3', className)}
    {...props}
  />
)

export const SidebarGroup = ({ className, ...props }: React.ComponentProps<'div'>): React.JSX.Element => (
  <div
    data-sidebar='group'
    data-slot='sidebar-group'
    className={cn('flex w-full min-w-0 flex-col px-3 py-2', className)}
    {...props}
  />
)

export const SidebarGroupLabel = ({ className, ...props }: React.ComponentProps<'div'>): React.JSX.Element => (
  <div
    data-sidebar='group-label'
    data-slot='sidebar-group-label'
    className={cn(
      'px-2 pb-1 text-[0.68rem] font-semibold tracking-[0.14em] text-sidebar-foreground/55 uppercase',
      className,
    )}
    {...props}
  />
)

export const SidebarMenu = ({ className, ...props }: React.ComponentProps<'ul'>): React.JSX.Element => (
  <ul
    data-sidebar='menu'
    data-slot='sidebar-menu'
    className={cn('flex min-w-0 flex-col gap-0.5', className)}
    {...props}
  />
)

export const SidebarMenuItem = (props: React.ComponentProps<'li'>): React.JSX.Element => (
  <li data-sidebar='menu-item' data-slot='sidebar-menu-item' {...props} />
)

const menuButtonVariants = cva(
  'flex min-h-8 w-full items-center gap-2 overflow-hidden rounded-md px-2 py-1.5 text-left text-sm wrap-break-word outline-none transition-colors hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium',
  {
    defaultVariants: { size: 'default' },
    variants: { size: { default: 'min-h-8 h-auto', sm: 'min-h-7 h-auto text-xs' } },
  },
)
export const SidebarMenuButton = ({
  asChild = false,
  isActive = false,
  tooltip,
  className,
  size,
  ...props
}: React.ComponentProps<'button'> & {
  asChild?: boolean
  isActive?: boolean
  tooltip?: string
} & VariantProps<typeof menuButtonVariants>): React.JSX.Element => {
  const Comp = asChild ? Slot.Root : 'button'
  const { isMobile, state } = useSidebar()
  const button = (
    <Comp
      data-sidebar='menu-button'
      data-active={isActive}
      className={cn(menuButtonVariants({ size }), className)}
      {...props}
    />
  )
  return String.isNonEmpty(tooltip ?? '') ? (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side='right' hidden={state !== 'collapsed' || isMobile}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  ) : (
    button
  )
}
export const SidebarInput = ({ className, ...props }: React.ComponentProps<typeof Input>): React.JSX.Element => (
  <Input data-sidebar='input' className={cn('h-8 bg-background', className)} {...props} />
)

export const SidebarSeparator = ({
  className,
  ...props
}: React.ComponentProps<typeof Separator>): React.JSX.Element => (
  <Separator data-sidebar='separator' className={cn('mx-3 w-auto bg-sidebar-border', className)} {...props} />
)

export const SidebarMenuSkeleton = ({ className, ...props }: React.ComponentProps<'div'>): React.JSX.Element => (
  <div data-sidebar='menu-skeleton' className={cn('flex h-8 items-center gap-2 px-2', className)} {...props}>
    <Skeleton className='h-3 w-3/4' />
  </div>
)

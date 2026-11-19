'use client'

import * as React from 'react'

const MOBILE_BREAKPOINT = 768
// oxlint-disable-next-line eslint/no-magic-numbers -- CSS max-width is inclusive while the JS breakpoint is exclusive.
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>()

  React.useEffect(() => {
    const mediaQuery = globalThis.matchMedia(MOBILE_QUERY)
    const onChange = (): void => {
      setIsMobile(globalThis.innerWidth < MOBILE_BREAKPOINT)
    }
    mediaQuery.addEventListener('change', onChange)
    onChange()
    return (): void => {
      mediaQuery.removeEventListener('change', onChange)
    }
  }, [])

  return Boolean(isMobile)
}

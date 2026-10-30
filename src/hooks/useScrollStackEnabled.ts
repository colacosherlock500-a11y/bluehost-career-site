import { useEffect, useState } from 'react'

const QUERY = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)'

/**
 * Whether scroll-pinned card stacks (What we do, Awards) should run: desktop widths
 * only, and never for visitors who prefer reduced motion. Elsewhere sections fall
 * back to a plain layout.
 */
export function useScrollStackEnabled() {
  const [enabled, setEnabled] = useState(() => typeof window !== 'undefined' && window.matchMedia(QUERY).matches)
  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const onChange = () => setEnabled(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return enabled
}

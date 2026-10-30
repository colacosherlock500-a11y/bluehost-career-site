import { useRef, type ReactNode } from 'react'
import { useStackedSections } from '../../hooks/useStackedSections'

/** Each child section slides up over the one before it, which freezes in place while you scroll. */
export function StackOver({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useStackedSections(ref)
  return <div ref={ref}>{children}</div>
}

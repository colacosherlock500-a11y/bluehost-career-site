import { useEffect, useRef, type ReactNode } from 'react'

interface MarqueeProps {
  children: ReactNode
  reverse?: boolean
  /** Seconds per loop when `scrollLinked` is off. */
  duration?: number
  gap?: number
  /**
   * Move with the page instead of on a timer: the row slides sideways as the
   * visitor scrolls (`speed` px of travel per px scrolled).
   */
  scrollLinked?: boolean
  speed?: number
  className?: string
}

/**
 * Infinite horizontal row. Children are rendered twice and the track is
 * shifted by up to one copy's width, so `gap` must also be applied after the last item.
 */
export function Marquee({ children, reverse = false, duration = 40, gap = 81, scrollLinked = false, speed = 0.6, className = '' }: MarqueeProps) {
  const root = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!scrollLinked || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const update = () => {
      raf = 0
      const el = root.current
      const t = track.current
      if (!el || !t) return
      const copy = t.scrollWidth / 2
      // Distance scrolled since the row's top entered the viewport.
      const travelled = (window.innerHeight - el.getBoundingClientRect().top) * speed
      const x = ((travelled % copy) + copy) % copy
      t.style.transform = `translate3d(${reverse ? x - copy : -x}px, 0, 0)`
    }
    const schedule = () => {
      raf ||= requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [scrollLinked, reverse, speed])

  const group = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" style={{ gap, paddingRight: gap }} aria-hidden={hidden || undefined}>
      {children}
    </div>
  )
  return (
    <div ref={root} className={`overflow-hidden ${className}`}>
      <div
        ref={track}
        className={`flex h-full w-max ${scrollLinked ? 'will-change-transform' : `${reverse ? 'animate-marquee-reverse' : 'animate-marquee'} hover:[animation-play-state:paused]`}`}
        style={scrollLinked ? undefined : { animationDuration: `${duration}s` }}
      >
        {group(false)}
        {group(true)}
      </div>
    </div>
  )
}

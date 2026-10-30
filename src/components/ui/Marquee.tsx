import { useEffect, useRef, type ReactNode } from 'react'

interface MarqueeProps {
  children: ReactNode
  reverse?: boolean
  /** Seconds per loop when `scrollLinked` is off. */
  duration?: number
  gap?: number
  /**
   * Move with the page instead of on a timer: the row slides sideways as the
   * visitor scrolls (`speed` px of travel per px scrolled), and it can also be
   * swiped / dragged in either direction so every card can be reached.
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
    const el = root.current
    const t = track.current
    if (!scrollLinked || !el || !t) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let dragOffset = 0 // px added by swiping / dragging
    let velocity = 0 // px per frame, for the flick's momentum
    let drag: { x: number; offset: number; lastX: number; lastT: number; moved: boolean } | null = null

    const render = () => {
      raf = 0
      const copy = t.scrollWidth / 2
      if (!copy) return
      // Distance scrolled since the row's top entered the viewport (still when reduced motion is on).
      const travelled = reduceMotion ? 0 : (window.innerHeight - el.getBoundingClientRect().top) * speed
      const x = ((((travelled + dragOffset) % copy) + copy) % copy)
      t.style.transform = `translate3d(${reverse ? x - copy : -x}px, 0, 0)`
      if (!drag && Math.abs(velocity) > 0.3) {
        dragOffset += velocity
        velocity *= 0.94
        raf = requestAnimationFrame(render)
      }
    }
    const schedule = () => {
      raf ||= requestAnimationFrame(render)
    }

    // Swiping left moves the cards left in either direction of travel.
    const toOffset = (dx: number) => (reverse ? dx : -dx)
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      velocity = 0
      drag = { x: e.clientX, offset: dragOffset, lastX: e.clientX, lastT: performance.now(), moved: false }
    }
    const onMove = (e: PointerEvent) => {
      if (!drag) return
      const dx = e.clientX - drag.x
      if (!drag.moved && Math.abs(dx) > 6) {
        drag.moved = true
        el.setPointerCapture(e.pointerId)
        el.dataset.dragging = ''
      }
      if (!drag.moved) return
      const now = performance.now()
      velocity = (toOffset(e.clientX - drag.lastX) / Math.max(1, now - drag.lastT)) * 16
      drag.lastX = e.clientX
      drag.lastT = now
      dragOffset = drag.offset + toOffset(dx)
      schedule()
    }
    const onUp = () => {
      if (!drag) return
      const moved = drag.moved
      drag = null
      delete el.dataset.dragging
      if (moved) schedule() // starts the momentum
      // Swallow the click that ends a drag so a card link isn't followed.
      if (moved) el.addEventListener('click', e => (e.preventDefault(), e.stopPropagation()), { capture: true, once: true })
    }

    render()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
    }
  }, [scrollLinked, reverse, speed])

  const group = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" style={{ gap, paddingRight: gap }} aria-hidden={hidden || undefined}>
      {children}
    </div>
  )
  return (
    <div
      ref={root}
      // pan-y: vertical page scrolling still works over the row; sideways swipes move the cards.
      className={`overflow-hidden ${scrollLinked ? 'cursor-grab touch-pan-y select-none data-[dragging]:cursor-grabbing [&_img]:pointer-events-none' : ''} ${className}`}
    >
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

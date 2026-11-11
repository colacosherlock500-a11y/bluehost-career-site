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
  /**
   * Flow continuously across the screen (px per second) and also follow swipes / drags.
   * Slows to a quarter while hovered so a card is easy to click; pauses off-screen.
   */
  flow?: number
  speed?: number
  className?: string
}

/**
 * Infinite horizontal row. Children are rendered twice and the track is
 * shifted by up to one copy's width, so `gap` must also be applied after the last item.
 */
export function Marquee({ children, reverse = false, duration = 40, gap = 81, scrollLinked = false, flow, speed = 0.6, className = '' }: MarqueeProps) {
  const interactive = scrollLinked || flow !== undefined
  const root = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current
    const t = track.current
    if (!interactive || !el || !t) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let dragOffset = 0 // px added by swiping / dragging
    let velocity = 0 // px per frame, for the flick's momentum
    let drag: { x: number; offset: number; lastX: number; lastT: number; moved: boolean } | null = null
    // flow mode: distance drifted so far, advanced every frame while visible
    let drift = 0
    let last = 0
    let visible = false
    let hovered = false

    const render = (now = performance.now()) => {
      raf = 0
      const copy = t.scrollWidth / 2
      if (!copy) return
      let travelled = 0
      if (flow !== undefined) {
        const dt = last ? Math.min(64, now - last) : 0
        last = now
        if (!reduceMotion && !drag) drift += (flow * (hovered ? 0.25 : 1) * dt) / 1000
        travelled = drift
      } else if (!reduceMotion) {
        // Distance scrolled since the row's top entered the viewport.
        travelled = (window.innerHeight - el.getBoundingClientRect().top) * speed
      }
      const x = ((((travelled + dragOffset) % copy) + copy) % copy)
      t.style.transform = `translate3d(${reverse ? x - copy : -x}px, 0, 0)`
      const coasting = !drag && Math.abs(velocity) > 0.3
      if (coasting) {
        dragOffset += velocity
        velocity *= 0.94
      }
      if (coasting || (flow !== undefined && visible && !reduceMotion)) raf = requestAnimationFrame(render)
      else last = 0
    }
    const schedule = () => {
      raf ||= requestAnimationFrame(t => render(t))
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

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) schedule()
    })
    io.observe(el)
    const onEnter = () => (hovered = true)
    const onLeave = () => (hovered = false)
    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointerleave', onLeave)

    render()
    if (!flow) window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
    }
  }, [interactive, flow, reverse, speed])

  const group = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" style={{ gap, paddingRight: gap }} aria-hidden={hidden || undefined}>
      {children}
    </div>
  )
  return (
    <div
      ref={root}
      // pan-y: vertical page scrolling still works over the row; sideways swipes move the cards.
      className={`overflow-hidden ${interactive ? 'cursor-grab touch-pan-y select-none data-[dragging]:cursor-grabbing [&_img]:pointer-events-none' : ''} ${className}`}
    >
      <div
        ref={track}
        className={`flex h-full w-max ${interactive ? 'will-change-transform' : `${reverse ? 'animate-marquee-reverse' : 'animate-marquee'} hover:[animation-play-state:paused]`}`}
        style={interactive ? undefined : { animationDuration: `${duration}s` }}
      >
        {group(false)}
        {group(true)}
      </div>
    </div>
  )
}

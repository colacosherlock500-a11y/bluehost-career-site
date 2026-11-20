import { useEffect, useRef, type ReactNode } from 'react'

const HEADER_H = 78

/**
 * "This section can move up when we are scrolling. The upper section just freezes while this
 * one goes up on it" (Maryna's dev note, ref. jobs.uber.com). `under` scrolls normally until
 * its bottom reaches the bottom of the screen, then stays put; `children` (the next section)
 * slides up over it on a rounded sheet, and the frozen section sinks back a little as it is
 * covered. Reduced motion: two ordinary sections.
 */
export function PullUp({ under, children, className = 'bg-white' }: { under: ReactNode; children: ReactNode; className?: string }) {
  const pin = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const sheet = useRef<HTMLDivElement>(null)
  const shade = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const p = pin.current
    const i = inner.current
    const s = sheet.current
    const sh = shade.current
    if (!p || !i || !s || !sh || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const layout = () => {
      // freeze once the whole section is on screen (or its bottom reaches the screen's bottom)
      p.style.top = `${Math.min(HEADER_H, window.innerHeight - p.offsetHeight)}px`
    }
    const update = () => {
      raf = 0
      const vh = window.innerHeight
      const top = s.getBoundingClientRect().top
      // 0 when the sheet starts to cover the frozen section → 1 when it reaches the header
      const c = Math.min(1, Math.max(0, (vh - top) / (vh - HEADER_H)))
      i.style.scale = String(1 - 0.06 * c)
      // a dark veil that fades in (cheaper and steadier than a CSS filter on a large section)
      sh.style.opacity = String(0.25 * c)
    }
    const schedule = () => {
      raf ||= requestAnimationFrame(update)
    }
    const ro = new ResizeObserver(() => {
      layout()
      schedule()
    })
    ro.observe(p)
    layout()
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      p.style.top = ''
      i.style.scale = ''
      sh.style.opacity = '0'
    }
  }, [])

  return (
    <div className="relative">
      <div ref={pin} className="sticky z-0 motion-reduce:static">
        <div ref={inner} className="relative origin-[50%_100%]">
          {under}
          <div ref={shade} aria-hidden className="pointer-events-none absolute inset-0 bg-[#011838] opacity-0" />
        </div>
      </div>
      <div
        ref={sheet}
        className={`relative z-[1] rounded-t-[clamp(24px,3vw,40px)] shadow-[0_-30px_60px_rgba(0,42,102,0.12)] [overflow:clip] motion-reduce:rounded-none motion-reduce:shadow-none ${className}`}
      >
        {children}
      </div>
    </div>
  )
}

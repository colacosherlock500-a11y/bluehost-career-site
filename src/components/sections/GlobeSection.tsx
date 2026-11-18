import { useEffect, useRef, useState, type ReactNode } from 'react'
import { visitorCountry } from '../../lib/visitorCountry'
import { useT } from '../../i18n/I18n'
import { SectionHeader } from '../ui/SectionHeader'
import { Globe } from './Globe'

/** How big the globe starts (QA: "animate it from large to small"). */
const START_SCALE = 1.9
/** How far below its resting place the globe starts, as a share of the screen height. */
const START_Y = 0.62
/** Scroll distance (share of the screen height) the section stays pinned while the globe rises. */
const PIN = 0.9
const HEADER_H = 78

/**
 * "Pull up" (HR, ref. jobs.uber.com): the section pins and the globe rises from below the
 * fold like a planet coming over the horizon, shrinking to its resting size as it climbs.
 * Driven straight from the scroll position, so it reverses when scrolling back up.
 * Calls `onSettled(true)` once it has landed (and `false` if the visitor scrolls back).
 * Reduced motion: no pin, no animation.
 */
function usePullUp(
  section: React.RefObject<HTMLElement | null>,
  stage: React.RefObject<HTMLDivElement | null>,
  globe: React.RefObject<HTMLDivElement | null>,
  onSettled: (settled: boolean) => void,
) {
  const cb = useRef(onSettled)
  cb.current = onSettled
  useEffect(() => {
    const sec = section.current
    const st = stage.current
    const el = globe.current
    if (!sec || !st || !el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cb.current(true)
      return
    }
    let raf = 0
    let settled: boolean | null = null
    let top = HEADER_H
    const layout = () => {
      const vh = window.innerHeight
      const h = st.offsetHeight
      // centred under the header when it fits; otherwise pinned with its bottom on the screen's
      top = h <= vh - HEADER_H ? Math.max(HEADER_H, (vh + HEADER_H - h) / 2) : vh - h
      st.style.top = `${top}px`
      sec.style.height = `${h + vh * PIN}px`
    }
    const update = () => {
      raf = 0
      const vh = window.innerHeight
      const r = sec.getBoundingClientRect()
      // 0 as the section enters the bottom of the screen → 1 at the end of the pin
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh - top + vh * PIN)))
      const e = 1 - (1 - p) ** 2.4
      el.style.scale = String(START_SCALE - (START_SCALE - 1) * e)
      el.style.translate = `0 ${Math.round(vh * START_Y * (1 - e))}px`
      const now = p >= 0.995
      if (now !== settled) {
        settled = now
        cb.current(now)
      }
    }
    const schedule = () => {
      raf ||= requestAnimationFrame(update)
    }
    const ro = new ResizeObserver(() => {
      layout()
      schedule()
    })
    ro.observe(st)
    layout()
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      sec.style.height = ''
      st.style.top = ''
    }
  }, [section, stage, globe])
}

export function GlobeSection({
  eyebrow = 'Around the World',
  title = 'One team, connected across the globe' as ReactNode,
  body = 'From Cebu to Florianópolis and from Mumbai to Jacksonville, our people bring different cultures, languages, and ideas to one shared purpose.',
  selected,
  onSelect,
  initialCountry,
  id,
}: {
  eyebrow?: string
  title?: ReactNode
  body?: string
  selected?: string | null
  onSelect?: (slug: string | null) => void
  /** Country shown once the globe stops moving; defaults to the visitor's (from their time zone). */
  initialCountry?: string
  id?: string
}) {
  const section = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const globe = useRef<HTMLDivElement>(null)
  const [settled, setSettled] = useState(false)
  // Uncontrolled use (home, team and location pages): pick a country right when the globe settles.
  const [own, setOwn] = useState<string | null>(null)
  const picked = useRef(false)
  usePullUp(section, stage, globe, s => {
    setSettled(s)
    if (s && !picked.current && selected === undefined) {
      picked.current = true
      setOwn(initialCountry ?? visitorCountry())
    }
  })
  const t = useT()
  return (
    <section id={id} className="relative px-4 pt-[100px]">
      <SectionHeader className="relative z-[1] mx-auto" eyebrow={t(eyebrow)} title={typeof title === 'string' ? t(title) : title} body={<span className="text-base leading-[1.4] tracking-[-0.08px] text-bh-blue-950">{t(body)}</span>} />
      {/* the title scrolls by; the globe's stage pins while the globe pulls up */}
      <div ref={section}>
      <div ref={stage} className="sticky mx-auto flex max-w-[1440px] flex-col items-center gap-10 overflow-hidden pb-[60px] pt-10 motion-reduce:static">
        <div className="w-full">
          <div ref={globe} className="w-full origin-[50%_0%] will-change-[scale,translate]">
            <Globe
              selected={selected !== undefined ? selected : own}
              onSelect={slug => {
                if (selected === undefined) setOwn(slug)
                onSelect?.(slug)
              }}
              hintVisible={settled}
            />
          </div>
        </div>
        <hr className="mt-6 w-full max-w-[1200px] border-[#e8ecf2]" />
      </div>
      </div>
    </section>
  )
}

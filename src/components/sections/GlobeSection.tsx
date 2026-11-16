import { useEffect, useRef, useState, type ReactNode } from 'react'
import { visitorCountry } from '../../lib/visitorCountry'
import { useT } from '../../i18n/I18n'
import { SectionHeader } from '../ui/SectionHeader'
import { Globe } from './Globe'

/** How big the globe starts when it scrolls into view (QA: "animate it from large to small"). */
const START_SCALE = 2.1
/** How far below its resting place the globe starts (HR: "position animation, moving up the page"). */
const START_Y = 220

/**
 * Scales the globe from large to its resting size and slides it up into place as it
 * scrolls into view (ref. jobs.uber.com). Driven straight from the scroll position, so it
 * reverses when scrolling back up. Calls `onSettled(true)` once the motion has finished
 * (and `false` if the visitor scrolls back before it). Reduced motion: no animation.
 */
function useArriveOnScroll(ref: React.RefObject<HTMLDivElement | null>, onSettled: (settled: boolean) => void) {
  const cb = useRef(onSettled)
  cb.current = onSettled
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cb.current(true)
      return
    }
    let raf = 0
    let settled: boolean | null = null
    const update = () => {
      raf = 0
      const vh = window.innerHeight
      const top = el.parentElement!.getBoundingClientRect().top
      // 0 when the globe's slot enters the bottom of the screen, 1 once it reaches ~20% from the top
      const p = Math.min(1, Math.max(0, (vh - top) / (vh * 0.8)))
      const e = 1 - (1 - p) ** 3
      el.style.scale = String(START_SCALE - (START_SCALE - 1) * e)
      el.style.translate = `0 ${Math.round(START_Y * (1 - e))}px`
      el.style.opacity = String(0.35 + 0.65 * Math.min(1, p * 1.6))
      const now = p >= 0.995
      if (now !== settled) {
        settled = now
        cb.current(now)
      }
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
  }, [ref])
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
  const globe = useRef<HTMLDivElement>(null)
  const [settled, setSettled] = useState(false)
  // Uncontrolled use (home, team and location pages): pick a country right when the globe settles.
  const [own, setOwn] = useState<string | null>(null)
  const picked = useRef(false)
  useArriveOnScroll(globe, s => {
    setSettled(s)
    if (s && !picked.current && selected === undefined) {
      picked.current = true
      setOwn(initialCountry ?? visitorCountry())
    }
  })
  const t = useT()
  return (
    <section id={id} className="overflow-x-clip px-4 pb-[60px] pt-[100px]">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-10">
        <SectionHeader className="relative z-[1]" eyebrow={t(eyebrow)} title={typeof title === 'string' ? t(title) : title} body={<span className="text-base leading-[1.4] tracking-[-0.08px] text-bh-blue-950">{t(body)}</span>} />
        <div className="w-full">
          <div ref={globe} className="w-full origin-[50%_35%] will-change-[scale,translate]">
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
    </section>
  )
}

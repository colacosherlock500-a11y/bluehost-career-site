import { useEffect, useRef, type ReactNode } from 'react'
import { useT } from '../../i18n/I18n'
import { SectionHeader } from '../ui/SectionHeader'
import { Globe } from './Globe'

/** How big the globe starts when it scrolls into view (QA: "animate it from large to small"). */
const START_SCALE = 2.1

/**
 * Scales the globe from large to its resting size as it scrolls up into view
 * (ref. jobs.uber.com). Driven straight from the scroll position, so it reverses
 * when scrolling back up. Reduced motion: no scaling.
 */
function useShrinkOnScroll(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const update = () => {
      raf = 0
      const vh = window.innerHeight
      const top = el.parentElement!.getBoundingClientRect().top
      // 0 when the globe's slot enters the bottom of the screen, 1 once it reaches ~20% from the top
      const p = Math.min(1, Math.max(0, (vh - top) / (vh * 0.8)))
      const e = 1 - (1 - p) ** 3
      el.style.scale = String(START_SCALE - (START_SCALE - 1) * e)
      el.style.opacity = String(0.35 + 0.65 * Math.min(1, p * 1.6))
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
  id,
}: {
  eyebrow?: string
  title?: ReactNode
  body?: string
  selected?: string | null
  onSelect?: (slug: string | null) => void
  id?: string
}) {
  const globe = useRef<HTMLDivElement>(null)
  useShrinkOnScroll(globe)
  const t = useT()
  return (
    <section id={id} className="overflow-x-clip px-4 pb-[60px] pt-[100px]">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-10">
        <SectionHeader className="relative z-[1]" eyebrow={t(eyebrow)} title={typeof title === 'string' ? t(title) : title} body={<span className="text-base leading-[1.4] tracking-[-0.08px] text-bh-blue-950">{t(body)}</span>} />
        <div className="w-full">
          <div ref={globe} className="w-full origin-[50%_35%] will-change-[scale]">
            <Globe selected={selected} onSelect={onSelect} />
          </div>
        </div>
        <hr className="mt-6 w-full max-w-[1200px] border-[#e8ecf2]" />
      </div>
    </section>
  )
}

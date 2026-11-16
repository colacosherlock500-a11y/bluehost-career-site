import { useEffect, useRef, useState, type CSSProperties, type Ref } from 'react'
import buildBg from '../../../assets/img/life/what-we-do/build-bg.webp'
import buildMockup from '../../../assets/img/life/what-we-do/build-mockup.webp'
import hostBg from '../../../assets/img/life/what-we-do/host-bg.webp'
import hostMockup from '../../../assets/img/life/what-we-do/host-mockup.webp'
import runBg from '../../../assets/img/life/what-we-do/run-bg.webp'
import runMockup from '../../../assets/img/life/what-we-do/run-mockup.webp'
import { useScrollStackEnabled } from '../../../hooks/useScrollStackEnabled'

interface Pillar {
  tab: string
  line: string
  title: string
  body: string
  bg: string
  mockup: string
  mockupAlt: string
  /** Dark text on a light card ("Run your business"). */
  light?: boolean
}

const pillars: Pillar[] = [
  {
    tab: 'Build anything',
    line: 'Build anything.',
    title: 'Dream it, describe it, and create it with AI.',
    body: 'Our AI-powered app and website builders turn an idea into a live business, with domains, email, and security ready from the start.',
    bg: buildBg,
    mockup: buildMockup,
    mockupAlt: 'An AI website builder generating a matcha shop website from a written prompt',
  },
  {
    tab: 'Host anything',
    line: 'Host anything.',
    title: 'Seamless hosting with predictable pricing.',
    body: 'Whatever our customers build, and wherever they build it, we give it a fast, reliable, and secure home that is simple to manage and easy to scale.',
    bg: hostBg,
    mockup: hostMockup,
    mockupAlt: 'The Bluehost hosting dashboard showing a Starter Hosting plan and a new WordPress website',
  },
  {
    tab: 'Run your business',
    line: 'Run your business.',
    title: 'AI agents that help grow revenue.',
    body: 'Smart agents help businesses get found, run campaigns across social, email, and search, and turn visitors into customers, with real people ready to help along the way.',
    bg: runBg,
    mockup: runMockup,
    mockupAlt: 'An AI agent chatting with a customer and booking an appointment',
    light: true,
  },
]

/** Height of each card's header strip that stays visible when the next card covers it. */
const TAB = 36.5
const HEADER = 78

/**
 * One Figma pillar card (587 × 505); the mockup is its lower 54%.
 * `flow` (phones / reduced motion): text above the mockup at any width instead of the fixed card shape.
 */
function PillarCard({ pillar, flow = false, className = '', style, ref }: { pillar: Pillar; flow?: boolean; className?: string; style?: CSSProperties; ref?: Ref<HTMLElement> }) {
  const text = pillar.light ? 'text-black' : 'text-white'
  const eyebrow = (
    <p className={`text-center text-sm font-medium uppercase leading-[1.2] tracking-[2px] ${pillar.light ? 'text-bh-blue-1100' : 'text-white'} ${flow ? 'relative' : 'absolute inset-x-0 top-[13px]'}`}>{pillar.tab}</p>
  )
  const copy = (
    <div className={`flex flex-col gap-[17px] ${text} ${flow ? 'relative px-6 pt-5' : 'absolute inset-x-[6.8%] top-[10.9%]'}`}>
      <h3 className="text-[clamp(22px,2.2vw,32px)] font-semibold leading-[1.3] tracking-[-0.32px]">{pillar.title}</h3>
      <p className="max-w-[472px] text-[clamp(14px,1.1vw,16px)] leading-[1.4] tracking-[-0.16px]">{pillar.body}</p>
    </div>
  )
  return (
    <article ref={ref} className={`w-full overflow-hidden rounded-2xl shadow-[0_-6px_24px_rgba(0,42,102,0.16)] ${flow ? 'relative flex flex-col pt-[13px]' : 'aspect-[587/505]'} ${className}`} style={style}>
      <img src={pillar.bg} alt="" className="absolute inset-0 size-full object-cover" />
      {eyebrow}
      {copy}
      <img
        src={pillar.mockup}
        alt={pillar.mockupAlt}
        className={flow ? 'relative mt-2 w-full [mask-image:linear-gradient(to_bottom,transparent,black_14%)]' : 'absolute inset-x-0 bottom-0 w-full'}
      />
    </article>
  )
}

/**
 * "What we do" — Figma dev note: "Cards change while we are scrolling".
 * The section pins while the visitor scrolls; "Host anything" then "Run your business"
 * slide up over the previous card, leaving its header strip visible as a tab.
 */
export function WhatWeDo() {
  const scrollStack = useScrollStackEnabled()
  const section = useRef<HTMLElement>(null)
  const pinned = useRef<HTMLDivElement>(null)
  const cards = useRef<(HTMLElement | null)[]>([])
  const [active, setActive] = useState(scrollStack ? 0 : pillars.length - 1)
  const [pinH, setPinH] = useState(600)
  useEffect(() => {
    const p = pinned.current
    if (!p) return
    const ro = new ResizeObserver(() => setPinH(p.offsetHeight))
    ro.observe(p)
    return () => ro.disconnect()
  }, [scrollStack])

  useEffect(() => {
    if (!scrollStack) {
      setActive(pillars.length - 1)
      return
    }
    let raf = 0
    const update = () => {
      raf = 0
      const s = section.current
      const p = pinned.current
      if (!s || !p) return
      const travel = s.offsetHeight - p.offsetHeight
      const pinTop = parseFloat(getComputedStyle(p).top) || HEADER
      // 0 → 2 across the pinned scroll distance: one step per incoming card.
      const progress = Math.min(1, Math.max(0, (pinTop - s.getBoundingClientRect().top) / travel)) * (pillars.length - 1)
      cards.current.forEach((card, i) => {
        if (!card || i === 0) return
        const t = Math.min(1, Math.max(0, progress - (i - 1)))
        card.style.transform = `translate3d(0, ${(1 - t) * (card.offsetHeight + TAB * pillars.length + 40)}px, 0)`
      })
      setActive(progress < 0.5 ? 0 : progress < 1.5 ? 1 : 2)
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
  }, [scrollStack])

  const intro = (
    <div className="flex flex-col gap-6 px-2 lg:px-[53px]">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium uppercase leading-[1.2] tracking-[2px]">What we do</p>
        <h2 className="text-[clamp(30px,3vw,40px)] font-semibold leading-[1.3] tracking-[-0.4px]">
          {pillars.map((p, i) => (
            <span key={p.tab} className={`block transition-colors duration-300 ${i === active ? 'text-bh-blue' : ''}`}>
              {p.line}
            </span>
          ))}
        </h2>
      </div>
      <p className="max-w-[472px] text-base leading-[1.4] tracking-[-0.16px]">
        Three pillars guide everything our brands create, so business builders can go from idea to growth on one simple and helpful platform.
        <br />
        <br />
        Whatever your role or brand, your work connects to these pillars and to the millions of businesses that depend on them.
      </p>
    </div>
  )

  if (!scrollStack) {
    return (
      <section className="px-4 py-[30px]">
        <div className="mx-auto flex max-w-[640px] flex-col gap-8">
          {intro}
          <div className="flex flex-col gap-5">
            {pillars.map(p => (
              <PillarCard key={p.tab} pillar={p} flow />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    // The extra height is the scroll distance over which the cards change. The pinned block is
    // only as tall as its content (no empty band above or below the section, HR feedback) and
    // pins centred in the space under the header.
    <section ref={section} className="relative h-[calc(var(--pin-h,600px)+120vh)] py-0" style={{ '--pin-h': `${pinH}px` } as CSSProperties}>
      <div ref={pinned} className="sticky flex items-center px-4 py-8" style={{ top: `max(${HEADER}px, calc(50vh + ${HEADER / 2}px - ${pinH / 2}px))` }}>
        <div className="mx-auto grid w-full max-w-[1204px] grid-cols-2 items-center gap-[30px]">
          {intro}
          {/* Keep the whole stack on screen on short laptop displays. */}
          <div className="relative w-full overflow-hidden" style={{ maxWidth: `min(587px, calc((100vh - ${HEADER + 40}px - ${TAB * 2}px) * 587 / 505))` }}>
            <div className="aspect-[587/505] w-full" style={{ marginTop: TAB * 2 }} aria-hidden />
            {pillars.map((p, i) => (
              <PillarCard
                key={p.tab}
                pillar={p}
                ref={el => {
                  cards.current[i] = el
                }}
                className="absolute inset-x-0 will-change-transform"
                style={{ top: i * TAB, zIndex: i + 1, transform: i === 0 ? undefined : 'translate3d(0, 120%, 0)' }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

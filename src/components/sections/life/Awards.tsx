import { useEffect, useRef, useState, type Ref, type RefObject } from 'react'
import headset from '../../../assets/img/awards/headset.svg'
import medalBlue from '../../../assets/img/awards/medal-blue.svg'
import medalBronze from '../../../assets/img/awards/medal-bronze.svg'
import medalSilver from '../../../assets/img/awards/medal-silver.svg'
import trend from '../../../assets/img/awards/trend.svg'
import users from '../../../assets/img/awards/users.svg'
import { useScrollStackEnabled } from '../../../hooks/useScrollStackEnabled'

interface Award {
  name: string
  detail?: string
  year: string
}

const medal = (year: string) => (/silver/i.test(year) ? medalSilver : /bronze/i.test(year) ? medalBronze : medalBlue)

interface AwardGroup {
  title: string
  icon: string
  note?: string
  awards: Award[]
}

const groups: AwardGroup[] = [
  {
    title: 'A workplace people are proud of',
    icon: users,
    note: 'Awarded to Newfold Digital, the parent company of Bluehost.',
    awards: [
      'Top Workplace in the Technology Industry',
      'Top Workplaces for Remote Work',
      'Top Workplace for Employee Well-Being',
      'Top Workplace for Professional Development',
      'Top Workplace for Purpose and Values',
      'Top Workplace for Work-Life Flexibility',
      'Top Workplace for Leadership',
      'Top Workplace for Innovation',
      'Top Workplace for Employee Appreciation',
      'Top Workplace for Compensation and Benefits',
    ].map(name => ({ name, year: '2026' })),
  },
  {
    title: 'Customer experience that earns trust',
    icon: headset,
    awards: [
      { name: 'Stevie® Awards', detail: 'Contact Center of the Year (Over 100 Seats), Technology Industries', year: 'Silver · 2026' },
      { name: 'Stevie® Awards', detail: 'Customer Service Department of the Year, Global Operations', year: 'Silver · 2026' },
      { name: 'Stevie® Awards', detail: 'Customer Service Transformation Award, Business and Financial Services', year: 'Silver · 2026' },
      { name: 'BIG Awards for Business', detail: 'Excellence in Customer Service', year: '2023' },
    ],
  },
  {
    title: 'Products that help businesses grow',
    icon: trend,
    awards: [
      { name: 'Titan Business Awards', detail: 'Web Services Solution', year: 'Silver · 2026' },
      { name: 'MarTech Breakthrough Awards', detail: 'Best eCommerce Web Platform', year: '2025' },
      { name: 'Horizon Interactive Awards', detail: 'Online Store and Marketplace for eCommerce', year: 'Bronze · 2023' },
      { name: 'Stevie® Awards', detail: 'eCommerce Solutions', year: 'Bronze · 2023' },
      { name: 'BIG Awards for Business', detail: 'Bluehost Online Store and Marketplace, Product of the Year', year: '2022' },
      { name: 'The Ad Club Hatch Awards', detail: 'Film Advertisement', year: 'Bronze · 2022' },
      { name: 'U.S. News 360 Reviews', detail: 'Best Web Hosting Services of 2022', year: '2022' },
    ],
  },
]

const stats: [string, string][] = [
  ['21', 'awards and honors across our people, service and products'],
  ['10', 'Top Workplace awards in 2026'],
  ['4', 'Stevie® Awards for customer service and eCommerce'],
]

/** Height of a card's header, which stays visible as a tab once the next card covers it. */
const TAB = 88
const HEADER = 78

function GroupHeader({ group }: { group: AwardGroup }) {
  return (
    <>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-icon-bg">
        <img src={group.icon} alt="" className="size-[26px]" />
      </span>
      <span className="flex-1 text-[18px] font-medium">{group.title}</span>
      <span className="shrink-0 rounded-full bg-bh-blue px-3 py-0.5 text-xs font-medium text-white">{group.awards.length} awards</span>
    </>
  )
}

function AwardList({ group, className = '', ref }: { group: AwardGroup; className?: string; ref?: Ref<HTMLUListElement> }) {
  return (
    <ul ref={ref} className={`px-6 pb-4 ${className}`}>
      {group.awards.map((a, k) => (
        <li key={k} className="flex items-center gap-4 border-t border-[#eef2f7] py-3">
          <img src={medal(a.year)} alt="" className="size-9 shrink-0" />
          <span className="flex flex-1 flex-col">
            <span className="text-sm font-semibold">{a.name}</span>
            {a.detail && <span className="text-[13px] text-night-sky">{a.detail}</span>}
          </span>
          <span className="shrink-0 rounded-full bg-bh-light-0 px-2.5 py-0.5 text-xs text-bh-blue">{a.year}</span>
        </li>
      ))}
      {group.note && <li className="pt-2 text-xs text-night-sky">{group.note}</li>}
    </ul>
  )
}

/** Phones / reduced motion: one group open at a time. */
function AwardAccordion() {
  const [open, setOpen] = useState(2)
  return (
    <div className="flex flex-col gap-2">
      {groups.map((g, i) => {
        const isOpen = open === i
        return (
          <div key={g.title} className="overflow-hidden rounded-2xl border border-bh-light-200 bg-white shadow-[0_8px_30px_rgba(0,42,102,0.06)]">
            <button onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen} className="flex w-full items-center gap-4 px-6 py-5 text-left">
              <GroupHeader group={g} />
            </button>
            {isOpen && <AwardList group={g} className="animate-[fadeUp_0.3s_ease-out]" />}
          </div>
        )
      })}
    </div>
  )
}

/**
 * Desktop: the section pins while you scroll. The front card's list scrolls until every
 * award has been seen, then the next group slides up over it, leaving its header as a tab.
 */
function AwardStack({ section, pinned }: { section: RefObject<HTMLElement | null>; pinned: RefObject<HTMLDivElement | null> }) {
  const stack = useRef<HTMLDivElement>(null)
  const cards = useRef<(HTMLElement | null)[]>([])
  const lists = useRef<(HTMLUListElement | null)[]>([])

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const s = section.current
      const p = pinned.current
      const st = stack.current
      if (!s || !p || !st) return
      const enter = st.clientHeight + 40
      // Scroll distance per step: each card slides in, then its list scrolls through its overflow.
      const steps: { len: number; apply: (t: number) => void }[] = []
      groups.forEach((_, i) => {
        const card = cards.current[i]
        const list = lists.current[i]
        if (!card || !list) return
        if (i > 0) steps.push({ len: enter, apply: t => (card.style.transform = `translate3d(0, ${(1 - t) * enter}px, 0)`) })
        const overflow = Math.max(0, list.scrollHeight - (list.parentElement?.clientHeight ?? 0))
        steps.push({ len: overflow, apply: t => (list.style.transform = `translate3d(0, ${-t * overflow}px, 0)`) })
      })
      const total = steps.reduce((sum, x) => sum + x.len, 0)
      const height = `${p.offsetHeight + total}px`
      if (s.style.height !== height) s.style.height = height
      const d = Math.min(total, Math.max(0, HEADER - s.getBoundingClientRect().top))
      let start = 0
      for (const step of steps) {
        step.apply(step.len ? Math.min(1, Math.max(0, (d - start) / step.len)) : d >= start ? 1 : 0)
        start += step.len
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
  }, [section, pinned])

  return (
    <div ref={stack} className="relative h-[min(760px,calc(100vh-78px-120px))] overflow-hidden">
      {groups.map((g, i) => (
        <article
          key={g.title}
          ref={el => {
            cards.current[i] = el
          }}
          className="absolute inset-x-0 bottom-0 flex flex-col overflow-hidden rounded-2xl border border-[#a9c6f5] bg-gradient-to-b from-[#f5f9ff] to-white to-[120px] shadow-[0_-10px_30px_rgba(0,42,102,0.08)] will-change-transform"
          style={{ top: i * TAB, zIndex: i + 1, transform: i === 0 ? undefined : 'translate3d(0, 110%, 0)' }}
        >
          <header className="flex shrink-0 items-center gap-4 px-6" style={{ height: TAB }}>
            <GroupHeader group={g} />
          </header>
          <div className="min-h-0 flex-1 overflow-hidden">
            <AwardList
              group={g}
              className="will-change-transform"
              ref={el => {
                lists.current[i] = el
              }}
            />
          </div>
        </article>
      ))}
    </div>
  )
}

/** "Recognized for our people and our work" — stats + award groups (scroll-stacked on desktop). */
export function Awards({ id }: { id?: string }) {
  const scrollStack = useScrollStackEnabled()
  const section = useRef<HTMLElement>(null)
  const pinned = useRef<HTMLDivElement>(null)
  const intro = (
    <div className="flex flex-col gap-6">
      <p className="eyebrow">Recognition</p>
      <h2 className="h-section">
        Recognized for <span className="text-bh-blue">our people and our work</span>
      </h2>
      <p className="text-base leading-[1.4]">Every award reflects what our teams build together, for our customers and for each other.</p>
      <ul className="mt-4 flex flex-col gap-3">
        {stats.map(([n, l]) => (
          <li key={l} className="flex items-center gap-6 rounded-xl bg-white/70 px-6 py-4">
            <span className="w-12 text-[38px] font-semibold leading-none text-bh-blue">{n}</span>
            <span className="text-sm leading-[1.4]">{l}</span>
          </li>
        ))}
      </ul>
    </div>
  )

  if (!scrollStack) {
    return (
      <section id={id} className="scroll-mt-24 bg-gradient-to-b from-[#e6f3ff] to-[#d4e9ff] px-4 py-[100px]">
        <div className="mx-auto grid max-w-[1200px] items-start gap-12 lg:grid-cols-[420px_1fr] lg:gap-[90px]">
          {intro}
          <AwardAccordion />
        </div>
      </section>
    )
  }

  return (
    // Height is set from the scroll distance the stack needs (see AwardStack).
    <section id={id} ref={section} className="relative scroll-mt-24 bg-gradient-to-b from-[#e6f3ff] to-[#d4e9ff]">
      <div ref={pinned} className="sticky top-[78px] flex h-[calc(100vh-78px)] items-center px-4">
        <div className="mx-auto grid w-full max-w-[1200px] grid-cols-[420px_1fr] items-center gap-[90px]">
          {intro}
          <AwardStack section={section} pinned={pinned} />
        </div>
      </div>
    </section>
  )
}

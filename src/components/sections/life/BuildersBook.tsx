import { useEffect, useRef } from 'react'
import aiBuilder from '../../../assets/img/life/ai-builder.jpg'
import businessBuilder from '../../../assets/img/life/business-builder.jpg'
import { useScrollStackEnabled } from '../../../hooks/useScrollStackEnabled'
import { SectionHeader } from '../../ui/SectionHeader'

/*
 * "Who we build for" — QA: the pages should "move like a book". The two builders are two
 * spreads of an open book: Business Builder (text | photo), then AI Builder (photo | text).
 * On desktop the section pins while you scroll and the right-hand page turns over the spine
 * (rotateY 0 → -180°, with light/shade across the page as it turns): its front is the
 * Business Builder photo, its back the AI Builder photo, revealing the AI Builder text beneath.
 * Phones and reduced motion: the two spreads simply stack.
 */

const business = {
  title: 'The Business Builder',
  body: 'Small business owners who want to grow revenue online. They want simple, effective solutions to be found and win new customers, and a team that helps them when they get stuck.',
  bg: 'linear-gradient(150deg, #5a9ef0 0%, #1e6fe0 60%, #1868d8 100%)',
}
const ai = {
  title: 'The AI Builder',
  body: 'AI-focused builders and creators shipping sites, apps, and agents. They want an easy path from idea to production, predictable pricing, and real humans who speak their language.',
  bg: 'radial-gradient(120% 90% at 85% 100%, #2b74e6 0%, #0d3a8f 45%, #041a45 100%)',
}

function TextPage({ page, className = '' }: { page: typeof business; className?: string }) {
  return (
    <div className={`flex flex-col gap-4 p-[clamp(28px,4vw,53px)] pt-[clamp(36px,5vw,70px)] text-white ${className}`} style={{ backgroundImage: page.bg }}>
      <h3 className="text-[clamp(28px,2.6vw,36px)] font-semibold leading-[1.3]">{page.title}</h3>
      <p className="max-w-[460px] text-base leading-[1.4]">{page.body}</p>
    </div>
  )
}

const header = (
  <SectionHeader
    eyebrow="Who we build for"
    title={
      <>
        The builders who <span className="text-bh-blue">inspire our work</span>
      </>
    }
    body="Every day, teams across all our brands work for two kinds of builders who are shaping the future of business online. Their success is our scoreboard, and helping them grow is what gets us up in the morning."
  />
)

export function BuildersBook() {
  const book = useScrollStackEnabled()
  const section = useRef<HTMLElement>(null)
  const leaf = useRef<HTMLDivElement>(null)
  const shadeFront = useRef<HTMLSpanElement>(null)
  const shadeBack = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!book) return
    let raf = 0
    const update = () => {
      raf = 0
      const s = section.current
      const l = leaf.current
      if (!s || !l) return
      const travel = s.offsetHeight - (window.innerHeight - 78)
      // a short pause before and after the turn so each spread can be read
      const raw = Math.min(1, Math.max(0, (78 - s.getBoundingClientRect().top) / travel))
      const p = Math.min(1, Math.max(0, (raw - 0.15) / 0.7))
      const e = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2
      const angle = -180 * e
      l.style.transform = `rotateY(${angle}deg)`
      // the page darkens as it lifts away from the light and brightens as it lands
      const lift = Math.sin(e * Math.PI)
      if (shadeFront.current) shadeFront.current.style.opacity = String(Math.min(0.55, e * 1.1))
      if (shadeBack.current) shadeBack.current.style.opacity = String(Math.max(0, 0.5 - e * 0.5))
      l.style.boxShadow = `${-30 * lift}px 20px ${40 + 30 * lift}px rgba(0, 30, 80, ${0.12 + 0.18 * lift})`
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
  }, [book])

  if (!book) {
    return (
      <section className="px-4 py-[80px]">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-10">
          {header}
          <div className="grid w-full gap-[30px] md:grid-cols-2">
            <TextPage page={business} className="min-h-[360px] rounded-2xl md:min-h-[505px]" />
            <div className="min-h-[360px] overflow-hidden rounded-2xl md:min-h-[505px]">
              <img src={businessBuilder} alt="A florist managing her online store" className="size-full object-cover" />
            </div>
            <div className="min-h-[360px] overflow-hidden rounded-2xl md:order-none md:min-h-[505px]">
              <img src={aiBuilder} alt="A builder generating a website with AI" className="size-full object-cover" />
            </div>
            <TextPage page={ai} className="min-h-[360px] rounded-2xl md:min-h-[505px]" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={section} className="relative h-[calc(100vh+110vh)]">
      <div className="sticky top-[78px] flex h-[calc(100vh-78px)] flex-col items-center justify-center gap-[clamp(20px,4vh,40px)] px-4">
        {header}
        {/* the open book: two pages meeting at the spine */}
        <div className="relative grid w-full max-w-[min(1200px,calc((100vh-78px-300px)*1200/505))] grid-cols-2 [perspective:2600px]">
          <TextPage page={business} className="aspect-[600/505] rounded-l-2xl" />
          {/* page underneath the turning leaf */}
          <TextPage page={ai} className="aspect-[600/505] rounded-r-2xl" />
          {/* spine shadow */}
          <span aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-10 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(0,20,60,0.18),transparent)]" />
          {/* the turning leaf: Business photo on the front, AI photo on the back */}
          <div ref={leaf} className="absolute inset-y-0 left-1/2 right-0 z-20 origin-left will-change-transform [transform-style:preserve-3d]">
            <div className="absolute inset-0 overflow-hidden rounded-r-2xl [backface-visibility:hidden]">
              <img src={businessBuilder} alt="A florist managing her online store" className="size-full object-cover" />
              <span ref={shadeFront} className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,20,60,0.35),rgba(0,20,60,0.05))] opacity-0" />
            </div>
            <div className="absolute inset-0 overflow-hidden rounded-l-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <img src={aiBuilder} alt="A builder generating a website with AI" className="size-full object-cover" />
              <span ref={shadeBack} className="absolute inset-0 bg-[linear-gradient(270deg,rgba(0,20,60,0.35),rgba(0,20,60,0.05))]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

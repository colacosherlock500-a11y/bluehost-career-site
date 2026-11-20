import { useEffect, useRef, useState, type ReactNode } from 'react'
import instagram from '../../assets/img/social/instagram.svg'
import linkedin from '../../assets/img/social/linkedin.svg'
import liPost1 from '../../assets/img/social/li-post-1.jpg'
import liPost2 from '../../assets/img/social/li-post-2.jpg'
import liPost3 from '../../assets/img/social/li-post-3.jpg'
import liPost4 from '../../assets/img/social/li-post-4.jpg'
import liPost5 from '../../assets/img/social/li-post-5.jpg'
import liPost6 from '../../assets/img/social/li-post-6.jpg'
import liPost7 from '../../assets/img/social/li-post-7.jpg'
import { Button } from '../ui/Button'
import { useT } from '../../i18n/I18n'

const INSTAGRAM_URL = 'https://www.instagram.com/bluehost/'

const LINKEDIN_URL = 'https://www.linkedin.com/company/bluehost-com'

function FacebookIcon() {
  return (
    <svg viewBox="0 0 28 28" className="size-7" aria-hidden>
      <circle cx="14" cy="14" r="14" fill="#1877F2" />
      <path d="M15.6 22.5v-7.1h2.4l.36-2.8H15.6v-1.8c0-.8.22-1.35 1.38-1.35h1.47V7c-.26-.03-1.13-.11-2.14-.11-2.12 0-3.57 1.29-3.57 3.67v2.04H10.3v2.8h2.4v7.1h2.9z" fill="#fff" />
    </svg>
  )
}

/** Cycling LinkedIn → Instagram → Facebook icon above the CTA ("Social animation" in Figma). */
function SocialSpinner() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setI(n => (n + 1) % 3), 1800)
    return () => window.clearInterval(id)
  }, [])
  const icons = [<img key="li" src={linkedin} alt="" className="size-[29px]" />, <img key="ig" src={instagram} alt="" className="size-7" />, <FacebookIcon key="fb" />]
  return (
    <div className="relative h-[29px] w-[29px]" aria-hidden>
      {icons.map((icon, n) => (
        <span key={n} className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${n === i ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
          {icon}
        </span>
      ))}
    </div>
  )
}

/*
 * LinkedIn posts as a pack of cards (HR): the pack is closed by default, and as the visitor
 * scrolls it opens into a fan of tall post cards on a wide arc (a wheel whose hub is far below),
 * middle cards first, in step with the scroll (scrolling back closes it). Once open it can be
 * dragged round; it loops, so posts keep coming round. Hover lifts a card forward.
 * Reduced motion: an open fan.
 */
const CARD_W = 290
const CARD_H = 396
const RADIUS = 1500 // distance from a card's centre to the wheel's hub
const STEP = 11.5 // degrees between neighbouring cards
const POSTS = [liPost4, liPost5, liPost6, liPost7, liPost1, liPost2, liPost3]
const CARDS = Array.from({ length: 14 }, (_, i) => POSTS[i % POSTS.length])

export function SocialCards() {
  const stage = useRef<HTMLDivElement>(null)
  const cards = useRef<(HTMLAnchorElement | null)[]>([])

  useEffect(() => {
    const el = stage.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const loop = CARDS.length * STEP
    let dragDeg = 0
    let drag: { x: number; deg: number; moved: boolean } | null = null
    let raf = 0

    const render = () => {
      raf = 0
      const vh = window.innerHeight
      const r = el.getBoundingClientRect()
      // Pack of cards (HR): closed while the stage comes into view, then it opens card by card
      // in step with the scroll, fully fanned once the stage is near the top of the screen.
      // Driven by the scroll position alone, so scrolling back closes the pack again.
      // Starts opening as the pack's top passes 85% of the screen and is fully open once the
      // whole fan is on screen (and always by the bottom of the page, which is close by here).
      const start = vh * 0.85
      const end = Math.min(start - 150, vh - r.height - 24)
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      const p = reduce || atBottom ? 1 : Math.min(1, Math.max(0, (start - r.top) / (start - end)))
      const scale = Math.min(1, el.clientWidth / 1100)
      cards.current.forEach((card, i) => {
        if (!card) return
        let a = (i - (CARDS.length - 1) / 2) * STEP + dragDeg
        a = ((((a + loop / 2) % loop) + loop) % loop) - loop / 2 // keep within one loop
        const shown = Math.abs(a) < 62
        // cards nearest the middle leave the pack first, the outer ones follow
        const lag = (Math.abs(a) / 62) * 0.35
        const t = Math.min(1, Math.max(0, (p - lag) / (1 - lag)))
        const e = t * t * (3 - 2 * t)
        const closed = 1 - e
        // a squared-up deck: each card a hair off the one below, slightly askew
        const rank = Math.round(Math.abs(a) / STEP)
        const dx = (a < 0 ? -1 : 1) * rank * 1.6 * closed
        const dy = -rank * 1.2 * closed
        const tilt = (((i * 37) % 7) - 3) * 0.9 * closed
        card.style.transform = `translate(-50%, -50%) translate(${dx}px, ${dy}px) scale(${scale}) translateY(${RADIUS}px) rotate(${a * e + tilt}deg) translateY(${-RADIUS}px)`
        card.style.zIndex = String(200 - Math.round(Math.abs(a) * 2))
        card.style.opacity = shown ? String(Math.min(1, (62 - Math.abs(a)) / 14)) : '0'
        card.style.visibility = shown ? '' : 'hidden'
      })
    }
    const schedule = () => {
      raf ||= requestAnimationFrame(render)
    }

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      drag = { x: e.clientX, deg: dragDeg, moved: false }
    }
    const onMove = (e: PointerEvent) => {
      if (!drag) return
      const dx = e.clientX - drag.x
      if (!drag.moved && Math.abs(dx) > 6) {
        drag.moved = true
        el.setPointerCapture(e.pointerId)
      }
      if (!drag.moved) return
      dragDeg = drag.deg + (dx / CARD_W) * STEP
      schedule()
    }
    const onUp = () => {
      if (drag?.moved) el.addEventListener('click', ev => (ev.preventDefault(), ev.stopPropagation()), { capture: true, once: true })
      drag = null
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
  }, [])

  return (
    <div
      ref={stage}
      role="region"
      aria-label="Bluehost on LinkedIn"
      className="relative h-[clamp(300px,42vw,520px)] w-full cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing [&_img]:pointer-events-none"
    >
      {CARDS.map((src, i) => (
        <a
          key={i}
          ref={el => {
            cards.current[i] = el
          }}
          href={LINKEDIN_URL}
          target="_blank"
          rel="noreferrer"
          draggable={false}
          aria-label="Bluehost post on LinkedIn"
          tabIndex={i < POSTS.length ? 0 : -1}
          className="group absolute left-1/2 top-[56%] will-change-transform"
          style={{ width: CARD_W, height: CARD_H }}
        >
          <span className="relative block size-full overflow-hidden rounded-[14px] shadow-[0_14px_36px_rgba(0,42,102,0.18)] transition-[translate,scale,box-shadow] duration-300 ease-out group-hover:-translate-y-5 group-hover:scale-[1.06] group-hover:shadow-[0_28px_60px_rgba(0,42,102,0.3)] group-focus-visible:-translate-y-5 group-focus-visible:scale-[1.06]">
            <img src={src} alt="" className="size-full object-cover" />
          </span>
        </a>
      ))}
    </div>
  )
}

interface JoinCtaProps {
  eyebrow?: string
  title?: ReactNode
  body?: string
  /** Show the secondary "Meet Our Teams" button. */
  showTeamsButton?: boolean
  /** Job search variant: static social icon row under "join our socials" instead of the animated icon. */
  socialRow?: boolean
}

export function JoinCta({
  eyebrow = '',
  title,
  body,
  showTeamsButton = false,
  socialRow = false,
}: JoinCtaProps) {
  const t = useT()
  // Spacing per the Figma "Come build what's next with us" layout: heading, 40 px, button,
  // 40 px, "Join our socials" with the icon under it, 40 px, the post fan.
  return (
    <section className="flex flex-col items-center gap-10 px-4 pb-[60px] pt-[100px]">
      <div className="flex flex-col items-center gap-5 text-center">
        {eyebrow && <p className="eyebrow">{t(eyebrow)}</p>}
        <h2 className="h-section">
          {title ?? (
            <>
              {t("Come build what's next")}{' '}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #196cdf 30%, #83c0fc 100%)' }}>
                {t('with us')}
              </span>
            </>
          )}
        </h2>
        {body && <p className="text-lead max-w-[734px]">{t(body)}</p>}
      </div>
      <div className="flex flex-wrap justify-center gap-[18px]">
        <Button to="/jobs">{t('View Open Roles')}</Button>
        {showTeamsButton && <Button to="/our-teams" variant="outline">{t('Meet Our Teams')}</Button>}
      </div>
      <div className="flex flex-col items-center gap-3">
        <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="text-base font-semibold uppercase leading-[1.5] tracking-[-0.08px] text-bh-blue hover:underline">
          {t('join our socials')}
        </a>
        {socialRow ? (
          <div className="flex items-center gap-[14px]">
            <a href="https://www.facebook.com/bluehost" target="_blank" rel="noreferrer" aria-label="Facebook"><FacebookIcon /></a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram"><img src={instagram} alt="" className="size-7" /></a>
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" aria-label="LinkedIn"><img src={linkedin} alt="" className="size-7" /></a>
          </div>
        ) : (
          <SocialSpinner />
        )}
      </div>
      <SocialCards />
    </section>
  )
}

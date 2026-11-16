import { useEffect, useRef, useState, type ReactNode } from 'react'
import ring from '../../assets/img/common/avatar-ring.svg'
import star from '../../assets/img/common/star.svg'
import { SectionHeader } from '../ui/SectionHeader'
import { useT } from '../../i18n/I18n'

import { testimonials, type Testimonial } from '../../data/testimonials'

export type { Testimonial }

export function ReviewCard({ quote, name, role, photo }: Testimonial) {
  return (
    <figure className="flex h-[400px] w-[337px] shrink-0 flex-col justify-between rounded-[13px] border border-bh-light-200 bg-white px-[25px] py-[29px]">
      <div className="flex flex-col gap-[17px]">
        <div className="flex" aria-label="5 out of 5 stars">
          {Array.from({ length: 5 }, (_, i) => (
            <img key={i} src={star} alt="" className="size-[19px]" />
          ))}
        </div>
        <blockquote className="text-[15px] leading-[1.4] tracking-[-0.15px]">{quote}</blockquote>
      </div>
      <figcaption className="flex items-start gap-[5px]">
        <span className="relative size-[50px] shrink-0">
          <img src={photo} alt="" className="absolute left-[2px] top-[2px] size-[46px] rounded-full object-cover" />
          <img src={ring} alt="" className="absolute inset-0 size-[50px]" />
        </span>
        <span className="flex flex-col gap-px">
          <span className="text-base font-semibold leading-6">{name}</span>
          <span className="text-[13px] leading-[19px] text-bh-blue">{role}</span>
        </span>
      </figcaption>
    </figure>
  )
}

/** Blob colours for gradient cards (overridable per card). */
const BLOBS: [string, string][] = [
  ['#5d9bff', '#9fe0ff'],
  ['#7fd3ff', '#3f8bf0'],
  ['#8ab8ff', '#b7f0ff'],
]

/*
 * "For Dev Team – Testimonials": cards alternate gradient – photo – gradient – photo.
 * Gradient cards: the Bluehost gradient blob (blurred ellipses) behind dark text; on hover the
 * person's photo crossfades in (opacity 0 → 1, 400 ms ease-out) under the navy overlay, the blob
 * fades out and the text turns white. Photo cards: full-colour photo under a navy overlay
 * (darker at top and bottom behind the text), subtle zoom 1.0 → 1.04 on hover.
 */
function StoryCard({ t, index, shown }: { t: Testimonial; index: number; shown: boolean }) {
  const tr = useT()
  // Tilt towards the pointer (3D) while hovered.
  const tilt = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    e.currentTarget.style.transform = `perspective(900px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg) translateY(-6px)`
  }
  const untilt = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.transform = ''
  }
  const photoCard = index % 2 === 1
  const [c1, c2] = BLOBS[index % BLOBS.length]
  const overlay = 'linear-gradient(180deg, rgba(1,24,56,0.88) 0%, rgba(1,24,56,0.25) 30%, rgba(1,24,56,0.25) 45%, rgba(1,24,56,0.92) 100%)'
  return (
    <figure
      data-card
      tabIndex={0}
      onPointerMove={tilt}
      onPointerLeave={untilt}
      className="group relative flex h-[420px] w-[min(85vw,300px)] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-[14px] border border-bh-light-200 bg-white p-6 outline-none [transition:translate_900ms_cubic-bezier(0.22,1,0.36,1),rotate_900ms_cubic-bezier(0.22,1,0.36,1),opacity_600ms_ease,transform_300ms_ease-out,box-shadow_300ms_ease-out] hover:shadow-[0_24px_48px_rgba(0,42,102,0.22)] focus-visible:ring-2 focus-visible:ring-bh-blue motion-reduce:!translate-none motion-reduce:!rotate-none motion-reduce:!opacity-100 md:w-[300px]"
      style={{
        // entrance: cards rise in one after another as the section scrolls into view
        translate: shown ? '0 0' : '0 90px',
        rotate: shown ? '0deg' : `${index % 2 ? -3 : 3}deg`,
        opacity: shown ? 1 : 0,
        transitionDelay: shown ? `${Math.min(index, 6) * 90}ms, ${Math.min(index, 6) * 90}ms, ${Math.min(index, 6) * 90}ms, 0ms, 0ms` : '0ms',
      }}
    >
      {/* photo layer: always shown on photo cards, crossfades in on gradient cards */}
      <div className={`absolute inset-0 transition-opacity duration-[400ms] ease-out ${photoCard ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'}`}>
        <img src={t.photo} alt="" draggable={false} className={`size-full object-cover object-top transition-[scale] duration-[400ms] ease-out ${photoCard ? 'group-hover:scale-[1.04]' : ''}`} />
        <span className="absolute inset-0" style={{ backgroundImage: overlay }} />
      </div>
      {!photoCard && (
        <div aria-hidden className="pointer-events-none absolute inset-0 transition-opacity duration-[400ms] ease-out group-hover:opacity-0 group-focus-visible:opacity-0">
          <span className="absolute -left-[30%] top-[38%] h-[70%] w-[120%] rounded-full opacity-95 blur-[44px]" style={{ background: `radial-gradient(closest-side, ${c1}, transparent)` }} />
          <span className="absolute -right-[25%] -top-[20%] h-[50%] w-[90%] rounded-full opacity-75 blur-[36px]" style={{ background: `radial-gradient(closest-side, ${c2}, transparent)` }} />
        </div>
      )}
      <figcaption className={`relative flex flex-col gap-1 transition-colors duration-[400ms] ${photoCard ? 'text-white' : 'text-bh-blue-1100 group-hover:text-white group-focus-visible:text-white'}`}>
        <span className="text-[15px] font-semibold leading-[1.3]">{t.name}</span>
        <span className={`text-[10.5px] font-medium uppercase leading-[1.35] tracking-[0.6px] ${photoCard ? 'text-white/80' : 'text-night-sky group-hover:text-white/80 group-focus-visible:text-white/80'}`}>{tr(t.role)}</span>
      </figcaption>
      <blockquote className={`relative text-[14px] leading-[1.45] tracking-[-0.14px] transition-colors duration-[400ms] ${photoCard ? 'text-white' : 'text-bh-blue-1100 group-hover:text-white group-focus-visible:text-white'}`}>
        “{tr(t.quote)}”
      </blockquote>
    </figure>
  )
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

/** Scrolls `el` horizontally to `to` over 500 ms ease-in-out (snap is paused meanwhile). */
function glide(el: HTMLElement, to: number) {
  const from = el.scrollLeft
  const start = performance.now()
  el.style.scrollSnapType = 'none'
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / 500)
    el.scrollLeft = from + (to - from) * easeInOut(t)
    if (t < 1) requestAnimationFrame(tick)
    else el.style.scrollSnapType = ''
  }
  requestAnimationFrame(tick)
}

/** Autoplay: one card every few seconds, paused while the visitor interacts or the carousel is off screen. */
const AUTOPLAY_MS = 4500

/**
 * "Stories from the people who make Bluehost" — every colleague story in one full-width
 * carousel (HR feedback): cards rise in one by one, tilt towards the pointer, and the row
 * advances on its own. Snap, drag, arrows and a progress bar as before.
 */
export function Testimonials({ title, eyebrow = 'Our People', items = testimonials }: { title?: ReactNode; eyebrow?: string; items?: Testimonial[] }) {
  const t = useT()
  const track = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState({ start: 0, size: 1 })
  const [edges, setEdges] = useState({ atStart: true, atEnd: false })
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null)
  const section = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)
  const [onScreen, setOnScreen] = useState(false)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    const el = section.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      setOnScreen(e.isIntersecting)
      if (e.isIntersecting) setShown(true)
    }, { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const sync = () => {
    const el = track.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    const size = el.clientWidth / el.scrollWidth
    setProgress({ start: max > 0 ? (el.scrollLeft / max) * (1 - size) : 0, size })
    setEdges({ atStart: el.scrollLeft < 4, atEnd: el.scrollLeft > max - 4 })
  }
  useEffect(() => {
    sync()
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [])

  // Arrows move by exactly one card (500 ms ease-in-out).
  const move = (dir: 1 | -1) => {
    const el = track.current
    const card = el?.querySelector<HTMLElement>('[data-card]')
    if (!el || !card) return
    const stepPx = card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0')
    const max = el.scrollWidth - el.clientWidth
    glide(el, Math.max(0, Math.min(max, Math.round(el.scrollLeft / stepPx + dir) * stepPx)))
  }

  useEffect(() => {
    if (!onScreen || paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      const el = track.current
      if (!el) return
      if (el.scrollLeft > el.scrollWidth - el.clientWidth - 4) glide(el, 0)
      else move(1)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [onScreen, paused])

  // Mouse drag (touch and trackpads scroll natively).
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || !track.current) return
    drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current
    const el = track.current
    if (!d || !el) return
    const dx = e.clientX - d.x
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true
      el.style.scrollSnapType = 'none'
      el.setPointerCapture(e.pointerId)
    }
    if (d.moved) el.scrollLeft = d.left - dx
  }
  const onPointerUp = () => {
    const d = drag.current
    const el = track.current
    drag.current = null
    if (!d?.moved || !el) return
    // settle on the nearest card
    const card = el.querySelector<HTMLElement>('[data-card]')
    const stepPx = card ? card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0') : 1
    glide(el, Math.round(el.scrollLeft / stepPx) * stepPx)
  }

  const arrow = 'flex size-9 items-center justify-center rounded-full border border-[#d5e2f5] bg-white text-bh-blue shadow-sm transition hover:bg-bh-light-0 disabled:opacity-40 disabled:hover:bg-white'

  return (
    <section ref={section} className="flex flex-col items-center gap-10 py-[100px]">
      <SectionHeader
        className="px-4"
        eyebrow={t(eyebrow)}
        title={title ?? (<>{t('Stories from the people')} <span className="text-bh-blue">{t('who make Bluehost')}</span></>)}
        body={t('Hear from colleagues around the world about what it means to belong, build, grow, and shine here.')}
      />
      <div
        className="flex w-full flex-col gap-6"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
      >
        <div
          ref={track}
          onScroll={sync}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          role="region"
          aria-label={t('Stories from our people')}
          className="no-scrollbar flex cursor-grab snap-x snap-mandatory gap-[22px] overflow-x-auto overscroll-x-contain px-[clamp(16px,3vw,48px)] py-8 [scroll-padding-inline:clamp(16px,3vw,48px)] active:cursor-grabbing [&_img]:pointer-events-none"
        >
          {items.map((t, i) => (
            <StoryCard key={t.name} t={t} index={i} shown={shown} />
          ))}
        </div>
        <div className="flex w-full items-center justify-between px-[clamp(16px,3vw,48px)]">
          <div className="flex gap-2">
            <button type="button" onClick={() => move(-1)} disabled={edges.atStart} aria-label={t('Previous story')} className={arrow}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <button type="button" onClick={() => move(1)} disabled={edges.atEnd} aria-label={t('Next story')} className={arrow}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>
          {/* position within the list */}
          <div className="relative h-[3px] w-[120px] overflow-hidden rounded-full bg-[#d8e4f5]" aria-hidden>
            <span className="absolute inset-y-0 rounded-full bg-bh-blue" style={{ left: `${progress.start * 100}%`, width: `${progress.size * 100}%` }} />
          </div>
        </div>
      </div>
    </section>
  )
}

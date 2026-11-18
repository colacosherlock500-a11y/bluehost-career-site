import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { teams } from '../../../data/teams'
import { formatOpenRoles, useJobStats } from '../../../hooks/useJobs'
import { Button } from '../../ui/Button'
import { SectionHeader } from '../../ui/SectionHeader'
import { useT } from '../../../i18n/I18n'

/*
 * "Teams spotlight carousel" (dev note, ref. jobs.uber.com teams carousel).
 * One team is highlighted in a large centred card; the previous and next teams peek as
 * narrow cards. Next/prev: ~700 ms cubic-bezier(0.65, 0, 0.35, 1) — the incoming side card
 * expands to the centre (height 480 → 560), the active card shrinks to the side, the far
 * card slides off-screen. Images stay centred with a 1.08 → 1.0 zoom on the new active card;
 * side cards carry a 45% navy overlay that fades to the top-to-bottom gradient when active.
 * Text: old content fades out (200 ms); once the card has nearly settled (~650 ms, HR feedback:
 * delay the words) the counter, name, tagline and button rise 56 px and fade in, staggered ~90 ms.
 * Controls: arrows, swipe/drag, ← → keys; autoplay every 6 s, paused on hover/focus, the
 * active progress dash fills during the interval; infinite loop. Reduced motion: crossfade only.
 * Mobile: active card ~88% of the width, side cards peek ~16 px, team name 40 px.
 */

const EASE = 'cubic-bezier(0.65, 0, 0.35, 1)'
const DURATION = 700
const AUTOPLAY_MS = 6000
const pad = (n: number) => String(n).padStart(2, '0')

interface Layout {
  width: number
  activeW: number
  sideW: number
  gap: number
  mobile: boolean
}

function measure(width: number): Layout {
  const mobile = width < 768
  if (mobile) {
    const activeW = Math.round(width * 0.88)
    const gap = 8
    // side cards peek ~16 px at each edge
    return { width, activeW, sideW: (width - activeW) / 2 - gap + 40, gap, mobile }
  }
  // Full width (HR feedback): the side cards touch the page margins at any screen size.
  const sideW = 170
  const gap = 28
  const margin = Math.min(48, Math.max(16, width * 0.03))
  return { width, activeW: width - 2 * (margin + sideW + gap), sideW, gap, mobile }
}

/** Active card height on desktop: 560 at the old 1100 px width, growing with wider screens. */
const desktopHeight = (activeW: number) => Math.round(Math.min(700, Math.max(480, activeW * 0.51)))

export function TeamsCarousel() {
  const { data: stats } = useJobStats()
  const t = useT()
  const n = teams.length
  const [index, setIndex] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [paused, setPaused] = useState(false)
  // Autoplay only runs while the carousel is on screen.
  const [onScreen, setOnScreen] = useState(false)
  const [layout, setLayout] = useState<Layout | null>(null)
  const [reduceMotion, setReduceMotion] = useState(false)
  const stage = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; moved: boolean } | null>(null)

  useLayoutEffect(() => {
    const el = stage.current
    if (!el) return
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    const ro = new ResizeObserver(() => setLayout(measure(el.clientWidth)))
    ro.observe(el)
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.3 })
    io.observe(el)
    return () => {
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  const go = useCallback(
    (to: number) => {
      setIndex(i => {
        const next = ((to % n) + n) % n
        if (next !== i) setPrev(i)
        return next
      })
    },
    [n],
  )
  const step = (d: number) => go(index + d)

  // Keep the outgoing card's text around just long enough to fade it out (200 ms).
  useEffect(() => {
    if (prev === null) return
    const t = window.setTimeout(() => setPrev(null), 220)
    return () => window.clearTimeout(t)
  }, [prev, index])

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') step(1)
    else if (e.key === 'ArrowLeft') step(-1)
    else return
    e.preventDefault()
  }

  // Swipe / drag on touch and trackpad-click: 50 px decides the direction.
  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    drag.current = { x: e.clientX, moved: false }
  }
  const onPointerMove = (e: PointerEvent) => {
    const d = drag.current
    if (d && Math.abs(e.clientX - d.x) > 8) d.moved = true
  }
  const onPointerUp = (e: PointerEvent) => {
    const d = drag.current
    drag.current = null
    if (!d) return
    const dx = e.clientX - d.x
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
  }
  // A drag that ends over a link must not follow it.
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current?.moved) e.preventDefault()
  }

  // Trackpad horizontal swipe (wheel deltaX), throttled to one step per gesture.
  const wheelLock = useRef(0)
  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY) || Math.abs(e.deltaX) < 30) return
    const now = performance.now()
    if (now - wheelLock.current < 900) return
    wheelLock.current = now
    step(e.deltaX > 0 ? 1 : -1)
  }

  /** Where card `i` sits: slot 0 is the active card, ±1 the peeking side cards, ±2 just off-screen. */
  const cardStyle = (i: number): CSSProperties => {
    if (!layout) return { opacity: 0 }
    let slot = i - index
    if (slot > n / 2) slot -= n
    if (slot < -n / 2) slot += n
    const clamped = Math.max(-2, Math.min(2, slot))
    const { width, activeW, sideW, gap, mobile } = layout
    const activeH = mobile ? Math.round(activeW * 1.15) : desktopHeight(activeW)
    const sideH = Math.round(activeH * 0.86)
    const w = clamped === 0 ? activeW : sideW
    const h = clamped === 0 ? activeH : sideH
    const centre = width / 2
    const sideCentre = activeW / 2 + gap + sideW / 2
    const x = clamped === 0 ? centre : centre + Math.sign(clamped) * (sideCentre + (Math.abs(clamped) - 1) * (sideW + gap) + (Math.abs(clamped) === 2 ? sideW : 0))
    const transition = reduceMotion
      ? 'opacity 400ms ease'
      : `left ${DURATION}ms ${EASE}, width ${DURATION}ms ${EASE}, height ${DURATION}ms ${EASE}, opacity ${DURATION}ms ${EASE}`
    return {
      left: reduceMotion ? centre - activeW / 2 : x - w / 2,
      width: reduceMotion ? activeW : w,
      height: reduceMotion ? activeH : h,
      top: '50%',
      translate: '0 -50%',
      zIndex: clamped === 0 ? 3 : 2 - Math.abs(clamped),
      // reduced motion: only the active card shows, crossfading
      opacity: reduceMotion ? (clamped === 0 ? 1 : 0) : Math.abs(slot) <= 1 ? 1 : 0,
      transition,
      pointerEvents: Math.abs(slot) <= 1 ? 'auto' : 'none',
    }
  }

  const stageH = !layout ? 600 : layout.mobile ? Math.round(layout.activeW * 1.15) + 24 : desktopHeight(layout.activeW) + 40

  return (
    <section className="flex flex-col items-center gap-10 overflow-hidden py-[100px]">
      <SectionHeader
        className="px-4"
        eyebrow={t('our teams')}
        title={
          <>
            {t('Find the team')} <span className="text-bh-blue">{t('where you belong')}</span>
          </>
        }
        body={t('Ten teams across our brands share one purpose: helping every small business succeed online. Explore what each team does and where your skills can make a difference.')}
      />

      <div
        ref={stage}
        role="region"
        aria-roledescription="carousel"
        aria-label={t('Our teams')}
        tabIndex={0}
        onKeyDown={onKey}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={e => !e.currentTarget.contains(e.relatedTarget) && setPaused(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (drag.current = null)}
        onClickCapture={onClickCapture}
        onWheel={onWheel}
        className="relative w-full touch-pan-y select-none outline-none focus-visible:ring-2 focus-visible:ring-bh-blue/40"
        style={{ height: stageH }}
      >
        {teams.map((team, i) => {
          const tm = { ...team, name: t(team.name), tagline: t(team.tagline) }
          const active = i === index
          const leaving = i === prev
          return (
            <div key={tm.slug} className="absolute overflow-hidden rounded-[14px] shadow-[0_20px_60px_rgba(0,42,102,0.18)]" style={cardStyle(i)} aria-hidden={!active}>
              <img
                src={tm.image}
                alt=""
                draggable={false}
                className="absolute inset-0 size-full object-cover"
                style={{ objectPosition: tm.imageFocus ?? 'center 20%', scale: active || reduceMotion ? '1' : '1.08', transition: `scale ${DURATION}ms ${EASE}` }}
              />
              {/* 45% navy on side cards, fading to the top-to-bottom gradient on the active card */}
              <span className="absolute inset-0 bg-[rgba(1,33,70,0.45)]" style={{ opacity: active ? 0 : 1, transition: `opacity ${DURATION}ms ${EASE}` }} />
              <span
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,33,70,0.15)_0%,rgba(1,33,70,0.35)_45%,rgba(1,33,70,0.85)_100%)]"
                style={{ opacity: active ? 1 : 0, transition: `opacity ${DURATION}ms ${EASE}` }}
              />
              {active ? (
                <Link to={`/our-teams/${tm.slug}`} draggable={false} className="absolute inset-0 z-[1]" aria-label={`${tm.name}: ${t('Discover the team')}`} tabIndex={-1} />
              ) : (
                <button type="button" onClick={() => go(i)} className="absolute inset-0 z-[1]" aria-label={`${t('Show')} ${tm.name}`} tabIndex={-1} />
              )}
              {(active || leaving) && (
                <div
                  key={`${tm.slug}-${active ? 'in' : 'out'}`}
                  className={`pointer-events-none absolute inset-0 z-[2] flex flex-col items-center justify-center gap-3 px-6 text-center text-white ${leaving ? 'animate-[textOut_200ms_ease-out_forwards]' : ''}`}
                >
                  <p className="team-line flex items-center gap-2 text-[13px] font-medium tracking-[1px] text-white/85" style={{ animationDelay: '650ms' }}>
                    <span className="size-1.5 rounded-full bg-white" />
                    {pad(i + 1)} / {pad(n)}
                  </p>
                  <h3 className="team-line text-[40px] font-semibold leading-[1.1] tracking-[-0.02em] md:text-[clamp(48px,5.4vw,76px)]" style={{ animationDelay: '740ms' }}>
                    {tm.name}
                  </h3>
                  <p className="team-line max-w-[520px] text-base leading-[1.4] text-white/90 md:text-lg" style={{ animationDelay: '830ms' }}>
                    {tm.tagline}
                  </p>
                  <div className="team-line pointer-events-auto relative z-[3] mt-3 flex flex-col items-center gap-3" style={{ animationDelay: '960ms' }}>
                    <Button to={`/our-teams/${tm.slug}`} variant="white" className="!min-w-0 !py-[12px] !text-[15px]">
                      {t('Discover the team')}
                    </Button>
                    <span className="text-[13px] text-white/80">{t(formatOpenRoles(stats?.byTeam[tm.slug]))}</span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-4">
        <button type="button" onClick={() => step(-1)} aria-label={t('Previous team')} className="flex size-9 items-center justify-center rounded-full border border-[#d5e2f5] bg-white text-bh-blue shadow-sm transition hover:bg-bh-light-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <div className="flex items-center gap-[6px]" role="tablist" aria-label={t('Teams')}>
          {teams.map((team, i) => (
            <button
              key={team.slug}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={t(team.name)}
              onClick={() => go(i)}
              className={`relative h-[4px] overflow-hidden rounded-full bg-[#cfdcf0] transition-[width] duration-500 ${i === index ? 'w-10' : 'w-[18px]'}`}
            >
              {i === index && (
                <span
                  key={index}
                  className="absolute inset-y-0 left-0 rounded-full bg-bh-blue"
                  style={
                    reduceMotion
                      ? { width: '100%' }
                      : { animation: `progressFill ${AUTOPLAY_MS}ms linear forwards`, animationPlayState: paused || !onScreen ? 'paused' : 'running' }
                  }
                  onAnimationEnd={() => step(1)}
                />
              )}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => step(1)} aria-label={t('Next team')} className="flex size-9 items-center justify-center rounded-full border border-[#d5e2f5] bg-white text-bh-blue shadow-sm transition hover:bg-bh-light-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden><path d="m9 18 6-6-6-6" /></svg>
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {t(teams[index].name)}, {index + 1} / {n}
      </p>
    </section>
  )
}

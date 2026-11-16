import { useEffect, useRef, useState } from 'react'
import belong from '../../assets/img/evp/belong.jpg'
import build from '../../assets/img/evp/build.jpg'
import grow from '../../assets/img/evp/grow.jpg'
import logo3d from '../../assets/img/evp/logo-3d.webp'
import oneTeam from '../../assets/img/evp/one-team.jpg'
import shine from '../../assets/img/evp/shine.jpg'
import { useScrollStackEnabled } from '../../hooks/useScrollStackEnabled'

const pillars = [
  { title: 'Belong', image: belong, body: 'You join a global community of colleagues across 16 countries and 33 employee-led affinity groups. New hires are welcomed by teams that love helping each other, and many of our people build friendships and mentorships that last for years.' },
  { title: 'Build', image: build, body: 'Through Bluehost, HostGator, Yoast, and YITH, you help business builders build anything, host anything, and run their business with AI-powered tools, reliable hosting, and real human support. We focus on execution, test early, and learn from what our customers tell us.' },
  { title: 'Grow', image: grow, body: 'You have access to learning programs, education support in many countries, and real opportunities to move into new roles and teams. You are encouraged to test the limits of AI and grow your skills along the way.' },
  { title: 'Shine', image: shine, body: 'You are trusted with ownership from day one. Ideas are heard and acted on, trial and error is part of how we learn, and you are invited to be the brand, sharing the work you are proud of.' },
  { title: 'As one team', image: oneTeam, body: "We break down silos between functions and countries, share what we learn, and win together. Our success is measured by our customers' growth and by how helpful we are, to them and to each other." },
]

const pad = (n: number) => String(n).padStart(2, '0')

const Intro = () => (
  <div className="flex max-w-[909px] flex-col items-center gap-5 text-center">
    <p className="eyebrow">Our promise to you</p>
    <h2 className="h-section">What belonging, building, growing, and shining look like here</h2>
    <p className="text-lead max-w-[712px]">Our employee value proposition is more than words on a page. Here is how it shows up in your everyday work.</p>
  </div>
)

/**
 * Where a photo sits along its path, by slot `s` relative to the active pillar.
 * Perspective (HR feedback, ref. jobs.uber.com): photos arrive big, as if close to the
 * viewer (s = 2, off-screen right), shrink as they settle into the active slot on the left
 * (s = 0) and keep shrinking into the distance as they leave (s = -1, up and to the left).
 * s = 1 is the next photo waiting on the right, s = 0.5 swooping past behind the logo.
 * x is a fraction of the stage width from its centre; y is in px.
 */
const PATH: { s: number; x: number; y: number; scale: number; rot: number; blur: number; opacity: number }[] = [
  { s: -1, x: -0.62, y: -70, scale: 0.42, rot: -8, blur: 3, opacity: 0 },
  { s: 0, x: -0.355, y: 0, scale: 1, rot: 0, blur: 0, opacity: 1 },
  { s: 0.5, x: 0.0, y: 40, scale: 1.08, rot: -3, blur: 0.5, opacity: 1 },
  { s: 1, x: 0.3, y: 30, scale: 0.78, rot: 6, blur: 1, opacity: 0.95 },
  { s: 2, x: 0.78, y: 90, scale: 1.55, rot: 10, blur: 4, opacity: 0 },
]
const smooth = (t: number) => t * t * (3 - 2 * t)

function pathAt(s: number) {
  const c = Math.min(PATH[PATH.length - 1].s, Math.max(PATH[0].s, s))
  const k = Math.max(0, PATH.findIndex((_, i) => i < PATH.length - 1 && c <= PATH[i + 1].s))
  const a = PATH[k]
  const b = PATH[k + 1]
  const t = smooth((c - a.s) / (b.s - a.s))
  const mix = (key: 'x' | 'y' | 'scale' | 'rot' | 'blur' | 'opacity') => a[key] + (b[key] - a[key]) * t
  return { x: mix('x'), y: mix('y'), scale: mix('scale'), rot: mix('rot'), blur: mix('blur'), opacity: mix('opacity') }
}

/** Scroll distance (in viewport heights) for each move from one pillar to the next. */
const STEP_VH = 0.7

/**
 * Desktop (jobs.uber.com "Every step toward your next move"): the section pins while
 * you scroll; the 3D logo stays put as each pillar's photo sweeps in from the right,
 * curves past behind the logo into the left slot and exits as the next arrives.
 */
function PromiseScroll({ id }: { id?: string }) {
  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const cards = useRef<(HTMLButtonElement | null)[]>([])
  const [active, setActive] = useState(0)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const sec = section.current
      const st = stage.current
      if (!sec || !st) return
      const step = window.innerHeight * STEP_VH
      const progress = Math.min(pillars.length - 1, Math.max(0, (78 - sec.getBoundingClientRect().top) / step))
      const w = st.clientWidth
      cards.current.forEach((card, i) => {
        if (!card) return
        const p = pathAt(i - progress)
        card.style.transform = `translate(-50%, -50%) translate3d(${p.x * w}px, ${p.y}px, 0) rotate(${p.rot}deg) scale(${p.scale})`
        card.style.filter = p.blur > 0.05 ? `blur(${p.blur}px)` : ''
        card.style.opacity = String(p.opacity)
        card.style.visibility = p.opacity < 0.01 ? 'hidden' : ''
        // number sits top-left on the large card and bottom-right on the small one (Figma)
        const small = Math.min(1, Math.max(0, i - progress))
        card.style.setProperty('--small', String(small))
      })
      setActive(Math.round(progress))
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
  }, [])

  // Dots and cards jump to a pillar by scrolling to its point in the section.
  const goTo = (n: number) => {
    const sec = section.current
    if (!sec) return
    window.scrollTo({ top: sec.getBoundingClientRect().top + window.scrollY - 78 + n * window.innerHeight * STEP_VH, behavior: 'smooth' })
  }
  const p = pillars[active]

  return (
    <section id={id} ref={section} className="relative scroll-mt-24 bg-gradient-to-b from-[#e6f3ff] to-[#d4e9ff]" style={{ height: `calc(100vh + ${(pillars.length - 1) * STEP_VH * 100}vh)` }}>
      <div className="sticky top-[78px] flex h-[calc(100vh-78px)] flex-col items-center justify-center gap-[clamp(16px,3vh,40px)] overflow-hidden px-4">
        <Intro />

        <div ref={stage} className="relative h-[clamp(200px,32vh,300px)] w-full max-w-[1200px]">
          <img src={logo3d} alt="" className="absolute left-1/2 top-1/2 z-10 h-full w-auto max-w-[442px] -translate-x-1/2 -translate-y-1/2 object-contain" />
          {pillars.map((x, i) => (
            <button
              key={x.title}
              ref={el => {
                cards.current[i] = el
              }}
              onClick={() => goTo(i)}
              aria-label={`${pad(i + 1)} ${x.title}`}
              className="absolute left-1/2 top-1/2 z-[5] aspect-[348/253] w-[min(348px,29%)] overflow-hidden rounded-[14px] shadow-[0_20px_50px_rgba(0,42,102,0.2)] will-change-transform [--small:0]"
            >
              <img src={x.image} alt="" className="size-full object-cover" />
              <span className="absolute left-4 top-3 text-[25px] font-semibold text-white drop-shadow [opacity:calc(1-var(--small))]">{pad(i + 1)}</span>
              <span className="absolute bottom-2 right-3 text-[30px] font-semibold text-white drop-shadow [opacity:var(--small)]">{pad(i + 1)}</span>
            </button>
          ))}
        </div>

        <div key={active} className="flex min-h-[150px] max-w-[702px] flex-col items-center gap-[10px] text-center animate-[fadeUp_0.45s_ease-out]" aria-live="polite">
          <p className="text-[15px] font-semibold">
            <span className="text-bh-blue">{pad(active + 1)}</span>/<span className="text-[12px] text-night-sky">{pad(pillars.length)}</span>
          </p>
          <h3 className="text-[25px] font-semibold leading-[1.33]">{p.title}</h3>
          <p className="text-base leading-[1.4] tracking-[-0.16px]">{p.body}</p>
        </div>
        <div className="flex gap-2" role="tablist" aria-label="Our promise">
          {pillars.map((x, n) => (
            <button key={x.title} role="tab" aria-selected={n === active} aria-label={x.title} onClick={() => goTo(n)} className={`h-2 rounded-full transition-all ${n === active ? 'w-8 bg-bh-blue' : 'w-2 bg-bh-light-300'}`} />
          ))}
        </div>
      </div>
    </section>
  )
}

/** "Our promise to you" — EVP pillars (Belong, Build, Grow, Shine, As one team) around the 3D logo. */
export function PromiseCarousel({ id }: { id?: string }) {
  return useScrollStackEnabled() ? <PromiseScroll id={id} /> : <PromiseAuto id={id} />
}

/** Phones / reduced motion: the pillars cycle on a timer around the 3D logo. */
function PromiseAuto({ id }: { id?: string }) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (paused) return
    const t = window.setInterval(() => setI(n => (n + 1) % pillars.length), 6000)
    return () => window.clearInterval(t)
  }, [paused])
  const p = pillars[i]
  const next = pillars[(i + 1) % pillars.length]

  return (
    <section id={id} className="scroll-mt-24 bg-gradient-to-b from-[#e6f3ff] to-[#d4e9ff] px-4 py-[59px]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-10">
        <div className="flex max-w-[909px] flex-col items-center gap-5 text-center">
          <p className="eyebrow">Our promise to you</p>
          <h2 className="h-section">What belonging, building, growing, and shining look like here</h2>
          <p className="text-lead max-w-[712px]">Our employee value proposition is more than words on a page. Here is how it shows up in your everyday work.</p>
        </div>

        <div className="relative grid w-full items-center gap-6 md:grid-cols-[348px_1fr_176px]">
          <button key={`a${i}`} onClick={() => setI(n => (n - 1 + pillars.length) % pillars.length)} aria-label="Previous" className="relative mx-auto aspect-[348/253] w-full max-w-[348px] overflow-hidden rounded-[14px] shadow-[0_20px_50px_rgba(0,42,102,0.2)] animate-[fadeUp_0.6s_ease-out]">
            <img src={p.image} alt="" className="size-full object-cover" />
            <span className="absolute left-4 top-3 text-[25px] font-semibold text-white drop-shadow">{pad(i + 1)}</span>
          </button>
          <img src={logo3d} alt="" className="mx-auto w-full max-w-[442px]" />
          <button key={`b${i}`} onClick={() => setI(n => (n + 1) % pillars.length)} aria-label="Next" className="relative mx-auto hidden aspect-[176/128] w-[176px] rotate-[8deg] overflow-hidden rounded-[10px] opacity-90 blur-[1.5px] transition hover:blur-0 md:block">
            <img src={next.image} alt="" className="size-full object-cover" />
            <span className="absolute bottom-2 right-3 text-[19px] font-semibold text-white">{pad(((i + 1) % pillars.length) + 1)}</span>
          </button>
        </div>

        <div key={`t${i}`} className="flex max-w-[702px] flex-col items-center gap-[10px] text-center animate-[fadeUp_0.5s_ease-out]" aria-live="polite">
          <p className="text-[15px] font-semibold">
            <span className="text-bh-blue">{pad(i + 1)}</span>/<span className="text-[12px] text-night-sky">{pad(pillars.length)}</span>
          </p>
          <h3 className="text-[25px] font-semibold leading-[1.33]">{p.title}</h3>
          <p className="text-base leading-[1.4] tracking-[-0.16px]">{p.body}</p>
          <div className="mt-2 flex gap-2" role="tablist" aria-label="Our promise">
            {pillars.map((x, n) => (
              <button key={x.title} role="tab" aria-selected={n === i} aria-label={x.title} onClick={() => setI(n)} className={`h-2 rounded-full transition-all ${n === i ? 'w-8 bg-bh-blue' : 'w-2 bg-bh-light-300'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

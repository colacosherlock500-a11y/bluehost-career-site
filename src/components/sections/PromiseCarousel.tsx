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

/** Scroll distance (in viewport heights) for each move from one pillar to the next. */
const STEP_VH = 0.75

/**
 * Where each pillar's photo sits at its focal point (when it is the active pillar): a side of
 * the screen and a height, as fractions of the stage from its centre. Photos fly in from deep
 * in the starfield (small, near the centre), land here, then rush past the viewer.
 */
const SLOTS = [
  { x: -0.33, y: 0.18, rot: -4 },
  { x: 0.33, y: -0.16, rot: 4 },
  { x: -0.31, y: -0.2, rot: 3 },
  { x: 0.32, y: 0.2, rot: -3 },
  { x: -0.32, y: 0.02, rot: -2 },
]
/** Depth (px, CSS perspective space) between one pillar's photo and the next. */
const DEPTH = 1500
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))

/** Stars in a box in front of the camera; flying forward pushes them out from the centre. */
function makeStars(n: number) {
  return Array.from({ length: n }, () => ({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random(), r: 0.4 + Math.random() * 1.1, tw: Math.random() * Math.PI * 2 }))
}

/**
 * Desktop (HR, ref. jobs.uber.com "Every step toward your next move"): a dark starfield that
 * pins while you scroll. The promise stays in the middle; each pillar's photo flies in from
 * deep space, settles beside the text while its pillar is active, then rushes past the camera
 * as the next one arrives, and the stars stream outwards with the scroll.
 */
function PromiseScroll({ id }: { id?: string }) {
  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const cards = useRef<(HTMLButtonElement | null)[]>([])
  const [active, setActive] = useState(0)

  useEffect(() => {
    const cv = canvas.current
    const ctx = cv?.getContext('2d')
    const stars = makeStars(260)
    let raf = 0
    let progress = 0
    let shown = progress
    let visible = false
    const draw = (now: number) => {
      if (!cv || !ctx) return
      const w = cv.clientWidth
      const h = cv.clientHeight
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      if (cv.width !== Math.round(w * dpr)) {
        cv.width = Math.round(w * dpr)
        cv.height = Math.round(h * dpr)
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      const travel = shown * 0.55
      for (const s of stars) {
        let z = (s.z - travel) % 1
        if (z <= 0) z += 1
        const k = 0.18 / (z + 0.04)
        const x = w / 2 + s.x * w * 0.5 * k
        const y = h / 2 + s.y * h * 0.5 * k
        if (x < -4 || x > w + 4 || y < -4 || y > h + 4) continue
        const a = clamp((1 - z) * 1.3) * (0.65 + 0.35 * Math.sin(now / 900 + s.tw))
        ctx.fillStyle = `rgba(214,233,255,${a.toFixed(3)})`
        ctx.beginPath()
        ctx.arc(x, y, s.r * (0.6 + (1 - z) * 1.2), 0, Math.PI * 2)
        ctx.fill()
      }
    }
    const place = () => {
      const st = stage.current
      if (!st) return
      const w = st.clientWidth
      const h = st.clientHeight
      cards.current.forEach((card, i) => {
        if (!card) return
        const d = i - shown // > 0: still ahead in the distance, 0: active, < 0: flown past
        const slot = SLOTS[i % SLOTS.length]
        const z = -d * DEPTH
        const o = d > 0 ? clamp((2.2 - d) / 0.8) : clamp(1 + d / 0.55)
        card.style.transform = `translate(-50%, -50%) translate3d(${slot.x * w}px, ${slot.y * h}px, ${z}px) rotate(${slot.rot * (1 - Math.min(1, Math.abs(d)))}deg)`
        card.style.opacity = o.toFixed(3)
        card.style.visibility = o < 0.01 ? 'hidden' : ''
        card.style.filter = d < -0.08 ? `blur(${Math.min(8, -d * 14).toFixed(1)}px)` : d > 1 ? `blur(${Math.min(2, (d - 1) * 2).toFixed(1)}px)` : ''
        card.style.zIndex = String(100 - Math.round(d * 10))
      })
    }
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (!visible) return
      const sec = section.current
      if (!sec) return
      const step = window.innerHeight * STEP_VH
      progress = clamp((78 - sec.getBoundingClientRect().top) / step, -0.6, pillars.length - 1 + 0.4)
      shown += (progress - shown) * 0.12 // a touch of inertia so the flight feels smooth
      if (Math.abs(progress - shown) < 1e-4) shown = progress
      place()
      draw(now)
      setActive(Math.round(clamp(shown, 0, pillars.length - 1)))
    }
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    if (section.current) io.observe(section.current)
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [])

  // Dots and photos jump to a pillar by scrolling to its point in the section.
  const goTo = (n: number) => {
    const sec = section.current
    if (!sec) return
    window.scrollTo({ top: sec.getBoundingClientRect().top + window.scrollY - 78 + n * window.innerHeight * STEP_VH, behavior: 'smooth' })
  }
  const p = pillars[active]

  return (
    <section id={id} ref={section} className="relative scroll-mt-24 bg-[#020c1f]" style={{ height: `calc(100vh + ${(pillars.length - 1) * STEP_VH * 100 + 40}vh)` }}>
      <div className="sticky top-[78px] h-[calc(100vh-78px)] overflow-hidden bg-[radial-gradient(ellipse_at_50%_55%,#0b2a5c_0%,#041431_45%,#020c1f_80%)] text-white">
        <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full" />
        <div ref={stage} className="absolute inset-0 [perspective-origin:50%_50%] [perspective:900px] [transform-style:preserve-3d]">
          {pillars.map((x, i) => (
            <button
              key={x.title}
              ref={el => {
                cards.current[i] = el
              }}
              onClick={() => goTo(i)}
              aria-label={`${pad(i + 1)} ${x.title}`}
              className="absolute left-1/2 top-1/2 aspect-[348/253] w-[clamp(220px,22vw,340px)] overflow-hidden rounded-[14px] shadow-[0_30px_80px_rgba(0,0,0,0.55)] ring-1 ring-white/15 will-change-transform"
            >
              <img src={x.image} alt="" className="size-full object-cover" />
              <span className="absolute left-4 top-3 text-[25px] font-semibold text-white drop-shadow">{pad(i + 1)}</span>
            </button>
          ))}
        </div>

        <div className="pointer-events-none relative z-[200] mx-auto flex h-full max-w-[560px] flex-col items-center justify-center gap-[clamp(14px,2.6vh,28px)] px-4 text-center">
          <div className="flex flex-col items-center gap-4">
            <p className="eyebrow !text-[#83c0fc]">Our promise to you</p>
            <h2 className="h-section !text-white">What belonging, building, growing, and shining look like here</h2>
          </div>
          <img src={logo3d} alt="" className="h-[clamp(70px,12vh,130px)] w-auto animate-[float_6s_ease-in-out_infinite] object-contain drop-shadow-[0_10px_40px_rgba(81,191,242,0.35)]" />
          <div key={active} className="flex min-h-[150px] flex-col items-center gap-[10px] animate-[fadeUp_0.45s_ease-out]" aria-live="polite">
            <p className="text-[15px] font-semibold">
              <span className="text-[#83c0fc]">{pad(active + 1)}</span>/<span className="text-[12px] text-white/60">{pad(pillars.length)}</span>
            </p>
            <h3 className="text-[25px] font-semibold leading-[1.33]">{p.title}</h3>
            <p className="text-base leading-[1.45] tracking-[-0.16px] text-white/80">{p.body}</p>
          </div>
          <div className="pointer-events-auto flex gap-2" role="tablist" aria-label="Our promise">
            {pillars.map((x, n) => (
              <button key={x.title} role="tab" aria-selected={n === active} aria-label={x.title} onClick={() => goTo(n)} className={`h-2 rounded-full transition-all ${n === active ? 'w-8 bg-[#83c0fc]' : 'w-2 bg-white/30'}`} />
            ))}
          </div>
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

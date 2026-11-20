import { useEffect, useRef } from 'react'

/*
 * Home hero background: a galaxy in the Bluehost blues. Stars sit at different depths and
 * drift slowly towards the viewer (near stars are bigger, brighter and faster, so the field
 * has depth), twinkle, and lean a little with the pointer. Soft nebula clouds and a faint
 * band of light (the hero's CSS, `.hero-galaxy`) sit behind them. Paused off screen;
 * reduced motion draws one still frame.
 */
const COUNT = 700
const SPEED = 0.018 // depth units per second (slow, calm drift)

type Star = { x: number; y: number; z: number; r: number; tw: number; hue: number }

const rand = (a: number, b: number) => a + Math.random() * (b - a)
const newStar = (z = rand(0.15, 1)): Star => ({ x: rand(-1, 1), y: rand(-1, 1), z, r: rand(0.5, 1.4), tw: rand(0, Math.PI * 2), hue: Math.random() })

export function GalaxyBackground() {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = canvas.current
    const ctx = cv?.getContext('2d')
    if (!cv || !ctx) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const stars = Array.from({ length: COUNT }, () => newStar())
    let w = 0
    let h = 0
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      w = cv.clientWidth
      h = cv.clientHeight
      cv.width = Math.round(w * dpr)
      cv.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(cv)

    let px = 0
    let py = 0
    let tx = 0
    let ty = 0
    const onPointer = (e: PointerEvent) => {
      tx = e.clientX / window.innerWidth - 0.5
      ty = e.clientY / window.innerHeight - 0.5
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    const draw = (now: number, dt: number) => {
      ctx.clearRect(0, 0, w, h)
      px += (tx - px) * 0.04
      py += (ty - py) * 0.04
      const cx = w / 2
      const cy = h * 0.46
      const spread = Math.max(w, h) * 0.55
      for (const s of stars) {
        s.z -= SPEED * dt
        if (s.z <= 0.05) Object.assign(s, newStar(1))
        const k = 0.22 / s.z // perspective: nearer stars spread out and grow
        const near = 1 - s.z
        const x = cx + (s.x * spread * k) - px * 40 * near
        const y = cy + (s.y * spread * k) - py * 30 * near
        if (x < -10 || x > w + 10 || y < -10 || y > h + 10) {
          if (s.z < 0.6) Object.assign(s, newStar(1))
          continue
        }
        const twinkle = 0.7 + 0.3 * Math.sin(now / 700 + s.tw)
        const a = Math.min(1, (0.25 + near * 0.95) * twinkle)
        const r = s.r * (0.4 + near * 1.9)
        // most stars blue-white, a few warmer ones
        const col = s.hue > 0.88 ? '255,226,196' : s.hue > 0.45 ? '206,226,255' : '255,255,255'
        if (r > 1.6) {
          const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3.2)
          g.addColorStop(0, `rgba(${col},${(a * 0.55).toFixed(3)})`)
          g.addColorStop(1, `rgba(${col},0)`)
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(x, y, r * 3.2, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.fillStyle = `rgba(${col},${a.toFixed(3)})`
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    if (reduce) {
      draw(0, 0)
      return () => {
        ro.disconnect()
        window.removeEventListener('pointermove', onPointer)
      }
    }

    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(cv)
    let raf = 0
    let last = performance.now()
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (visible) draw(now, dt)
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onPointer)
    }
  }, [])

  return <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 size-full" />
}

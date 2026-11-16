import { useEffect, useRef, useState, type RefObject } from 'react'
import iconGrid from '../../../assets/img/teams-page/icon-grid.svg'

/*
 * Our Teams (QA feedback + cube reference video): the Bluehost 3×3 symbol in the hero
 * becomes a 3D cube that, as the visitor scrolls, tumbles, shrinks and travels down the page
 * into the corner of the team photo box. It then stays on the photo and turns to a new face
 * each time the visitor switches teams.
 *
 * The cube lives in `container`'s coordinate space (absolutely positioned), so once it has
 * landed it scrolls with the photo. Its start is the element marked [data-cube-start] (the
 * hero grid, hidden while the cube is shown), its end the element marked [data-cube-target].
 * Desktop only; phones and reduced motion keep the flat hero grid.
 *
 * HR feedback (following the cube reference): the cube is a little bigger, it trails the
 * scroll position with a soft lag so it moves more slowly, it spins a quarter turn when
 * hovered, and once a function name is clicked (`docked`) it glides to the bottom of the
 * teams section ([data-cube-dock]).
 */

const BASE = 406 // px, the hero grid's size (the cube is built at this size and scaled)
const END_SIZE = 168
const DOCK_SIZE = 190
/** Share of the remaining distance covered each frame: lower = slower, softer movement. */
const FOLLOW = 0.06
const END_ROT_X = -24
const END_ROT_Y = 360 + 38 // one full turn on the way down, landing on a three-quarter view

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

const faces = [
  { t: `translateZ(${BASE / 2}px)`, r: 0 }, // front: matches the hero grid exactly
  { t: `rotateY(90deg) translateZ(${BASE / 2}px)`, r: 90 },
  { t: `rotateY(180deg) translateZ(${BASE / 2}px)`, r: 180 },
  { t: `rotateY(-90deg) translateZ(${BASE / 2}px)`, r: 270 },
  { t: `rotateX(90deg) translateZ(${BASE / 2}px)`, r: 90 },
  { t: `rotateX(-90deg) translateZ(${BASE / 2}px)`, r: 180 },
]

export function TeamCube({ container, face, docked = false }: { container: RefObject<HTMLElement | null>; face: number; docked?: boolean }) {
  const outer = useRef<HTMLDivElement>(null)
  const [spin, setSpin] = useState(0)
  const dockedRef = useRef(docked)
  dockedRef.current = docked
  const kick = useRef<() => void>(() => {})
  useEffect(() => kick.current(), [docked])

  useEffect(() => {
    const box = container.current
    const el = outer.current
    if (!box || !el) return
    const enabled = window.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)')
    let raf = 0
    // current pose [x, y, size, rotX, rotY]; eased towards the scroll-driven target every frame
    let cur: number[] | null = null

    const target = (): number[] | null => {
      const start = box.querySelector<HTMLElement>('[data-cube-start]')
      const photo = box.querySelector<HTMLElement>('[data-cube-target]')
      const dock = box.querySelector<HTMLElement>('[data-cube-dock]')
      if (!start || !photo || !enabled.matches) {
        el.style.display = 'none'
        if (start) start.style.visibility = ''
        return null
      }
      el.style.display = ''
      start.style.visibility = 'hidden'
      const b = box.getBoundingClientRect()
      const s = start.getBoundingClientRect()
      const t = photo.getBoundingClientRect()
      const vh = window.innerHeight
      const sx = s.left - b.left + s.width / 2
      const sy = s.top - b.top + s.height / 2
      if (dockedRef.current && dock) {
        const d = dock.getBoundingClientRect()
        return [d.left - b.left + d.width / 2, d.top - b.top + d.height / 2, DOCK_SIZE, END_ROT_X, END_ROT_Y]
      }
      // end: inside the photo's bottom-left corner
      const ex = t.left - b.left + END_SIZE * 0.7
      const ey = t.bottom - b.top - END_SIZE * 0.7
      // 0 at the top of the page, 1 once the photo box's middle reaches the middle of the screen
      const travel = t.top + window.scrollY + t.height / 2 - vh / 2
      const p = travel > 0 ? ease(Math.min(1, Math.max(0, window.scrollY / travel))) : 1
      return [lerp(sx, ex, p), lerp(sy, ey, p), lerp(s.width * 1.08, END_SIZE, p), lerp(0, END_ROT_X, p), lerp(0, END_ROT_Y, p)]
    }

    const update = () => {
      raf = 0
      const tgt = target()
      if (!tgt) {
        cur = null
        return
      }
      cur = cur ? cur.map((v, i) => v + (tgt[i] - v) * FOLLOW) : tgt
      const [x, y, size, rx, ry] = cur
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${size / BASE}) perspective(2400px) rotateX(${rx}deg) rotateY(${ry}deg)`
      // keep easing until the cube has caught up
      if (cur.some((v, i) => Math.abs(v - tgt[i]) > 0.05)) schedule()
    }
    const schedule = () => {
      raf ||= requestAnimationFrame(update)
    }
    kick.current = schedule
    update()
    const ro = new ResizeObserver(schedule)
    ro.observe(box)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    enabled.addEventListener('change', schedule)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      enabled.removeEventListener('change', schedule)
      const start = box.querySelector<HTMLElement>('[data-cube-start]')
      if (start) start.style.visibility = ''
    }
  }, [container])

  return (
    <div aria-hidden className="pointer-events-none absolute left-0 top-0 z-20 hidden lg:block" style={{ width: 0, height: 0 }}>
      <div ref={outer} className="absolute left-0 top-0 will-change-transform [transform-style:preserve-3d]" style={{ width: BASE, height: BASE, display: 'none' }}>
        {/* turns to a new face whenever the team changes, and a quarter turn more on hover */}
        <div
          onPointerEnter={() => setSpin(n => n + 1)}
          className="pointer-events-auto absolute inset-0 transition-[transform,scale] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] [transform-style:preserve-3d] hover:scale-[1.06]"
          style={{ transform: `rotateY(${-90 * (face + spin)}deg)` }}
        >
          {faces.map((f, i) => (
            <div key={i} className="absolute inset-0 overflow-hidden rounded-[10px] bg-[#e9f2ff] [backface-visibility:hidden]" style={{ transform: f.t }}>
              <img src={iconGrid} alt="" className="size-full" style={{ rotate: `${f.r}deg` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

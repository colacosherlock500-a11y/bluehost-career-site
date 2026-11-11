import { useEffect, useRef, type RefObject } from 'react'
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
 */

const BASE = 406 // px, the hero grid's size (the cube is built at this size and scaled)
const END_SIZE = 128
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

export function TeamCube({ container, face }: { container: RefObject<HTMLElement | null>; face: number }) {
  const outer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const box = container.current
    const el = outer.current
    if (!box || !el) return
    const enabled = window.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)')
    let raf = 0

    const update = () => {
      raf = 0
      const start = box.querySelector<HTMLElement>('[data-cube-start]')
      const target = box.querySelector<HTMLElement>('[data-cube-target]')
      if (!start || !target || !enabled.matches) {
        el.style.display = 'none'
        if (start) start.style.visibility = ''
        return
      }
      el.style.display = ''
      start.style.visibility = 'hidden'
      const b = box.getBoundingClientRect()
      const s = start.getBoundingClientRect()
      const t = target.getBoundingClientRect()
      const vh = window.innerHeight
      // start: centre of the hero grid; end: inside the photo's bottom-left corner
      const sx = s.left - b.left + s.width / 2
      const sy = s.top - b.top + s.height / 2
      const ex = t.left - b.left + END_SIZE * 0.7
      const ey = t.bottom - b.top - END_SIZE * 0.7
      // 0 at the top of the page, 1 once the photo box's middle reaches the middle of the screen
      const travel = t.top + window.scrollY + t.height / 2 - vh / 2
      const p = travel > 0 ? ease(Math.min(1, Math.max(0, window.scrollY / travel))) : 1
      const size = lerp(s.width, END_SIZE, p)
      el.style.transform = `translate3d(${lerp(sx, ex, p)}px, ${lerp(sy, ey, p)}px, 0) translate(-50%, -50%) scale(${size / BASE}) perspective(2400px) rotateX(${lerp(0, END_ROT_X, p)}deg) rotateY(${lerp(0, END_ROT_Y, p)}deg)`
    }
    const schedule = () => {
      raf ||= requestAnimationFrame(update)
    }
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
        {/* turns to a new face whenever the team changes */}
        <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] [transform-style:preserve-3d]" style={{ transform: `rotateY(${-90 * face}deg)` }}>
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

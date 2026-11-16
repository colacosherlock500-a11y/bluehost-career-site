import { useEffect, useRef, type RefObject } from 'react'
import tile1 from '../../../assets/img/teams-page/cube/tile-1.svg'
import tile2 from '../../../assets/img/teams-page/cube/tile-2.svg'
import tile3 from '../../../assets/img/teams-page/cube/tile-3.svg'
import tile4 from '../../../assets/img/teams-page/cube/tile-4.svg'
import tile5 from '../../../assets/img/teams-page/cube/tile-5.svg'
import tile6 from '../../../assets/img/teams-page/cube/tile-6.svg'
import tile7 from '../../../assets/img/teams-page/cube/tile-7.svg'
import tile8 from '../../../assets/img/teams-page/cube/tile-8.svg'
import tile9 from '../../../assets/img/teams-page/cube/tile-9.svg'

/*
 * Our Teams: the Bluehost 3×3 symbol in the hero becomes a 3D cube that floats down the page
 * onto the team photo (Maryna's cube prototype, ornate-daffodil-4cfe35.netlify.app).
 *
 * - Hero: it shows the flat Figma layout (nine tiles with light gaps), floats gently and leans
 *   towards the pointer.
 * - Scrolling: it follows the scroll with heavy inertia (slow, floaty), makes one turn around
 *   its vertical axis along a soft arc, the tiles lift apart mid-flight, the gaps fill in
 *   and each face is shaded by a light from the top left.
 * - It lands on the photo's bottom-left corner ([data-cube-target]) in a three-quarter view,
 *   with a soft shadow growing under it, and turns a quarter turn each time the team changes
 *   or the pointer touches it.
 *
 * The cube lives in `container`'s coordinate space. Its start is [data-cube-start] (hidden
 * while the cube is shown). Reduced motion keeps the flat hero grid.
 */

const TILES = [tile1, tile2, tile3, tile4, tile5, tile6, tile7, tile8, tile9]
const BASE = 405.24 // px: the hero grid's size (the cube is built at this size and scaled)
const TILE = 129.6
const STEP = 137.82
const H = BASE / 2
/** Final resting pose on the photo: a three-quarter view so it reads as a cube. */
const END_X = -22
const END_Y = -32

// Six faces: the front is the hero illustration, the others are reshuffles so every side reads differently.
const FACES: { n: [number, number, number]; t: string; order: number[] }[] = [
  { n: [0, 0, 1], t: `translateZ(${H}px)`, order: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
  { n: [1, 0, 0], t: `rotateY(90deg) translateZ(${H}px)`, order: [4, 6, 1, 8, 0, 7, 2, 5, 3] },
  { n: [0, 0, -1], t: `rotateY(180deg) translateZ(${H}px)`, order: [8, 3, 6, 1, 4, 2, 7, 0, 5] },
  { n: [-1, 0, 0], t: `rotateY(-90deg) translateZ(${H}px)`, order: [5, 0, 7, 2, 8, 3, 4, 6, 1] },
  { n: [0, -1, 0], t: `rotateX(90deg) translateZ(${H}px)`, order: [2, 7, 4, 6, 1, 5, 3, 8, 0] },
  { n: [0, 1, 0], t: `rotateX(-90deg) translateZ(${H}px)`, order: [7, 5, 3, 0, 6, 8, 1, 4, 2] },
]

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const easeSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2
const rad = (d: number) => (d * Math.PI) / 180
// light from the top left, in front
const LIGHT = (() => {
  const v = [-0.45, -0.7, 0.75]
  const m = Math.hypot(...v)
  return v.map(x => x / m)
})()

/** Rotates a face normal by CSS rotateX(a) rotateY(b) (applied right to left). */
function rotate([x, y, z]: [number, number, number], a: number, b: number): [number, number, number] {
  a = rad(a)
  b = rad(b)
  ;[x, z] = [x * Math.cos(b) + z * Math.sin(b), -x * Math.sin(b) + z * Math.cos(b)]
  ;[y, z] = [y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)]
  return [x, y, z]
}

export function TeamCube({ container, face }: { container: RefObject<HTMLElement | null>; face: number }) {
  const cubeRef = useRef<HTMLDivElement>(null)
  const turnTarget = useRef(0)
  const lastFace = useRef(face)

  // a quarter turn each time the team changes
  useEffect(() => {
    if (face !== lastFace.current) turnTarget.current += 90
    lastFace.current = face
  }, [face])

  useEffect(() => {
    const box = container.current
    const cube = cubeRef.current
    if (!box || !cube) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const faceEls = [...cube.querySelectorAll<HTMLElement>('[data-face]')].map((el, i) => ({
      el,
      n: FACES[i].n,
      shade: el.querySelector<HTMLElement>('[data-shade]')!,
      stickers: [...el.querySelectorAll<HTMLElement>('[data-sticker]')],
    }))

    let p = 0
    let turn = 0
    let mx = 0
    let my = 0
    let tmx = 0
    let tmy = 0
    const t0 = performance.now()
    const onPointer = (e: PointerEvent) => {
      tmx = e.clientX / window.innerWidth - 0.5
      tmy = e.clientY / window.innerHeight - 0.5
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    let raf = 0
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const start = box.querySelector<HTMLElement>('[data-cube-start]')
      const landing = box.querySelector<HTMLElement>('[data-cube-target]')
      if (!start || !landing || reduce.matches) {
        cube.style.display = 'none'
        if (start) start.style.visibility = ''
        return
      }
      cube.style.display = ''
      start.style.visibility = 'hidden'
      const b = box.getBoundingClientRect()
      const A = start.getBoundingClientRect()
      const B = landing.getBoundingClientRect()

      // 0 at the top of the page → 1 when the landing spot reaches the middle of the screen
      const end = Math.max(1, B.top + window.scrollY + B.height / 2 - window.innerHeight * 0.55)
      const target = clamp(window.scrollY / end)
      p += (target - p) * 0.045 // heavy inertia: a slower, floatier descent
      if (Math.abs(target - p) < 1e-4) p = target
      turn += (turnTarget.current - turn) * 0.06
      mx += (tmx - mx) * 0.05
      my += (tmy - my) * 0.05

      const e = easeSine(p)
      const arc = Math.sin(Math.PI * p)
      const idle = 1 - clamp(p * 5)
      const time = (now - t0) / 1000
      const settled = clamp((p - 0.97) / 0.03)

      // a gentle arc over the empty side of the page, then a glide onto the photo corner
      const cx = lerp(A.left - b.left + A.width / 2, B.left - b.left + B.width / 2, e) + arc * Math.min(120, window.innerWidth * 0.07)
      const cy = lerp(A.top - b.top + A.height / 2, B.top - b.top + B.height / 2, e) + Math.sin(time * 1.1) * 5 * (idle + settled)
      const scale = lerp(A.width, B.width, e) / BASE
      const rx = END_X * e - 10 * arc - my * 14 * idle + Math.sin(time * 0.9) * 1.5 * settled
      const ry = (360 + END_Y) * e + mx * 20 * idle + turn

      cube.style.transform = `translate3d(${cx - BASE / 2}px, ${cy - BASE / 2}px, 0) scale(${scale}) perspective(1500px) rotateX(${rx}deg) rotateY(${ry}deg)`

      // the gaps fill in once it starts turning; the tiles lift apart mid-flight
      const bed = clamp(p * 14 + (Math.abs(mx) + Math.abs(my)) * 1.5)
      const lift = 10 * arc
      for (const f of faceEls) {
        f.el.style.setProperty('--bed', String(bed))
        const n = rotate(f.n, rx, ry)
        const d = n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]
        f.shade.style.opacity = String(0.5 * (1 - clamp(d * 0.5 + 0.5)) * clamp(p * 6 + 0.4))
        f.stickers.forEach((s, i) => (s.style.transform = `translateZ(${lift * (1 + (i % 2))}px)`))
      }
      const near = clamp((p - 0.8) / 0.2)
      landing.style.setProperty('--pad-o', String(near))
      landing.style.setProperty('--pad-s', String(0.3 + 0.7 * near))
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointer)
      const start = box.querySelector<HTMLElement>('[data-cube-start]')
      if (start) start.style.visibility = ''
    }
  }, [container])

  return (
    <div aria-hidden className="pointer-events-none absolute left-0 top-0 z-20" style={{ width: 0, height: 0 }}>
      <div
        ref={cubeRef}
        onPointerEnter={() => (turnTarget.current += 90)}
        className="pointer-events-auto absolute left-0 top-0 origin-center will-change-transform [transform-style:preserve-3d]"
        style={{ width: BASE, height: BASE, display: 'none' }}
      >
        {FACES.map((f, fi) => (
          <div key={fi} data-face className="absolute inset-0 [backface-visibility:hidden] [transform-style:preserve-3d]" style={{ transform: f.t }}>
            <div className="absolute inset-0 bg-[#041d33] [opacity:var(--bed,0)]" />
            {f.order.map((k, i) => (
              <img
                key={i}
                data-sticker
                src={TILES[k]}
                alt=""
                draggable={false}
                className="absolute [backface-visibility:hidden]"
                style={{ left: (i % 3) * STEP, top: Math.floor(i / 3) * STEP, width: TILE, height: TILE }}
              />
            ))}
            <div data-shade className="pointer-events-none absolute inset-0 bg-[#00142e] opacity-0 [backface-visibility:hidden]" style={{ transform: 'translateZ(24px)' }} />
          </div>
        ))}
      </div>
    </div>
  )
}

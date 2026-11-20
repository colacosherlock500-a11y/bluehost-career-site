import { useEffect, useRef, useState } from 'react'
import belong from '../../../assets/img/evp/belong.jpg'
import grow from '../../../assets/img/evp/grow.jpg'
import oneTeam from '../../../assets/img/evp/one-team.jpg'
import shine from '../../../assets/img/evp/shine.jpg'
import lifeTeam from '../../../assets/img/home/life-team-photo.jpg'
import { useT } from '../../../i18n/I18n'

/*
 * Home hero: the puzzle cube from the reference video ("logo 2", Maria). A 3×3×3 cube whose
 * tiles carry our photos, with the six face centres playing short videos (events and customer
 * stories). It starts so close it fills the screen, pulls back while turning, then keeps
 * tumbling at an easy pace while its outer layers twist like a puzzle cube, the white core
 * showing in the cut. A pause button stops it; reduced motion shows a still cube.
 *
 * Built for steady rendering (the previous cube flickered): the 26 cubies move only when their
 * layer turns, nothing inside the 3D scene changes opacity, and every tile is a plain image
 * (or one of the six centre videos).
 *
 * MEDIA: stills and loops were cut from the Austin recap, the AI Builder Tour (Brazil), the
 * bakery customer story, the AI receptionist and AI Store spots, the AI All-Access post and the
 * event photos HR sent. Add more to src/assets/img/cube and src/assets/video/cube.
 */

const stills = Object.values(import.meta.glob<string>('../../../assets/img/cube/*.jpg', { eager: true, import: 'default' }))
const videoFiles = import.meta.glob<string>('../../../assets/video/cube/*.mp4', { eager: true, import: 'default' })
const webmFiles = import.meta.glob<string>('../../../assets/video/cube/*.webm', { eager: true, import: 'default' })
const posters = import.meta.glob<string>('../../../assets/video/cube/*.jpg', { eager: true, import: 'default' })
const VIDEOS = Object.entries(videoFiles).map(([path, src]) => ({ src, webm: webmFiles[path.replace(/\.mp4$/, '.webm')], poster: posters[path.replace(/\.mp4$/, '.jpg')] }))
const IMAGES = [...stills, lifeTeam, belong, grow, shine, oneTeam]

type Axis = 0 | 1 | 2
type Vec = [number, number, number]
const AXES: Vec[] = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
]
/** Sticker orientation for each outward direction (a sticker is built facing +z). */
const FACE_T: Record<string, string> = {
  '0,0,1': '',
  '0,0,-1': 'rotateY(180deg)',
  '1,0,0': 'rotateY(90deg)',
  '-1,0,0': 'rotateY(-90deg)',
  '0,1,0': 'rotateX(-90deg)',
  '0,-1,0': 'rotateX(90deg)',
}

interface Cubie {
  pos: Vec
  rot: DOMMatrix
  stickers: string[]
}

function makeCubies(): Cubie[] {
  const list: Cubie[] = []
  for (let x = -1; x <= 1; x++)
    for (let y = -1; y <= 1; y++)
      for (let z = -1; z <= 1; z++) {
        if (!x && !y && !z) continue
        const p: Vec = [x, y, z]
        const stickers = p.flatMap((v, a) => {
          if (!v) return []
          const dir: Vec = [0, 0, 0]
          dir[a] = v
          return [dir.join(',')]
        })
        list.push({ pos: p, rot: new DOMMatrix(), stickers })
      }
  return list
}

const INTRO_MS = 4200
const TWIST_EVERY_MS = 2600
const TWIST_MS = 900
const SPIN_DEG_PER_S = 9

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const easeOut = (t: number) => 1 - (1 - t) ** 3
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

export function HeroCube() {
  const t = useT()
  const [cubies] = useState(makeCubies)
  const root = useRef<HTMLDivElement>(null)
  const cubieEls = useRef<(HTMLDivElement | null)[]>([])
  const cutMoving = useRef<HTMLDivElement>(null)
  const cutStill = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)
  const pausedRef = useRef(paused)
  pausedRef.current = paused

  // Media for every sticker: videos on the six centres, photos everywhere else.
  const [media] = useState(() => {
    let img = 0
    let vid = 0
    return cubies.map(c =>
      c.stickers.map(() => {
        const isCentre = c.pos.filter(v => v !== 0).length === 1
        if (isCentre && VIDEOS.length) return { video: VIDEOS[vid++ % VIDEOS.length] }
        return { image: IMAGES[(img++ * 7) % IMAGES.length] }
      }),
    )
  })

  useEffect(() => {
    const el = root.current
    const cutM = cutMoving.current
    const cutS = cutStill.current
    if (!el || !cutM || !cutS) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cell = () => el.offsetWidth / 3
    const place = (i: number, extra = '') => {
      const c = cubies[i]
      const s = cell()
      const node = cubieEls.current[i]
      if (node) node.style.transform = `${extra} translate3d(${c.pos[0] * s}px, ${c.pos[1] * s}px, ${c.pos[2] * s}px) ${c.rot.toString()}`
    }
    const placeAll = () => {
      el.style.setProperty('--cell', `${cell()}px`)
      cubies.forEach((_, i) => place(i))
    }
    placeAll()
    const ro = new ResizeObserver(placeAll)
    ro.observe(el)

    // the face videos play only while the hero is on screen and the cube isn't paused
    const videos = [...el.querySelectorAll('video')]
    let onScreen = true
    const syncVideos = () => videos.forEach(v => (onScreen && !pausedRef.current && !reduce ? v.play().catch(() => {}) : v.pause()))
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting
      syncVideos()
    })
    io.observe(el.parentElement!)

    if (reduce) {
      el.style.transform = 'rotateX(-24deg) rotateY(-35deg)'
      return () => {
        ro.disconnect()
        io.disconnect()
      }
    }

    // ---- layer twists ----
    let twist: { axis: Axis; layer: number; dir: number; start: number; members: number[]; base: string } | null = null
    let lastTwist: { axis: Axis; layer: number; dir: number } | null = null
    const startTwist = (now: number) => {
      let axis: Axis, layer: number, dir: number
      do {
        axis = Math.floor(Math.random() * 3) as Axis
        layer = Math.random() < 0.5 ? -1 : 1
        dir = Math.random() < 0.5 ? -1 : 1
      } while (lastTwist && lastTwist.axis === axis && lastTwist.layer === layer && lastTwist.dir === -dir)
      const members = cubies.map((c, i) => (c.pos[axis] === layer ? i : -1)).filter(i => i >= 0)
      // the white core shows in the cut: one panel turns with the layer, one stays put
      const s = cell()
      const orient = axis === 0 ? 'rotateY(90deg)' : axis === 1 ? 'rotateX(90deg)' : ''
      const at = (d: number) => {
        const v = (layer * s) / 2 + d
        return `translate3d(${axis === 0 ? v : 0}px, ${axis === 1 ? v : 0}px, ${axis === 2 ? v : 0}px) ${orient}`
      }
      cutS.style.transform = at(-layer * 0.6)
      cutS.style.display = 'block'
      cutM.style.display = 'block'
      twist = { axis, layer, dir, start: now, members, base: at(layer * 0.6) }
    }
    const stepTwist = (now: number) => {
      if (!twist) return
      const p = clamp((now - twist.start) / TWIST_MS)
      const [ax, ay, az] = AXES[twist.axis]
      const r = `rotate3d(${ax}, ${ay}, ${az}, ${90 * twist.dir * easeInOut(p)}deg)`
      twist.members.forEach(i => place(i, r))
      cutM.style.transform = `${r} ${twist.base}`
      if (p < 1) return
      const m = new DOMMatrix().rotateAxisAngleSelf(ax, ay, az, 90 * twist.dir)
      twist.members.forEach(i => {
        const c = cubies[i]
        const q = m.transformPoint(new DOMPoint(...c.pos))
        c.pos = [Math.round(q.x), Math.round(q.y), Math.round(q.z)]
        c.rot = m.multiply(c.rot)
        place(i)
      })
      cutM.style.display = 'none'
      cutS.style.display = 'none'
      lastTwist = twist
      twist = null
    }

    // ---- camera: in close, pull back while turning, then tumble gently ----
    let elapsed = 0
    let last = performance.now()
    let nextTwist = 1800
    let ry = 0
    let raf = 0
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(50, now - last)
      last = now
      if (pausedRef.current || !onScreen) return
      elapsed += dt
      const ie = easeOut(clamp(elapsed / INTRO_MS))
      ry += (SPIN_DEG_PER_S * dt) / 1000
      const scale = 5.2 - 4.2 * ie
      const rx = -24 + 34 * (1 - ie) + Math.sin(elapsed / 2600) * 9
      const y = Math.sin(elapsed / 2200) * 14 // floating in space
      el.style.transform = `translateY(${y}px) scale(${scale}) rotateX(${rx}deg) rotateY(${-150 * (1 - ie) - 35 + ry}deg) rotateZ(${8 * (1 - ie)}deg)`
      if (!twist && elapsed >= nextTwist) {
        startTwist(now)
        nextTwist = elapsed + TWIST_EVERY_MS
      }
      stepTwist(now)
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [cubies])

  // play / pause the videos with the button
  useEffect(() => {
    root.current?.querySelectorAll('video').forEach(v => (paused ? v.pause() : v.play().catch(() => {})))
  }, [paused])

  const cutPanel = 'absolute left-0 top-0 size-full rounded-[4px] bg-[#f4f7fc]'
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center [perspective:1400px]">
      <div ref={root} className="relative aspect-square w-[min(330px,58vw)] will-change-transform [transform-style:preserve-3d]">
        <div ref={cutStill} className={cutPanel} style={{ display: 'none' }} />
        <div ref={cutMoving} className={cutPanel} style={{ display: 'none' }} />
        {cubies.map((c, i) => (
          <div
            key={i}
            ref={el => {
              cubieEls.current[i] = el
            }}
            className="absolute left-1/3 top-1/3 size-1/3 [transform-style:preserve-3d]"
          >
            {c.stickers.map((key, k) => {
              const m = media[i][k]
              return (
                <div key={key} className="absolute inset-0 p-[1.5px] [backface-visibility:hidden]" style={{ transform: `${FACE_T[key]} translateZ(calc(var(--cell, 110px) / 2))` }}>
                  <div className="size-full overflow-hidden rounded-[4px] bg-[#dfe7f3]">
                    {'video' in m && m.video ? (
                      <video poster={m.video.poster} className="size-full object-cover" muted loop playsInline preload="auto">
                        {m.video.webm && <source src={m.video.webm} type="video/webm" />}
                        <source src={m.video.src} type="video/mp4" />
                      </video>
                    ) : (
                      <img src={'image' in m ? m.image : ''} alt="" draggable={false} decoding="async" className="size-full object-cover" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setPaused(p => !p)}
        className="pointer-events-auto absolute bottom-5 left-5 flex size-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:hidden"
        aria-label={paused ? t('Play animation') : t('Pause animation')}
      >
        {paused ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
          </svg>
        )}
      </button>
    </div>
  )
}

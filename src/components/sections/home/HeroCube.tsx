import { useEffect, useRef, useState } from 'react'
import belong from '../../../assets/img/evp/belong.jpg'
import build from '../../../assets/img/evp/build.jpg'
import grow from '../../../assets/img/evp/grow.jpg'
import oneTeam from '../../../assets/img/evp/one-team.jpg'
import shine from '../../../assets/img/evp/shine.jpg'
import lifeTeam from '../../../assets/img/home/life-team-photo.jpg'
import aiBuilder from '../../../assets/img/life/ai-builder.jpg'
import businessBuilder from '../../../assets/img/life/business-builder.jpg'
import howWeWork from '../../../assets/img/life/how-we-work.jpg'
import { teams } from '../../../data/teams'
import { affinityGroups } from '../../../data/affinityGroups'
import { useT } from '../../../i18n/I18n'

/*
 * Home hero (review call, Nov 18): the cube from Nikki's reference video, without its
 * background. It comes in big, its 54 tiles flying in from all around and locking into a
 * cube as it shrinks and spins; then it stays in the hero and keeps moving, turning a quarter
 * at a time like a puzzle cube, with the tiles easing apart on every turn. A pause button
 * stops the motion. Reduced motion: a still cube in a three-quarter view.
 *
 * MEDIA: the tiles use our own photos for now. Nikki is sending customer videos; add them to
 * TILES as { video: url } (they play muted and looped) and they take a tile each.
 */

type Tile = { image: string } | { video: string; poster?: string }

const pick = (names: string[]) => affinityGroups.filter(g => names.includes(g.name)).map(g => g.image)
const TILES: Tile[] = [
  businessBuilder,
  belong,
  aiBuilder,
  ...teams.map(t => t.image),
  build,
  lifeTeam,
  grow,
  howWeWork,
  shine,
  oneTeam,
  ...pick(['Parents', 'Gamers', 'Globetrotters', 'Foodies', 'Coders', 'Women in Newfold', 'Earth Allies', 'Pets', 'Speakers', 'Strides', 'Artist', 'Black', 'Hispanic/Latinos', 'FIT']),
].map(src => ({ image: src }))

const N = 3 // tiles per edge
const FACES = [
  'rotateY(0deg)',
  'rotateY(90deg)',
  'rotateY(180deg)',
  'rotateY(-90deg)',
  'rotateX(90deg)',
  'rotateX(-90deg)',
]
const INTRO_MS = 3200
const TURN_EVERY_MS = 3200
const TURN_MS = 1100

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const easeOut = (t: number) => 1 - (1 - t) ** 3
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

/** A stable pseudo-random number per tile, so the fly-in looks the same on every visit. */
const rnd = (i: number, k: number) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453
  return x - Math.floor(x)
}

export function HeroCube() {
  const t = useT()
  const cube = useRef<HTMLDivElement>(null)
  const tiles = useRef<(HTMLDivElement | null)[]>([])
  const [paused, setPaused] = useState(false)
  const pausedRef = useRef(paused)
  pausedRef.current = paused

  useEffect(() => {
    const el = cube.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const size = () => el.offsetWidth
    const place = (intro: number, lift: number) => {
      const s = size()
      const cell = s / N
      tiles.current.forEach((tile, i) => {
        if (!tile) return
        const f = Math.floor(i / (N * N))
        const k = i % (N * N)
        const x = ((k % N) - 1) * cell
        const y = (Math.floor(k / N) - 1) * cell
        // fly-in: each tile starts far out, scattered and tumbling, and lands a beat after the last
        const d = clamp((intro - rnd(i, 1) * 0.35) / 0.65)
        const e = easeOut(d)
        const far = 1 - e
        const ox = (rnd(i, 2) - 0.5) * s * 5 * far
        const oy = (rnd(i, 3) - 0.5) * s * 4 * far
        const oz = (600 + rnd(i, 4) * 1600) * far + lift * (8 + (k % 2) * 6)
        const r = (rnd(i, 5) - 0.5) * 540 * far
        tile.style.transform = `${FACES[f]} translateZ(${s / 2}px) translate3d(${x + ox}px, ${y + oy}px, ${oz}px) rotateX(${r}deg) rotateY(${r * 0.7}deg)`
        tile.style.opacity = String(clamp(d * 3))
      })
    }

    if (reduce) {
      place(1, 0)
      el.style.transform = 'rotateX(-22deg) rotateY(-32deg)'
      return
    }

    // quarter turns around alternating axes, like a puzzle cube being played with
    const axes: ['x' | 'y', number][] = [['y', -90], ['x', 90], ['y', -90], ['x', -90], ['y', 90], ['x', 90]]
    let rx = -22
    let ry = -32
    let turnStart = -1
    let turnIdx = 0
    let from = { rx, ry }
    let elapsed = 0
    let last = performance.now()
    let raf = 0
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(64, now - last)
      last = now
      if (pausedRef.current) return
      elapsed += dt
      const intro = clamp(elapsed / INTRO_MS)
      const ie = easeInOut(intro)
      let lift = 0
      if (intro >= 1) {
        const since = elapsed - INTRO_MS
        const n = Math.floor(since / TURN_EVERY_MS)
        if (n + 1 > turnIdx) {
          // start the next quarter turn
          turnIdx = n + 1
          turnStart = since
          from = { rx, ry }
        }
        const p = clamp((since - turnStart) / TURN_MS)
        const [axis, deg] = axes[(turnIdx - 1) % axes.length]
        const tp = easeInOut(p)
        if (axis === 'x') rx = from.rx + deg * tp
        else ry = from.ry + deg * tp
        lift = Math.sin(Math.PI * p) // tiles ease apart mid-turn
        if (p >= 1) from = { rx, ry }
      }
      // comes in big and spinning, settles into a three-quarter view, then keeps drifting
      const scale = 2.4 - 1.4 * ie
      const spin = (1 - ie) * 300
      const floatY = Math.sin(elapsed / 1400) * 8
      el.style.transform = `translateY(${floatY}px) scale(${scale}) rotateX(${rx + (1 - ie) * 40}deg) rotateY(${ry - spin}deg)`
      place(intro, lift)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center [perspective:1600px]">
      <div ref={cube} className="relative aspect-square w-[min(400px,64vw)] will-change-transform [transform-style:preserve-3d]">
        {FACES.map((_, f) =>
          Array.from({ length: N * N }, (_, k) => {
            const i = f * N * N + k
            const tile = TILES[(i * 7) % TILES.length]
            return (
              <div
                key={i}
                ref={el => {
                  tiles.current[i] = el
                }}
                className="absolute left-1/2 top-1/2 -ml-[16.6667%] -mt-[16.6667%] size-[33.3333%] p-[3px] [backface-visibility:hidden]"
                style={{ opacity: 0 }}
              >
                <div className="size-full overflow-hidden rounded-[6px] bg-[#0e3b79] shadow-[0_0_0_1px_rgba(255,255,255,0.18)]">
                  {'video' in tile ? (
                    <video src={tile.video} poster={tile.poster} className="size-full object-cover" autoPlay muted loop playsInline />
                  ) : (
                    <img src={tile.image} alt="" draggable={false} className="size-full object-cover" />
                  )}
                </div>
              </div>
            )
          }),
        )}
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

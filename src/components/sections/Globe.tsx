import { geoOrthographic, geoPath, geoGraticule10, type GeoPermissibleObjects } from 'd3-geo'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { feature } from 'topojson-client'
import type { FeatureCollection, Geometry } from 'geojson'
import type { GeometryCollection, Topology } from 'topojson-specification'
import check from '../../assets/img/common/check.svg'
import closeIcon from '../../assets/img/common/close.svg'
import { getBenefits } from '../../data/benefits'
import { countries, type Country } from '../../data/countries'
import { formatOpenRoles, useJobStats } from '../../hooks/useJobs'
import { useT } from '../../i18n/I18n'

/** ISO 3166 numeric codes (world-atlas feature ids) for the countries we operate in. */
const isoBySlug: Record<string, string> = {
  'united-states': '840',
  argentina: '032',
  brazil: '076',
  canada: '124',
  india: '356',
  netherlands: '528',
  philippines: '608',
  'united-kingdom': '826',
  italy: '380',
  spain: '724',
}
const slugByIso = Object.fromEntries(Object.entries(isoBySlug).map(([s, iso]) => [iso, s]))

type Land = FeatureCollection<Geometry, { name: string }>
// The world map (~100 kB) is code-split and loaded once on first use.
let landPromise: Promise<Land> | null = null
const loadLand = () =>
  (landPromise ??= import('world-atlas/countries-110m.json').then(m => {
    const topo = m.default as unknown as Topology<{ countries: GeometryCollection }>
    return feature(topo, topo.objects.countries) as Land
  }))

type Rotation = [number, number]
/** Whether a [lon, lat] point faces the viewer for the given rotation. */
const visible = (lonlat: [number, number], [l, p]: Rotation) => {
  const toRad = Math.PI / 180
  const lambda = (lonlat[0] + l) * toRad
  const phi = lonlat[1] * toRad
  const phi0 = -p * toRad
  return Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(lambda) > 0
}
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)

interface GlobeProps {
  /** Selected country slug (controlled). */
  selected?: string | null
  onSelect?: (slug: string | null) => void
  /** Show the photo card + stats panel when a country is selected (Figma "Variant2"). */
  showDetails?: boolean
  /** Fade the "Click a country" hint in/out (hidden while the globe is still animating into place). */
  hintVisible?: boolean
}

/**
 * Interactive globe ("Click a country · drag to rotate").
 * Rotates on its own, can be dragged, and clicking a highlighted country focuses it.
 */
export function Globe({ selected: controlled, onSelect, showDetails = true, hintVisible = true }: GlobeProps) {
  const t = useT()
  const [internal, setInternal] = useState<string | null>(null)
  const selected = controlled !== undefined ? controlled : internal
  const select = (slug: string | null) => {
    if (controlled === undefined) setInternal(slug)
    onSelect?.(slug)
  }

  const size = 460
  const rotation = useRef<Rotation>([100, -10])
  const autoRotate = useRef(true)
  const [land, setLand] = useState<Land | null>(null)
  useEffect(() => {
    loadLand().then(setLand)
  }, [])

  const projection = useMemo(() => geoOrthographic().scale(size / 2 - 8).translate([size / 2, size / 2]).clipAngle(90), [])
  const path = useMemo(() => geoPath(projection), [projection])
  const graticule = useMemo(() => geoGraticule10(), [])
  const sel = countries.find(c => c.slug === selected)

  // The globe is redrawn imperatively (no React state per frame) so the
  // animation never competes with route transitions or other renders.
  const graticuleRef = useRef<SVGPathElement>(null)
  const landRef = useRef<SVGGElement>(null)
  const markersRef = useRef<SVGGElement>(null)
  const labelRef = useRef<SVGGElement>(null)
  const draw = () => {
    projection.rotate(rotation.current)
    graticuleRef.current?.setAttribute('d', path(graticule) ?? '')
    if (land && landRef.current) {
      const els = landRef.current.children
      land.features.forEach((f, i) => els[i]?.setAttribute('d', path(f) ?? ''))
    }
    markersRef.current?.querySelectorAll<SVGGElement>('[data-lat]').forEach(g => {
      const lonlat: [number, number] = [Number(g.dataset.lon), Number(g.dataset.lat)]
      const xy = projection(lonlat)
      const show = !!xy && visible(lonlat, rotation.current)
      g.style.display = show ? '' : 'none'
      if (show) g.setAttribute('transform', `translate(${xy![0]} ${xy![1]})`)
    })
    if (sel && labelRef.current) {
      const lonlat: [number, number] = [sel.center[1], sel.center[0]]
      const xy = projection(lonlat)
      const show = !!xy && visible(lonlat, rotation.current)
      labelRef.current.style.display = show ? '' : 'none'
      if (show) labelRef.current.setAttribute('transform', `translate(${xy![0] + 12} ${xy![1] - 12})`)
    }
  }
  const drawRef = useRef(draw)
  drawRef.current = draw
  useLayoutEffect(() => drawRef.current())

  // Animation loop: auto-rotation and tweening to the selected country.
  const tween = useRef<{ from: Rotation; to: Rotation; start: number } | null>(null)
  useEffect(() => {
    let raf = 0
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const tick = (now: number) => {
      if (tween.current) {
        const { from, to, start } = tween.current
        const t = Math.min(1, (now - start) / 900)
        const e = easeInOut(t)
        rotation.current = [from[0] + (to[0] - from[0]) * e, from[1] + (to[1] - from[1]) * e]
        if (t === 1) tween.current = null
        drawRef.current()
      } else if (autoRotate.current && !reduceMotion.matches) {
        rotation.current = [rotation.current[0] + 0.12, rotation.current[1]]
        drawRef.current()
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Rotate to the selected country.
  useEffect(() => {
    if (!selected) {
      autoRotate.current = true
      return
    }
    const c = countries.find(x => x.slug === selected)
    if (!c) return
    autoRotate.current = false
    const [lat, lon] = c.center
    const from = rotation.current
    let toLambda = -lon
    // shortest path around the globe
    while (toLambda - from[0] > 180) toLambda -= 360
    while (toLambda - from[0] < -180) toLambda += 360
    tween.current = { from, to: [toLambda, -lat * 0.6], start: performance.now() }
  }, [selected])

  // Drag to rotate
  const drag = useRef<{ x: number; y: number; r: Rotation; moved: boolean } | null>(null)
  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY, r: rotation.current, moved: false }
    ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.x
    const dy = e.clientY - d.y
    if (Math.abs(dx) + Math.abs(dy) > 4) {
      d.moved = true
      autoRotate.current = false
      tween.current = null
    }
    if (d.moved) {
      rotation.current = [d.r[0] + dx * 0.35, Math.max(-60, Math.min(60, d.r[1] - dy * 0.35))]
      draw()
    }
  }
  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current
    drag.current = null
    if (d && !d.moved) {
      // treat as click: find the country under the pointer
      const target = document.elementFromPoint(e.clientX, e.clientY) as SVGPathElement | null
      const slug = target?.dataset.slug
      if (slug) select(slug === selected ? null : slug)
    } else if (!selected) {
      autoRotate.current = true
    }
  }

  const markers = countries.flatMap(c => c.offices.filter(o => o.coords).map(o => ({ country: c, office: o, coords: o.coords! })))

  return (
    <div className="relative mx-auto flex w-full max-w-[1212px] flex-col items-center">
      <div className="pointer-events-none absolute inset-x-[18%] -top-8 h-48 rounded-full bg-[radial-gradient(closest-side,rgba(232,240,255,0.9),rgba(255,255,255,0))]" />
      <p aria-hidden={!hintVisible} className={`relative mb-6 flex items-center gap-2 text-[12px] font-medium text-[#6a7a99] transition-[opacity,translate] duration-500 ${hintVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
        <span className="size-2 rounded-full bg-bh-blue ring-4 ring-bh-light-100" />
        {t('Click a country · drag to rotate')}
      </p>

      <div className={`grid w-full items-center gap-8 ${sel && showDetails ? 'lg:grid-cols-[302px_1fr_343px]' : 'grid-cols-1'}`}>
        {sel && showDetails && <CountryPhotoCard country={sel} />}

        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="mx-auto w-full max-w-[460px] cursor-grab touch-none select-none overflow-visible active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          role="img"
          aria-label={t('Interactive globe showing Bluehost locations')}
        >
          <defs>
            <radialGradient id="globe-sphere" cx="42%" cy="38%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#eef4ff" />
              <stop offset="100%" stopColor="#d8e6ff" />
            </radialGradient>
          </defs>
          <circle cx={size / 2} cy={size / 2} r={size / 2 - 4} fill="#e9f1ff" opacity={0.6} />
          <path d={path({ type: 'Sphere' } as GeoPermissibleObjects) ?? undefined} fill="url(#globe-sphere)" />
          <path ref={graticuleRef} fill="none" stroke="#dbe7ff" strokeWidth={0.5} opacity={0.6} />
          <g ref={landRef}>
          {land?.features.map(f => {
            const slug = slugByIso[String(f.id)]
            const isSel = slug && slug === selected
            return (
              <path
                key={String(f.id) + f.properties.name}
                data-slug={slug}
                fill={isSel ? '#196cdf' : slug ? '#9dbcf7' : '#b4cdfa'}
                stroke="#eef4ff"
                strokeWidth={0.4}
                className={slug ? 'cursor-pointer transition-[fill] hover:fill-[#5f95ef]' : ''}
              >
                {slug && <title>{countries.find(c => c.slug === slug)?.name}</title>}
              </path>
            )
          })}
          </g>
          <g ref={markersRef}>
            {markers.map(({ country, office, coords }) => (
              <g key={country.slug + office.city} data-lat={coords[0]} data-lon={coords[1]} className="pointer-events-none">
                <circle r={9} fill="#196cdf" opacity={0.18} />
                <circle r={4.5} fill="white" />
                <circle r={3} fill="#3b6fe0" />
              </g>
            ))}
          </g>
          {sel && (
            <g ref={labelRef} className="pointer-events-none">
              <rect x={0} y={-11} rx={6} width={t(sel.name).length * 6.6 + 18} height={22} fill="white" stroke="#dbe7ff" />
              <text x={9} y={4} fontSize={11} fontWeight={600} fill="#041d33">{t(sel.name)}</text>
            </g>
          )}
        </svg>

        {sel && showDetails && <CountryStatsPanel country={sel} onResume={() => select(null)} />}
      </div>

      <CountryPager selected={selected} onSelect={select} />
    </div>
  )
}

function CountryPhotoCard({ country }: { country: Country }) {
  const t = useT()
  return (
    <Link to={`/locations/${country.slug}`} className="relative mx-auto block aspect-[302/384] w-full max-w-[302px] overflow-hidden rounded-[14px] shadow-[0_30px_60px_rgba(0,42,102,0.2)] animate-[fadeUp_0.5s_ease-out]">
      <img src={country.tile} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-x-0 bottom-0 h-[32%] bg-gradient-to-b from-[rgba(1,33,70,0)] to-[rgba(1,33,70,0.85)]" />
      <p className="absolute bottom-[18px] left-[15px] text-[20px] font-semibold text-white">{t(country.name)}</p>
      {country.employees !== undefined && <p className="absolute bottom-[21px] right-[15px] text-[13.8px] text-gold">{t(`${country.employees} employees`)}</p>}
    </Link>
  )
}

function CountryStatsPanel({ country, onResume }: { country: Country; onResume: () => void }) {
  const t = useT()
  const { data: stats } = useJobStats()
  return (
    <div className="mx-auto flex w-full max-w-[343px] flex-col gap-[13px] animate-[fadeUp_0.5s_ease-out]">
      <div className="flex gap-[17px]">
        <div className="flex flex-col gap-[5px]">
          <p className="eyebrow">{t('employees')}</p>
          <p className="text-[38px] font-semibold leading-[1.3] tracking-[-0.38px] text-bh-blue">{country.employees ?? '—'}</p>
        </div>
        <div className="flex flex-col gap-[5px]">
          <p className="eyebrow">{t('open roles')}</p>
          <Link to={`/jobs?country=${country.slug}`} className="text-[38px] font-semibold leading-[1.3] tracking-[-0.38px] text-bh-blue hover:underline" aria-label={t(formatOpenRoles(stats?.byCountry[country.slug]))}>
            {stats?.byCountry[country.slug] ?? '—'}
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-[10px]">
        <p className="text-[20px] font-semibold leading-[1.3] tracking-[-0.2px]">{t('Benefits:')}</p>
        <ul>
          {getBenefits(country.slug).slice(0, 7).map(b => (
            <li key={b} className="flex items-center gap-[9px] text-base leading-[1.4]">
              <img src={check} alt="" className="size-[22px]" />
              {t(b)}
            </li>
          ))}
        </ul>
      </div>
      <button onClick={onResume} className="flex items-center gap-[3px] self-start rounded-[7.8px] border-[1.3px] border-bh-light-400 py-[10.9px] pl-[14px] pr-[12.5px] text-[12.5px] font-medium capitalize text-[#6eb3fc] hover:bg-bh-light-0">
        <img src={closeIcon} alt="" className="size-[18px]" />
        {t('Resume rotation')}
      </button>
    </div>
  )
}

function CountryPager({ selected, onSelect }: { selected: string | null; onSelect: (slug: string) => void }) {
  const t = useT()
  const idx = Math.max(0, countries.findIndex(c => c.slug === selected))
  const at = (d: number) => countries[(idx + d + countries.length) % countries.length]
  const go = (d: number) => onSelect(at(d).slug)
  return (
    <div className="mt-[44px] flex items-center gap-[25px] text-[15px] font-medium text-[#a7b4cc]">
      <button onClick={() => go(-1)} aria-label={t('Previous country')} className="flex size-[35px] items-center justify-center rounded-full border border-[#e3e8f2] text-black shadow-sm hover:bg-bh-light-0">‹</button>
      {[-1, 0, 1].map(d => {
        const c = at(d)
        const isActive = d === 0 && !!selected
        return (
          <button key={c.slug + d} onClick={() => onSelect(c.slug)} className={`hidden whitespace-nowrap sm:block ${isActive ? 'text-[19px] text-bh-blue' : 'hover:text-bh-blue'} ${d === 0 ? '!block' : ''}`}>
            {t(c.name)}
          </button>
        )
      })}
      <button onClick={() => go(1)} aria-label={t('Next country')} className="flex size-[35px] items-center justify-center rounded-full border border-[#e3e8f2] text-black shadow-sm hover:bg-bh-light-0">›</button>
    </div>
  )
}

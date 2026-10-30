import { geoOrthographic, geoPath, geoGraticule10, type GeoPermissibleObjects } from 'd3-geo'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { feature } from 'topojson-client'
import type { FeatureCollection, Geometry } from 'geojson'
import type { GeometryCollection, Topology } from 'topojson-specification'
import world from 'world-atlas/countries-110m.json'
import check from '../../assets/img/common/check.svg'
import closeIcon from '../../assets/img/common/close.svg'
import { countries, defaultBenefits, type Country } from '../../data/countries'
import { formatOpenRoles, useJobStats } from '../../hooks/useJobs'

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

const topo = world as unknown as Topology<{ countries: GeometryCollection }>
const land = feature(topo, topo.objects.countries) as FeatureCollection<Geometry, { name: string }>

type Rotation = [number, number]
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)

interface GlobeProps {
  /** Selected country slug (controlled). */
  selected?: string | null
  onSelect?: (slug: string | null) => void
  /** Show the photo card + stats panel when a country is selected (Figma "Variant2"). */
  showDetails?: boolean
}

/**
 * Interactive globe ("Click a country · drag to rotate").
 * Rotates on its own, can be dragged, and clicking a highlighted country focuses it.
 */
export function Globe({ selected: controlled, onSelect, showDetails = true }: GlobeProps) {
  const [internal, setInternal] = useState<string | null>(null)
  const selected = controlled !== undefined ? controlled : internal
  const select = (slug: string | null) => {
    if (controlled === undefined) setInternal(slug)
    onSelect?.(slug)
  }

  const size = 460
  const rotation = useRef<Rotation>([100, -10])
  const autoRotate = useRef(true)
  const svgRef = useRef<SVGSVGElement>(null)
  const [, force] = useState(0)

  const projection = useMemo(() => geoOrthographic().scale(size / 2 - 8).translate([size / 2, size / 2]).clipAngle(90), [])
  const path = useMemo(() => geoPath(projection), [projection])
  const graticule = useMemo(() => geoGraticule10(), [])

  // Animation loop: auto-rotation and tweening to the selected country.
  const tween = useRef<{ from: Rotation; to: Rotation; start: number } | null>(null)
  useEffect(() => {
    let raf = 0
    const tick = (now: number) => {
      if (tween.current) {
        const { from, to, start } = tween.current
        const t = Math.min(1, (now - start) / 900)
        const e = easeInOut(t)
        rotation.current = [from[0] + (to[0] - from[0]) * e, from[1] + (to[1] - from[1]) * e]
        if (t === 1) tween.current = null
        force(n => n + 1)
      } else if (autoRotate.current && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        rotation.current = [rotation.current[0] + 0.12, rotation.current[1]]
        force(n => n + 1)
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
      force(n => n + 1)
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

  projection.rotate(rotation.current)
  const sel = countries.find(c => c.slug === selected)
  const markers = countries.flatMap(c => c.offices.filter(o => o.coords).map(o => ({ country: c, office: o, xy: projection([o.coords![1], o.coords![0]]) })))
  // Hide markers on the back side of the globe.
  const visible = (lonlat: [number, number]) => {
    const [l, p] = rotation.current
    const toRad = Math.PI / 180
    const lambda = (lonlat[0] + l) * toRad
    const phi = lonlat[1] * toRad
    const phi0 = -p * toRad
    return Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(lambda) > 0
  }
  const labelXY = sel ? projection([sel.center[1], sel.center[0]]) : null

  return (
    <div className="relative mx-auto flex w-full max-w-[1212px] flex-col items-center">
      <div className="pointer-events-none absolute inset-x-[18%] -top-8 h-48 rounded-full bg-[radial-gradient(closest-side,rgba(232,240,255,0.9),rgba(255,255,255,0))]" />
      <p className="relative mb-6 flex items-center gap-2 text-[12px] font-medium text-[#6a7a99]">
        <span className="size-2 rounded-full bg-bh-blue ring-4 ring-bh-light-100" />
        Click a country · drag to rotate
      </p>

      <div className={`grid w-full items-center gap-8 ${sel && showDetails ? 'lg:grid-cols-[302px_1fr_343px]' : 'grid-cols-1'}`}>
        {sel && showDetails && <CountryPhotoCard country={sel} />}

        <svg
          ref={svgRef}
          viewBox={`0 0 ${size} ${size}`}
          className="mx-auto w-full max-w-[460px] cursor-grab touch-none select-none active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          role="img"
          aria-label="Interactive globe showing Bluehost locations"
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
          <path d={path(graticule) ?? undefined} fill="none" stroke="#dbe7ff" strokeWidth={0.5} opacity={0.6} />
          {land.features.map(f => {
            const slug = slugByIso[String(f.id)]
            const isSel = slug && slug === selected
            return (
              <path
                key={String(f.id) + f.properties.name}
                d={path(f) ?? undefined}
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
          {markers.map(({ country, office, xy }) =>
            xy && visible([office.coords![1], office.coords![0]]) ? (
              <g key={country.slug + office.city} transform={`translate(${xy[0]} ${xy[1]})`} className="pointer-events-none">
                <circle r={9} fill="#196cdf" opacity={0.18} />
                <circle r={4.5} fill="white" />
                <circle r={3} fill="#3b6fe0" />
              </g>
            ) : null,
          )}
          {sel && labelXY && visible([sel.center[1], sel.center[0]]) && (
            <g transform={`translate(${labelXY[0] + 12} ${labelXY[1] - 12})`} className="pointer-events-none">
              <rect x={0} y={-11} rx={6} width={sel.name.length * 6.6 + 18} height={22} fill="white" stroke="#dbe7ff" />
              <text x={9} y={4} fontSize={11} fontWeight={600} fill="#041d33">{sel.name}</text>
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
  return (
    <Link to={`/locations/${country.slug}`} className="relative mx-auto block aspect-[302/384] w-full max-w-[302px] overflow-hidden rounded-[14px] shadow-[0_30px_60px_rgba(0,42,102,0.2)] animate-[fadeUp_0.5s_ease-out]">
      <img src={country.tile} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-x-0 bottom-0 h-[32%] bg-gradient-to-b from-[rgba(1,33,70,0)] to-[rgba(1,33,70,0.85)]" />
      <p className="absolute bottom-[18px] left-[15px] text-[20px] font-semibold text-white">{country.name}</p>
      {country.employees !== undefined && <p className="absolute bottom-[21px] right-[15px] text-[13.8px] text-gold">{country.employees} employees</p>}
    </Link>
  )
}

function CountryStatsPanel({ country, onResume }: { country: Country; onResume: () => void }) {
  const { data: stats } = useJobStats()
  return (
    <div className="mx-auto flex w-full max-w-[343px] flex-col gap-[13px] animate-[fadeUp_0.5s_ease-out]">
      <div className="flex gap-[17px]">
        <div className="flex flex-col gap-[5px]">
          <p className="eyebrow">employees</p>
          <p className="text-[38px] font-semibold leading-[1.3] tracking-[-0.38px] text-bh-blue">{country.employees ?? '—'}</p>
        </div>
        <div className="flex flex-col gap-[5px]">
          <p className="eyebrow">open roles</p>
          <Link to={`/jobs?country=${country.slug}`} className="text-[38px] font-semibold leading-[1.3] tracking-[-0.38px] text-bh-blue hover:underline" aria-label={formatOpenRoles(stats?.byCountry[country.slug])}>
            {stats?.byCountry[country.slug] ?? '—'}
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-[10px]">
        <p className="text-[20px] font-semibold leading-[1.3] tracking-[-0.2px]">Benefits:</p>
        <ul>
          {defaultBenefits.map(b => (
            <li key={b} className="flex items-center gap-[9px] text-base leading-[1.4]">
              <img src={check} alt="" className="size-[22px]" />
              {b}
            </li>
          ))}
        </ul>
      </div>
      <button onClick={onResume} className="flex items-center gap-[3px] self-start rounded-[7.8px] border-[1.3px] border-bh-light-400 py-[10.9px] pl-[14px] pr-[12.5px] text-[12.5px] font-medium capitalize text-[#6eb3fc] hover:bg-bh-light-0">
        <img src={closeIcon} alt="" className="size-[18px]" />
        Resume rotation
      </button>
    </div>
  )
}

function CountryPager({ selected, onSelect }: { selected: string | null; onSelect: (slug: string) => void }) {
  const idx = Math.max(0, countries.findIndex(c => c.slug === selected))
  const at = (d: number) => countries[(idx + d + countries.length) % countries.length]
  const go = (d: number) => onSelect(at(d).slug)
  return (
    <div className="mt-[44px] flex items-center gap-[25px] text-[15px] font-medium text-[#a7b4cc]">
      <button onClick={() => go(-1)} aria-label="Previous country" className="flex size-[35px] items-center justify-center rounded-full border border-[#e3e8f2] text-black shadow-sm hover:bg-bh-light-0">‹</button>
      {[-1, 0, 1].map(d => {
        const c = at(d)
        const isActive = d === 0 && !!selected
        return (
          <button key={c.slug + d} onClick={() => onSelect(c.slug)} className={`hidden whitespace-nowrap sm:block ${isActive ? 'text-[19px] text-bh-blue' : 'hover:text-bh-blue'} ${d === 0 ? '!block' : ''}`}>
            {c.name}
          </button>
        )
      })}
      <button onClick={() => go(1)} aria-label="Next country" className="flex size-[35px] items-center justify-center rounded-full border border-[#e3e8f2] text-black shadow-sm hover:bg-bh-light-0">›</button>
    </div>
  )
}

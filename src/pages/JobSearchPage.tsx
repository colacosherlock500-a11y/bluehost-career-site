import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import chevronDown from '../assets/img/common/chevron-down.svg'
import pinGrey from '../assets/img/common/pin-grey.svg'
import searchIcon from '../assets/img/common/search.svg'
import target from '../assets/img/common/target.svg'
import { JobCard } from '../components/jobs/JobCard'
import { JobCardSkeleton } from '../components/jobs/JobCard'
import { JobListCard } from '../components/jobs/JobListCard'
import { Pagination } from '../components/jobs/Pagination'
import { JoinCta } from '../components/sections/JoinCta'
import { workTypeOptions } from '../components/sections/JobSearchBar'
import { Button } from '../components/ui/Button'
import { RotatingWord } from '../components/ui/RotatingWord'
import { countries } from '../data/countries'
import { teams } from '../data/teams'
import { useJobSearch, useRecentlyViewedJobs } from '../hooks/useJobs'
import { createJobAlert } from '../services/jobAlerts'
import type { JobSearchParams, WorkType } from '../services/jobs'
import { useI18n, useT } from '../i18n/I18n'

const PAGE_SIZE = 6

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-[15px] font-medium leading-[1.4] tracking-[-0.15px] text-bh-blue-1100">{label}</label>
      {children}
    </div>
  )
}

const inputCls = 'h-[41px] w-full rounded-lg border border-[#dde4ee] bg-white text-[15px] tracking-[-0.15px] text-black shadow-[0_1px_1px_rgba(10,13,18,0.05)] outline-none placeholder:text-[#4e5c6e] focus:border-bh-light-400'

function Select({ id, value, onChange, placeholder, options }: { id: string; value: string; onChange: (v: string) => void; placeholder: string; options: { value: string; label: string; count?: number }[] }) {
  return (
    <div className="relative">
      <select id={id} value={value} onChange={e => onChange(e.target.value)} className={`${inputCls} appearance-none pl-[14px] pr-10`}>
        <option value="">{placeholder}</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>
            {o.label}{o.count !== undefined ? ` (${o.count})` : ''}
          </option>
        ))}
      </select>
      <img src={chevronDown} alt="" className="pointer-events-none absolute right-[9px] top-1/2 size-6 -translate-y-1/2" />
    </div>
  )
}

function readParams(sp: URLSearchParams): JobSearchParams {
  return {
    keyword: sp.get('keyword') ?? '',
    location: sp.get('location') ?? '',
    country: sp.get('country') ?? '',
    team: sp.get('team') ?? '',
    workType: (sp.get('workType') as WorkType) || undefined,
    radiusMiles: Number(sp.get('radius') ?? 100),
    page: Number(sp.get('page') ?? 1),
  }
}

function JobAlertCard({ search }: { search: JobSearchParams }) {
  const t = useT()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle')
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('saving')
    try {
      await createJobAlert(email, search)
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }
  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl px-[47px] py-[45px] text-center text-white" style={{ backgroundImage: 'linear-gradient(171deg, #5e9cd5 10%, #addbff 98%)' }}>
      <p className="text-[20px] font-semibold leading-[1.33] tracking-[-0.2px]">{t('Get job alerts for this search by email')}</p>
      {!open && <Button variant="white" onClick={() => setOpen(true)} className="w-[202px]">{t('Create alert')}</Button>}
      {open && status !== 'done' && (
        <form onSubmit={submit} className="flex w-full flex-col gap-3">
          <label htmlFor="alert-email" className="sr-only">{t('Email address')}</label>
          <input id="alert-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className={`${inputCls} px-[14px]`} />
          <Button type="submit" variant="white" arrow={false}>{t(status === 'saving' ? 'Saving…' : 'Subscribe')}</Button>
          {status === 'error' && <p className="text-sm">{t('Something went wrong. Please try again.')}</p>}
        </form>
      )}
      {status === 'done' && <p className="font-medium">{t('You’re subscribed! We’ll email new matching roles.')}</p>}
    </div>
  )
}

/** Closest office (or country centre, for remote-only countries) to a point, in miles. */
function nearestOffice(lat: number, lon: number) {
  const rad = Math.PI / 180
  const miles = (a: [number, number]) => {
    const dLat = (a[0] - lat) * rad
    const dLon = (a[1] - lon) * rad
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat * rad) * Math.cos(a[0] * rad) * Math.sin(dLon / 2) ** 2
    return 3958.8 * 2 * Math.asin(Math.sqrt(h))
  }
  const candidates = countries.flatMap(country => {
    const offices = country.offices.filter(o => o.coords).map(o => ({ country, city: o.city, miles: miles(o.coords!) }))
    return offices.length ? offices : [{ country, city: country.name, miles: miles(country.center) }]
  })
  return candidates.sort((a, b) => a.miles - b.miles)[0]
}

export default function JobSearchPage() {
  const { lang, t } = useI18n()
  const [sp, setSp] = useSearchParams()
  const params = readParams(sp)
  const [form, setForm] = useState(params)
  const { data, loading, error } = useJobSearch({ ...params, pageSize: PAGE_SIZE })
  const recent = useRecentlyViewedJobs(3)

  // Keep the form in sync when the URL changes (e.g. arriving from the home search bar).
  useEffect(() => setForm(readParams(sp)), [sp])

  const apply = (next: JobSearchParams) => {
    const q = new URLSearchParams()
    if (next.keyword) q.set('keyword', next.keyword)
    if (next.location) q.set('location', next.location)
    if (next.country) q.set('country', next.country)
    if (next.team) q.set('team', next.team)
    if (next.workType) q.set('workType', next.workType)
    if (next.location && next.radiusMiles && next.radiusMiles !== 100) q.set('radius', String(next.radiusMiles))
    if (next.page && next.page > 1) q.set('page', String(next.page))
    setSp(q)
  }

  // "Use my location": matches the visitor to the nearest Bluehost office and shows that
  // country's roles. INTEGRATION: once jobs carry coordinates (Workday distance search),
  // pass lat/lng + radius to the jobs API instead.
  const [locating, setLocating] = useState<{ state: 'idle' | 'busy' | 'done' | 'error'; message?: string }>({ state: 'idle' })
  const useMyLocation = () => {
    if (!('geolocation' in navigator) || !window.isSecureContext) {
      setLocating({ state: 'error', message: t('Your browser can\'t share your location here. Type a city instead.') })
      return
    }
    setLocating({ state: 'busy', message: t('Finding your location…') })
    navigator.geolocation.getCurrentPosition(
      pos => {
        const nearest = nearestOffice(pos.coords.latitude, pos.coords.longitude)
        if (!nearest) return setLocating({ state: 'error', message: t('We couldn\'t match your location to an office. Type a city instead.') })
        const next = { ...form, country: nearest.country.slug, location: '', page: 1 }
        setForm(next)
        apply(next)
        setLocating({
          state: 'done',
          message: `${t('Showing roles in')} ${t(nearest.country.name)} — ${t('nearest office')}: ${nearest.city}, ${t('about')} ${Math.round(nearest.miles).toLocaleString()} mi.`,
        })
      },
      err =>
        setLocating({
          state: 'error',
          message:
            err.code === err.PERMISSION_DENIED
              ? t('Location access is blocked. Allow it in your browser settings, or type a city instead.')
              : t('We couldn\'t get your location right now. Try again, or type a city instead.'),
        }),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 },
    )
  }

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0
  const facetCount = (list: { value: string; count: number }[] | undefined, v: string) => list?.find(f => f.value === v)?.count ?? 0

  return (
    <>
      <section className="bg-gradient-to-b from-[#e6f3ff] to-white px-4 pb-16 pt-[120px]">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-[34px]">
          <div className="flex flex-col gap-5">
            <p className="eyebrow">{t('Build your future with us')}</p>
            <h1 className="h-section">
              {t('Where people')} <RotatingWord key={lang} words={lang === 'pt' ? ['pertencem', 'constroem', 'crescem', 'brilham'] : undefined} /> {t('as one team')}
            </h1>
          </div>

          <div className="grid items-start gap-8 lg:grid-cols-[339px_1fr]">
            <aside className="flex flex-col gap-8">
              <form
                role="search"
                aria-label={t('Filter jobs')}
                className="flex flex-col gap-[19px]"
                onSubmit={e => {
                  e.preventDefault()
                  apply({ ...form, page: 1 })
                }}
              >
                <Field label={t('Search by skill')} htmlFor="f-keyword">
                  <div className="relative">
                    <img src={searchIcon} alt="" className="pointer-events-none absolute left-[14px] top-1/2 size-[21px] -translate-y-1/2" />
                    <input id="f-keyword" value={form.keyword} onChange={e => setForm(f => ({ ...f, keyword: e.target.value }))} placeholder={t('e.g. developer')} className={`${inputCls} border-bh-light-400 pl-[43px] pr-[14px]`} />
                  </div>
                </Field>
                <Field label={t('Location')} htmlFor="f-location">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <img src={pinGrey} alt="" className="pointer-events-none absolute left-[14px] top-1/2 size-[21px] -translate-y-1/2" />
                      <input id="f-location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder={t('City or ZIP code')} className={`${inputCls} pl-[43px] pr-[14px]`} />
                    </div>
                    <button
                      type="button"
                      onClick={useMyLocation}
                      disabled={locating.state === 'busy'}
                      aria-label={t('Use my location')}
                      title={t('Use my location')}
                      className="shrink-0 rounded-md transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-bh-blue disabled:cursor-wait"
                    >
                      <img src={target} alt="" className={`size-[26px] ${locating.state === 'busy' ? 'animate-pulse' : ''}`} />
                    </button>
                  </div>
                  {locating.message && (
                    <p role="status" className={`mt-2 text-[13px] leading-[1.4] ${locating.state === 'error' ? 'text-[#b42318]' : 'text-night-sky'}`}>
                      {locating.message}
                    </p>
                  )}
                </Field>
                <Field label={t('Country')} htmlFor="f-country">
                  <Select id="f-country" value={form.country ?? ''} onChange={country => setForm(f => ({ ...f, country }))} placeholder={t('All countries')} options={countries.map(c => ({ value: c.slug, label: t(c.name), count: data ? facetCount(data.facets.countries, c.slug) : undefined }))} />
                </Field>
                <Field label={t('Radius in miles')} htmlFor="f-radius">
                  <input id="f-radius" type="number" min={5} max={500} step={5} value={form.radiusMiles} onChange={e => setForm(f => ({ ...f, radiusMiles: Number(e.target.value) }))} className={`${inputCls} px-[14px]`} />
                  <input type="range" min={5} max={500} step={5} value={form.radiusMiles} onChange={e => setForm(f => ({ ...f, radiusMiles: Number(e.target.value) }))} aria-label={t('Radius in miles')} className="mt-2 w-full accent-bh-blue" />
                </Field>
                <Field label={t('Team')} htmlFor="f-team">
                  <Select id="f-team" value={form.team ?? ''} onChange={team => setForm(f => ({ ...f, team }))} placeholder={t('All teams')} options={teams.map(team => ({ value: team.slug, label: t(team.name), count: data ? facetCount(data.facets.teams, team.slug) : undefined }))} />
                </Field>
                <Field label={t('Work type')} htmlFor="f-worktype">
                  <Select id="f-worktype" value={form.workType ?? ''} onChange={v => setForm(f => ({ ...f, workType: (v || undefined) as WorkType | undefined }))} placeholder={t('All work types')} options={workTypeOptions.map(o => ({ ...o, label: t(o.label) }))} />
                </Field>
                <div className="mt-1 grid grid-cols-2 gap-[11px]">
                  <Button type="submit" className="!min-w-0 !py-3">{t('Search')}</Button>
                  <button
                    type="button"
                    onClick={() => {
                      setForm(readParams(new URLSearchParams()))
                      setSp(new URLSearchParams())
                    }}
                    className="rounded-[10px] border border-bh-blue bg-white py-3 text-base font-medium text-bh-blue hover:bg-bh-light-0"
                  >
                    {t('Clear Filters')}
                  </button>
                </div>
              </form>
              <JobAlertCard search={params} />
            </aside>

            <div className="flex flex-col gap-[21px]" aria-live="polite" aria-busy={loading}>
              <p className="text-[15px] text-night-sky">
                {loading ? t('Searching…') : error ? t('We couldn’t load jobs right now. Please try again later.') : t(`${data?.total ?? 0} open role${data?.total === 1 ? '' : 's'}`)}
              </p>
              {loading && Array.from({ length: 4 }, (_, i) => <JobCardSkeleton key={i} />)}
              {!loading && data?.jobs.map(job => <JobListCard key={job.id} job={job} />)}
              {!loading && data && data.jobs.length === 0 && (
                <div className="rounded-3xl border border-dashed border-bh-light-200 bg-white p-10 text-center">
                  <p className="text-[20px] font-semibold">{t('No roles match your search')}</p>
                  <p className="mt-2 text-night-sky">{t('Try removing a filter or searching for a broader skill.')}</p>
                </div>
              )}
              <div className="pt-4">
                <Pagination page={params.page ?? 1} totalPages={totalPages} onChange={page => { apply({ ...params, page }); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {recent.data && recent.data.length > 0 && (
        <section className="px-4 py-[50px]">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-8">
            <h2 className="h-section">{t('Recently viewed jobs')}</h2>
            <div className="grid gap-[21px] md:grid-cols-3">
              {recent.data.map(job => <JobCard key={job.id} job={job} />)}
            </div>
          </div>
        </section>
      )}

      <JoinCta
        eyebrow="join us"
        title={
          <>
            {t('Build your future')}{' '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #196cdf 30%, #83c0fc 100%)' }}>
              {t('with us')}
            </span>
          </>
        }
        body="Browse open roles across all our teams and regions. Your next opportunity is waiting."
        showTeamsButton={false}
        socialRow
      />
    </>
  )
}

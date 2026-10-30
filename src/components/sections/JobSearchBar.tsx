import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { countries } from '../../data/countries'
import { teams } from '../../data/teams'
import { useJobStats } from '../../hooks/useJobs'
import type { WorkType } from '../../services/jobs'
import { Button } from '../ui/Button'
import { FilterSelect } from '../ui/FilterSelect'

export const workTypeOptions: { value: WorkType; label: string }[] = [
  { value: 'Remote', label: 'Remote' },
  { value: 'Hybrid', label: 'Hybrid' },
  { value: 'On-site', label: 'On-site' },
]

export interface SearchValues {
  keyword: string
  country: string
  team: string
  workType: string
}

interface JobSearchBarProps {
  initial?: Partial<SearchValues>
  /** When provided, the bar updates in place (job search page) instead of navigating to /jobs. */
  onSearch?: (values: SearchValues) => void
  className?: string
}

/**
 * Keyword box + Location / Team / Work type filters. Option counts come from
 * the jobs service (`useJobStats`), so they reflect live Workday data once wired.
 */
export function JobSearchBar({ initial, onSearch, className = '' }: JobSearchBarProps) {
  const navigate = useNavigate()
  const { data: stats } = useJobStats()
  const [values, setValues] = useState<SearchValues>({ keyword: '', country: '', team: '', workType: '', ...initial })

  const submit = (next: SearchValues) => {
    if (onSearch) return onSearch(next)
    const q = new URLSearchParams()
    Object.entries(next).forEach(([k, v]) => v && q.set(k, v))
    navigate(`/jobs${q.size ? `?${q}` : ''}`)
  }

  const update = (patch: Partial<SearchValues>, immediate = !!onSearch) => {
    const next = { ...values, ...patch }
    setValues(next)
    if (immediate) submit(next)
  }

  return (
    <form
      role="search"
      onSubmit={(e: FormEvent) => {
        e.preventDefault()
        submit(values)
      }}
      className={`flex w-full max-w-[1150px] flex-col gap-[26px] ${className}`}
    >
      <div className="relative flex flex-col gap-3 sm:block">
        <input
          type="search"
          value={values.keyword}
          onChange={e => setValues(v => ({ ...v, keyword: e.target.value }))}
          placeholder="Search by role team or keyword..."
          aria-label="Search by role, team or keyword"
          className="h-14 w-full rounded-[9px] border border-night-sky-400 bg-bh-50 px-[35px] text-[15px] tracking-[-0.15px] text-bh-blue-1100 drop-shadow-[0px_0px_7.5px_rgba(25,107,222,0.16)] outline-none placeholder:text-night-sky focus:border-bh-blue sm:pr-[210px]"
        />
        <Button type="submit" className="h-14 sm:absolute sm:right-0 sm:top-0 sm:w-[189px]">Search Roles</Button>
      </div>
      <div className="flex flex-wrap justify-center gap-5 sm:justify-start">
        <FilterSelect
          label="Location"
          value={values.country}
          onChange={country => update({ country })}
          options={countries.map(c => ({ value: c.slug, label: c.name, count: stats?.byCountry[c.slug] }))}
        />
        <FilterSelect
          label="Team"
          value={values.team}
          onChange={team => update({ team })}
          options={teams.map(t => ({ value: t.slug, label: t.name, count: stats?.byTeam[t.slug] }))}
        />
        <FilterSelect label="Work type" value={values.workType} onChange={workType => update({ workType })} options={workTypeOptions} />
      </div>
    </form>
  )
}

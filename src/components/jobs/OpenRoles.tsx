import { useJobSearch } from '../../hooks/useJobs'
import type { JobSearchParams } from '../../services/jobs'
import { Button } from '../ui/Button'
import { JobCard, JobCardSkeleton } from './JobCard'

interface OpenRolesProps {
  title?: string
  /** Filter for the roles shown — e.g. `{ team: 'sales' }` or `{ country: 'brazil' }`. */
  filter?: JobSearchParams
  limit?: number
  /** Link for "Discover all jobs"; defaults to the job search with the same filter. */
  allJobsHref?: string
  excludeId?: string
}

/** "Open roles" row: heading + "Discover all jobs" + up to three live job cards. */
export function OpenRoles({ title = 'Open roles', filter = {}, limit = 3, allJobsHref, excludeId }: OpenRolesProps) {
  const { data, loading } = useJobSearch({ ...filter, pageSize: limit + (excludeId ? 1 : 0) })
  const jobs = (data?.jobs ?? []).filter(j => j.id !== excludeId).slice(0, limit)
  const q = new URLSearchParams(Object.entries(filter).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)]))
  const href = allJobsHref ?? `/jobs${q.size ? `?${q}` : ''}`

  return (
    <section className="px-4 py-[50px]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="h-section">{title}</h2>
          <Button to={href} variant="outline">Discover all jobs</Button>
        </div>
        <div className="grid gap-[33px] md:grid-cols-3">
          {loading && Array.from({ length: limit }, (_, i) => <JobCardSkeleton key={i} />)}
          {!loading && jobs.map(job => <JobCard key={job.id} job={job} />)}
          {!loading && jobs.length === 0 && (
            <p className="col-span-full rounded-3xl border border-dashed border-bh-light-200 bg-bh-light-0 p-8 text-center text-night-sky">
              There are no open roles here right now. Check back soon or explore all openings.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

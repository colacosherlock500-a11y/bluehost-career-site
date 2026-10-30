import type { Job, JobSearchParams, JobSearchResult, JobStats, JobsProvider } from './types'

/**
 * Workday integration — TO BE COMPLETED BY THE DEVELOPMENT TEAM.
 *
 * Enable it with `VITE_JOBS_PROVIDER=workday` and point `VITE_JOBS_API_URL`
 * at a backend endpoint (recommended: a small proxy/BFF in front of Workday,
 * because Workday endpoints are not meant to be called from the browser and
 * would expose tenant details / hit CORS).
 *
 * Expected proxy endpoints (adjust freely — only this file needs to change):
 *   GET  {API}/jobs?keyword=&country=&team=&workType=&page=&pageSize=  -> WorkdaySearchResponse
 *   GET  {API}/jobs/:id                                                -> WorkdayJob
 *   GET  {API}/jobs/stats                                              -> JobStats
 *
 * Map Workday fields onto the site's `Job` type in `mapJob` below. Typical
 * Workday Recruiting fields: Job_Requisition_ID, Job_Posting_Title,
 * Job_Family_Group (→ team), Primary_Location / Additional_Locations
 * (→ locations), Worker_Type / Time_Type (→ employmentType),
 * Job_Posting_Start_Date (→ postedAt), Job_Description (→ description),
 * External_Apply_URL (→ applyUrl).
 */

const API_URL = import.meta.env.VITE_JOBS_API_URL ?? '/api'

/** Shape returned by your proxy — replace with the real payload. */
interface WorkdayJob {
  id: string
  title: string
  jobFamily: string
  brand?: string
  locations: { city: string; country: string }[]
  remoteType?: string
  timeType?: string
  postedOn: string
  shortDescription?: string
  descriptionHtml?: string
  applyUrl: string
}

interface WorkdaySearchResponse {
  total: number
  jobs: WorkdayJob[]
  facets?: JobSearchResult['facets']
}

/** TODO(dev): map Workday Job Family Groups to the site's team slugs (src/data/teams.ts). */
const teamSlugFromJobFamily = (family: string) =>
  family.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

/** TODO(dev): map Workday country names / ISO codes to the site's country slugs (src/data/countries.ts). */
const countrySlug = (country: string) => country.toLowerCase().replace(/[^a-z0-9]+/g, '-')

function mapJob(w: WorkdayJob): Job {
  return {
    id: w.id,
    title: w.title,
    team: teamSlugFromJobFamily(w.jobFamily),
    brand: (w.brand as Job['brand']) ?? 'Bluehost',
    locations: w.locations.map(l => ({ city: l.city, country: countrySlug(l.country) })),
    workType: w.remoteType === 'Remote' ? 'Remote' : w.remoteType === 'Hybrid' ? 'Hybrid' : 'On-site',
    employmentType: w.timeType === 'Part time' ? 'Part-time' : 'Full-time',
    postedAt: w.postedOn,
    summary: w.shortDescription ?? '',
    // TODO(dev): parse descriptionHtml into sections, or render it as HTML on the role page.
    description: { about: w.descriptionHtml },
    applyUrl: w.applyUrl,
  }
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`Jobs API ${res.status} on ${path}`)
  return res.json() as Promise<T>
}

function query(params: JobSearchParams) {
  const q = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== '') q.set(k, String(v))
  return q.toString()
}

export const workdayProvider: JobsProvider = {
  async searchJobs(params) {
    const data = await get<WorkdaySearchResponse>(`/jobs?${query(params)}`)
    return {
      jobs: data.jobs.map(mapJob),
      total: data.total,
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 10,
      facets: data.facets ?? { countries: [], teams: [], workTypes: [] },
    }
  },

  async getJob(id) {
    try {
      return mapJob(await get<WorkdayJob>(`/jobs/${encodeURIComponent(id)}`))
    } catch {
      return null
    }
  },

  async getJobStats() {
    return get<JobStats>('/jobs/stats')
  },
}

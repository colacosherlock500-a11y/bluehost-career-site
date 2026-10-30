import type { Job, JobSearchParams, JobSearchResult, JobStats, JobsProvider } from './types'

/**
 * Live job data from the careers API server (server/), which pulls postings
 * from Workday on a schedule and maps them onto the site's types.
 * Workday credentials stay on that server — the browser only sees /api/*.
 *
 * Enabled with VITE_JOBS_PROVIDER=workday. VITE_JOBS_API_URL defaults to
 * "/api" (same origin; in development Vite proxies it to the API server).
 */

const API_URL = (import.meta.env.VITE_JOBS_API_URL ?? '/api').replace(/\/+$/, '')

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw Object.assign(new Error(`Jobs API ${res.status} on ${path}`), { status: res.status })
  return res.json() as Promise<T>
}

function query(params: JobSearchParams) {
  const q = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== '') q.set(k, String(v))
  return q.toString()
}

export const workdayProvider: JobsProvider = {
  searchJobs: params => get<JobSearchResult>(`/jobs?${query(params)}`),

  async getJob(id) {
    try {
      return await get<Job>(`/jobs/${encodeURIComponent(id)}`)
    } catch (e) {
      if ((e as { status?: number }).status === 404) return null
      throw e
    }
  },

  getJobStats: () => get<JobStats>('/jobs/stats'),
}

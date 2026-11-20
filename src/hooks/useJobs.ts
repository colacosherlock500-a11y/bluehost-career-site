import { useEffect, useState } from 'react'
import { jobsProvider } from '../services/jobs'
import type { Job, JobSearchParams, JobSearchResult, JobStats } from '../services/jobs'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

function useAsync<T>(load: () => Promise<T>, deps: unknown[]): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null })
  useEffect(() => {
    let active = true
    setState(s => ({ ...s, loading: true, error: null }))
    load().then(
      data => active && setState({ data, loading: false, error: null }),
      error => active && setState({ data: null, loading: false, error }),
    )
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return state
}

/** Paged, filterable job search (Jobs search page, team/country "open roles" lists). */
/**
 * With `teamFallback`, a search for a team plus a keyword that finds nothing (e.g. a career
 * area with no openings right now) returns all of that team's roles instead, flagged so the
 * page can say so — a career path card never leads to a dead end.
 */
export function useJobSearch(params: JobSearchParams, { teamFallback = false } = {}) {
  return useAsync<JobSearchResult & { teamFallback?: boolean }>(async () => {
    const res = await jobsProvider.searchJobs(params)
    if (!teamFallback || res.total > 0 || !params.team || !params.keyword) return res
    const all = await jobsProvider.searchJobs({ ...params, keyword: '' })
    return all.total > 0 ? { ...all, teamFallback: true } : res
  }, [
    teamFallback,
    params.keyword,
    params.country,
    params.team,
    params.workType,
    params.location,
    params.radiusMiles,
    params.page,
    params.pageSize,
  ])
}

export function useJob(id: string | undefined) {
  return useAsync<Job | null>(() => (id ? jobsProvider.getJob(id) : Promise.resolve(null)), [id])
}

// Stats are shared by many components on a page, so they are fetched once and
// reused for a few minutes (the server re-pulls Workday on its own schedule).
const STATS_TTL_MS = 5 * 60_000
let stats: { promise: Promise<JobStats>; at: number } | null = null

/** Total / per-country / per-team open role counts. */
export function useJobStats() {
  return useAsync<JobStats>(() => {
    if (!stats || Date.now() - stats.at > STATS_TTL_MS) {
      const promise = jobsProvider.getJobStats().catch(e => {
        stats = null
        throw e
      })
      stats = { promise, at: Date.now() }
    }
    return stats.promise
  }, [])
}

/** Helper for the "44 open roles" style labels. */
export function formatOpenRoles(count: number | undefined) {
  if (count === undefined) return '— open roles'
  return `${count} open role${count === 1 ? '' : 's'}`
}

const RECENT_KEY = 'bh-careers:recently-viewed'

/** Job ids the visitor opened recently (stored in localStorage, newest first). */
export function getRecentlyViewed(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]') as string[]
  } catch {
    return []
  }
}

export function rememberJob(id: string) {
  try {
    const next = [id, ...getRecentlyViewed().filter(x => x !== id)].slice(0, 6)
    localStorage.setItem(RECENT_KEY, JSON.stringify(next))
  } catch {
    // storage unavailable (private mode) — recently viewed is a nice-to-have
  }
}

/** Resolves recently viewed ids to jobs (skips ids that no longer exist). */
export function useRecentlyViewedJobs(limit = 3) {
  const ids = getRecentlyViewed().slice(0, limit)
  return useAsync<Job[]>(
    async () => (await Promise.all(ids.map(id => jobsProvider.getJob(id)))).filter((j): j is Job => !!j),
    [ids.join(',')],
  )
}

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
export function useJobSearch(params: JobSearchParams) {
  return useAsync<JobSearchResult>(() => jobsProvider.searchJobs(params), [
    params.keyword,
    params.country,
    params.team,
    params.workType,
    params.page,
    params.pageSize,
  ])
}

export function useJob(id: string | undefined) {
  return useAsync<Job | null>(() => (id ? jobsProvider.getJob(id) : Promise.resolve(null)), [id])
}

// Stats are shared by many components on a page, so fetch them once per session.
let statsPromise: Promise<JobStats> | null = null

/** Total / per-country / per-team open role counts. */
export function useJobStats() {
  return useAsync<JobStats>(() => (statsPromise ??= jobsProvider.getJobStats().catch(e => {
    statsPromise = null
    throw e
  })), [])
}

/** Helper for the "44 open roles" style labels. */
export function formatOpenRoles(count: number | undefined) {
  if (count === undefined) return '— open roles'
  return `${count} open role${count === 1 ? '' : 's'}`
}

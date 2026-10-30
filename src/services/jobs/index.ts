import { mockProvider } from './mockProvider'
import type { JobsProvider } from './types'
import { workdayProvider } from './workdayProvider'

export type * from './types'

/**
 * Single entry point for job data. Switch provider with the
 * `VITE_JOBS_PROVIDER` env var ("mock" | "workday"); defaults to mock.
 */
export const jobsProvider: JobsProvider =
  import.meta.env.VITE_JOBS_PROVIDER === 'workday' ? workdayProvider : mockProvider

/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "mock" (default) or "workday". */
  readonly VITE_JOBS_PROVIDER?: 'mock' | 'workday'
  /** Base URL of the jobs API / Workday proxy. */
  readonly VITE_JOBS_API_URL?: string
  /** Endpoint that accepts { email, search } to create a job alert. */
  readonly VITE_JOB_ALERTS_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

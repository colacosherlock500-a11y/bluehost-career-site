/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "browser" (default, real URLs) or "memory" (in-page navigation for embedded previews). */
  readonly VITE_ROUTER?: 'browser' | 'memory'
  /** "mock" (default) or "workday". */
  readonly VITE_JOBS_PROVIDER?: 'mock' | 'workday'
  /** Base URL of the jobs API / Workday proxy. */
  readonly VITE_JOBS_API_URL?: string
  /** Overrides the home page brand banner video URL. */
  readonly VITE_BRAND_VIDEO_URL?: string
  /** Life at Bluehost hero: the soft-blue gradient video (falls back to an animated CSS gradient). */
  readonly VITE_LIFE_HERO_VIDEO_URL?: string
  /** Endpoint that accepts { email, search } to create a job alert. */
  readonly VITE_JOB_ALERTS_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

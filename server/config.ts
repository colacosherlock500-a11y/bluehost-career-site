/**
 * Server configuration, read from environment variables (see .env.example).
 * Workday credentials live ONLY here, on the server — never in VITE_* vars,
 * which are bundled into the public JavaScript.
 */

export type WorkdaySource = 'rest' | 'raas' | 'cxs'

export interface RestConfig {
  /** e.g. https://wd5-services1.myworkday.com/ccx/api/recruiting/v4/acme */
  apiUrl: string
  /** e.g. https://wd5-services1.myworkday.com/ccx/oauth2/acme/token */
  tokenUrl: string
  clientId: string
  clientSecret: string
  refreshToken: string
  /** Optional Job Posting Site id, to only pull postings from the external career site. */
  jobSite?: string
}

export interface RaasConfig {
  /** Full report URL: https://{host}/ccx/service/customreport2/{tenant}/{owner}/{report} */
  reportUrl: string
  username: string
  password: string
}

export interface CxsConfig {
  /** e.g. https://acme.wd5.myworkdayjobs.com */
  origin: string
  tenant: string
  site: string
}

export interface Config {
  port: number
  /** null when Workday is not configured (the API then answers 503). */
  source: WorkdaySource | null
  syncIntervalMs: number
  /** Public Workday career site, e.g. https://acme.wd5.myworkdayjobs.com/en-US/External (apply links). */
  careerSiteUrl?: string
  /** Bearer token required by POST /api/jobs/refresh. Endpoint is disabled when unset. */
  refreshSecret?: string
  /** Built site to serve alongside the API (production). */
  staticDir: string
  rest?: RestConfig
  raas?: RaasConfig
  cxs?: CxsConfig
}

const env = (key: string) => process.env[key]?.trim() || undefined

function required(keys: string[], source: string): Record<string, string> {
  const missing = keys.filter(k => !env(k))
  if (missing.length) throw new Error(`WORKDAY_SOURCE=${source} needs: ${missing.join(', ')}`)
  return Object.fromEntries(keys.map(k => [k, env(k)!]))
}

const trimSlash = (url: string) => url.replace(/\/+$/, '')

/** https://acme.wd5.myworkdayjobs.com/en-US/External -> { origin, tenant: "acme", site: "External" } */
function parseCareerSite(url: string): CxsConfig {
  const u = new URL(url)
  const segments = u.pathname.split('/').filter(Boolean).filter(s => !/^[a-z]{2}-[A-Z]{2}$/.test(s))
  const site = env('WORKDAY_CXS_SITE') ?? segments.at(-1)
  const tenant = env('WORKDAY_CXS_TENANT') ?? u.hostname.split('.')[0]
  if (!site) throw new Error('WORKDAY_CAREER_SITE_URL must include the site name, e.g. https://acme.wd5.myworkdayjobs.com/External')
  return { origin: u.origin, tenant, site }
}

export function loadConfig(): Config {
  const source = (env('WORKDAY_SOURCE') ?? null) as WorkdaySource | null
  if (source && !['rest', 'raas', 'cxs'].includes(source)) throw new Error(`Unknown WORKDAY_SOURCE "${source}" (use rest, raas or cxs)`)

  const config: Config = {
    port: Number(env('PORT') ?? 8787),
    source,
    syncIntervalMs: Math.max(1, Number(env('WORKDAY_SYNC_INTERVAL_MINUTES') ?? 15)) * 60_000,
    careerSiteUrl: env('WORKDAY_CAREER_SITE_URL') && trimSlash(env('WORKDAY_CAREER_SITE_URL')!),
    refreshSecret: env('JOBS_REFRESH_SECRET'),
    staticDir: env('STATIC_DIR') ?? 'dist',
  }

  if (source === 'rest') {
    const v = required(['WORKDAY_HOST', 'WORKDAY_TENANT', 'WORKDAY_CLIENT_ID', 'WORKDAY_CLIENT_SECRET', 'WORKDAY_REFRESH_TOKEN'], source)
    const host = trimSlash(v.WORKDAY_HOST)
    config.rest = {
      apiUrl: trimSlash(env('WORKDAY_RECRUITING_API_URL') ?? `${host}/ccx/api/recruiting/v4/${v.WORKDAY_TENANT}`),
      tokenUrl: env('WORKDAY_TOKEN_URL') ?? `${host}/ccx/oauth2/${v.WORKDAY_TENANT}/token`,
      clientId: v.WORKDAY_CLIENT_ID,
      clientSecret: v.WORKDAY_CLIENT_SECRET,
      refreshToken: v.WORKDAY_REFRESH_TOKEN,
      jobSite: env('WORKDAY_JOB_POSTING_SITE'),
    }
  } else if (source === 'raas') {
    const v = required(['WORKDAY_RAAS_URL', 'WORKDAY_USERNAME', 'WORKDAY_PASSWORD'], source)
    config.raas = { reportUrl: v.WORKDAY_RAAS_URL, username: v.WORKDAY_USERNAME, password: v.WORKDAY_PASSWORD }
  } else if (source === 'cxs') {
    const v = required(['WORKDAY_CAREER_SITE_URL'], source)
    config.cxs = parseCareerSite(v.WORKDAY_CAREER_SITE_URL)
  }

  return config
}

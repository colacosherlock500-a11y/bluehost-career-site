import type { RestConfig } from '../config.ts'
import { HttpError, basicAuth, fetchJson } from './http.ts'
import { mergePostings, type RawPosting, type WorkdayAdapter } from './types.ts'

/**
 * Workday Recruiting REST API (OAuth 2.0).
 *
 *   POST {host}/ccx/oauth2/{tenant}/token            grant_type=refresh_token
 *   GET  {host}/ccx/api/recruiting/v4/{tenant}/jobPostings?limit=&offset=[&jobSite=]
 *   GET  {host}/ccx/api/recruiting/v4/{tenant}/jobPostings/{id}
 *
 * Workday REST resources reference other objects as { id, descriptor }, and
 * field names can vary slightly between API versions, so every field below is
 * read defensively. Verify against your tenant in the Workday REST API
 * Explorer and adjust `toRaw` if a field is named differently.
 */

type Ref = { id?: string; descriptor?: string; [k: string]: unknown } | string | null | undefined
type WdPosting = Record<string, unknown>

const desc = (r: unknown): string | undefined => {
  if (!r) return undefined
  if (typeof r === 'string') return r
  if (Array.isArray(r)) return desc(r[0])
  const o = r as { descriptor?: string; name?: string }
  return o.descriptor ?? o.name
}
const first = (p: WdPosting, ...keys: string[]) => keys.map(k => p[k]).find(v => v !== undefined && v !== null && v !== '')

export function restAdapter(cfg: RestConfig, careerSiteUrl?: string): WorkdayAdapter {
  let token: { value: string; expiresAt: number } | null = null

  async function accessToken(force = false) {
    if (!force && token && Date.now() < token.expiresAt) return token.value
    const res = await fetchJson<{ access_token: string; expires_in?: number }>(cfg.tokenUrl, {
      method: 'POST',
      headers: { Authorization: basicAuth(cfg.clientId, cfg.clientSecret), 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: cfg.refreshToken }),
    })
    // Refresh a minute before Workday expires it (tokens usually live 1 hour).
    token = { value: res.access_token, expiresAt: Date.now() + ((res.expires_in ?? 3600) - 60) * 1000 }
    return token.value
  }

  async function get<T>(path: string): Promise<T> {
    const call = async (force: boolean) => fetchJson<T>(`${cfg.apiUrl}${path}`, { headers: { Authorization: `Bearer ${await accessToken(force)}` } })
    try {
      return await call(false)
    } catch (e) {
      // Token revoked or expired early: get a new one and retry once.
      if (e instanceof HttpError && e.status === 401) return call(true)
      throw e
    }
  }

  function toRaw(p: WdPosting): RawPosting {
    const locs = [first(p, 'primaryLocation', 'location', 'primaryJobPostingLocation'), ...((first(p, 'additionalLocations', 'additionalJobPostingLocations') as Ref[]) ?? [])]
    const id = String(first(p, 'id', 'jobPostingId') ?? '')
    return {
      id,
      title: String(first(p, 'title', 'jobPostingTitle', 'descriptor') ?? ''),
      family: desc(first(p, 'jobFamilyGroup', 'jobFamily', 'jobCategory', 'category', 'jobProfile')),
      company: desc(first(p, 'company', 'hiringOrganization')),
      locations: locs
        .filter(Boolean)
        .map(l => ({ name: desc(l) ?? '', country: desc(typeof l === 'object' && l ? (l as Record<string, unknown>).country : undefined) }))
        .filter(l => l.name),
      remoteType: desc(first(p, 'remoteType', 'workplaceType')),
      timeType: desc(first(p, 'timeType')),
      jobType: desc(first(p, 'jobType', 'workerSubType', 'employeeType')),
      postedAt: first(p, 'startDate', 'postedOn', 'postingDate') as string | undefined,
      descriptionHtml: first(p, 'jobDescription', 'description', 'externalJobDescription') as string | undefined,
      applyUrl: (first(p, 'externalUrl', 'url', 'externalApplyUrl', 'jobPostingUrl') as string | undefined) ?? (careerSiteUrl && id ? `${careerSiteUrl}/details/${id}` : careerSiteUrl),
    }
  }

  return {
    name: 'Workday Recruiting REST API',

    async fetchAll() {
      const limit = 100
      const all: RawPosting[] = []
      for (let offset = 0; ; offset += limit) {
        const q = new URLSearchParams({ limit: String(limit), offset: String(offset) })
        if (cfg.jobSite) q.set('jobSite', cfg.jobSite)
        const page = await get<{ total?: number; data?: WdPosting[] }>(`/jobPostings?${q}`)
        const data = page.data ?? []
        all.push(...data.map(toRaw))
        if (data.length < limit || (page.total !== undefined && all.length >= page.total)) break
      }
      return all.filter(p => p.id && p.title)
    },

    async fetchDetail(posting) {
      const full = toRaw(await get<WdPosting>(`/jobPostings/${encodeURIComponent(posting.id)}`))
      return mergePostings(posting, full)
    },
  }
}

import type { CxsConfig } from '../config.ts'
import { fetchJson, mapLimit } from './http.ts'
import { mergePostings, type RawPosting, type WorkdayAdapter } from './types.ts'

/**
 * Public Workday career site feed (the JSON behind *.myworkdayjobs.com).
 * Needs no credentials and only exposes what is already public on the
 * external career site — useful to go live before API access is granted.
 *
 *   POST {origin}/wday/cxs/{tenant}/{site}/jobs      { appliedFacets, limit, offset, searchText }
 *   GET  {origin}/wday/cxs/{tenant}/{site}{externalPath}
 *
 * Quirks handled here: pages hold at most 20 postings, `total` is only
 * reliable on the first page, and the list has no job family — so postings
 * are tagged with their family by querying each job-family facet value.
 */

interface ListPosting {
  title: string
  externalPath: string
  locationsText?: string
  remoteType?: string
}
interface FacetValue {
  id?: string
  descriptor?: string
  count?: number
  facetParameter?: string
  values?: FacetValue[]
}
interface ListResponse {
  total?: number
  jobPostings?: ListPosting[]
  facets?: FacetValue[]
}
interface DetailResponse {
  jobPostingInfo?: {
    id?: string
    title?: string
    jobDescription?: string
    location?: string
    additionalLocations?: string[]
    country?: { descriptor?: string }
    remoteType?: string
    timeType?: string
    startDate?: string
    jobReqId?: string
    externalUrl?: string
  }
  hiringOrganization?: { name?: string }
}

const PAGE = 20

/** "/job/Mumbai/Software-Engineer_R-1234" -> "R-1234" (stable, URL-safe id). */
const idFromPath = (path: string) => {
  const last = path.split('/').filter(Boolean).at(-1) ?? path
  return last.includes('_') ? last.slice(last.lastIndexOf('_') + 1) : last
}

export function cxsAdapter(cfg: CxsConfig, careerSiteUrl?: string): WorkdayAdapter {
  const base = `${cfg.origin}/wday/cxs/${cfg.tenant}/${cfg.site}`
  const siteUrl = careerSiteUrl ?? `${cfg.origin}/${cfg.site}`

  const list = (offset: number, appliedFacets: Record<string, string[]> = {}) =>
    fetchJson<ListResponse>(`${base}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appliedFacets, limit: PAGE, offset, searchText: '' }),
    })

  async function listAll(appliedFacets?: Record<string, string[]>) {
    const first = await list(0, appliedFacets)
    const total = first.total ?? 0
    const postings = [...(first.jobPostings ?? [])]
    const seen = new Set(postings.map(p => p.externalPath))
    for (let offset = PAGE; offset < total; offset += PAGE) {
      const page = (await list(offset, appliedFacets)).jobPostings ?? []
      const fresh = page.filter(p => !seen.has(p.externalPath))
      if (!fresh.length) break // offset looped back to the start
      fresh.forEach(p => seen.add(p.externalPath))
      postings.push(...fresh)
    }
    return { postings, facets: first.facets ?? [] }
  }

  /** Map externalPath -> job family name, using the job-family facet. */
  async function familiesByPath(facets: FacetValue[]) {
    const flat = (fs: FacetValue[]): FacetValue[] => fs.flatMap(f => (f.facetParameter ? [f] : []).concat(flat(f.values?.filter(v => v.facetParameter) ?? [])))
    const familyFacet = flat(facets).find(f => /jobFamily|jobCategory/i.test(f.facetParameter ?? ''))
    const out = new Map<string, string>()
    if (!familyFacet) return out
    const values = (familyFacet.values ?? []).filter(v => v.id && v.descriptor && (v.count ?? 1) > 0)
    await mapLimit(values, 3, async v => {
      const { postings } = await listAll({ [familyFacet.facetParameter!]: [v.id!] })
      for (const p of postings) out.set(p.externalPath, v.descriptor!)
    })
    return out
  }

  async function detail(path: string): Promise<Partial<RawPosting>> {
    const d = await fetchJson<DetailResponse>(`${base}${path}`)
    const info = d.jobPostingInfo ?? {}
    const names = [info.location, ...(info.additionalLocations ?? [])].filter(Boolean) as string[]
    return {
      title: info.title,
      company: d.hiringOrganization?.name,
      locations: names.map((name, i) => ({ name, country: i === 0 ? info.country?.descriptor : undefined })),
      remoteType: info.remoteType,
      timeType: info.timeType,
      postedAt: info.startDate,
      descriptionHtml: info.jobDescription,
      applyUrl: info.externalUrl,
    }
  }

  return {
    name: 'Workday career site (public)',

    async fetchAll(previous) {
      const { postings, facets } = await listAll()
      const families = await familiesByPath(facets)
      return mapLimit(postings, 4, async p => {
        const id = idFromPath(p.externalPath)
        const fromList: RawPosting = {
          id,
          title: p.title,
          family: families.get(p.externalPath),
          locations: p.locationsText && !/^\d+ Locations?$/i.test(p.locationsText) ? [{ name: p.locationsText }] : [],
          remoteType: p.remoteType,
          applyUrl: `${siteUrl}${p.externalPath}`,
        }
        // Details (description, country, dates) only change rarely: reuse last sync's copy.
        const cached = previous.get(id)
        if (cached?.descriptionHtml) return mergePostings(cached, { title: fromList.title, family: fromList.family, remoteType: fromList.remoteType })
        try {
          return mergePostings(fromList, await detail(p.externalPath))
        } catch {
          return fromList
        }
      })
    },
  }
}

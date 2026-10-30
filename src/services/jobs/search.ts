import type { FacetCount, Job, JobSearchParams, JobSearchResult, JobStats } from './types.ts'

/**
 * Search, facet and stats logic shared by the browser mock provider and the
 * Workday API server (server/), so both return identical shapes.
 * Keep this file free of browser/Node-specific imports.
 */

function facet(jobs: Job[], key: (j: Job) => string[]): FacetCount[] {
  const map = new Map<string, number>()
  for (const j of jobs) for (const v of new Set(key(j))) map.set(v, (map.get(v) ?? 0) + 1)
  return [...map].map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count)
}

export function matchesJob(job: Job, p: JobSearchParams, teamName: (slug: string) => string = s => s.replace(/-/g, ' ')): boolean {
  if (p.team && job.team !== p.team) return false
  if (p.country && !job.locations.some(l => l.country === p.country)) return false
  if (p.workType && job.workType !== p.workType) return false
  // No geo data yet, so `location` is a city text match and `radiusMiles` is ignored.
  if (p.location && !job.locations.some(l => l.city.toLowerCase().includes(p.location!.toLowerCase()))) return false
  if (p.keyword) {
    const q = p.keyword.toLowerCase()
    const hay = `${job.title} ${teamName(job.team)} ${job.brand} ${job.locations.map(l => l.city).join(' ')}`.toLowerCase()
    if (!hay.includes(q)) return false
  }
  return true
}

export function searchJobs(all: Job[], params: JobSearchParams, teamName?: (slug: string) => string): JobSearchResult {
  const page = Math.max(1, params.page ?? 1)
  const pageSize = Math.min(50, Math.max(1, params.pageSize ?? 10))
  const match = (p: JobSearchParams) => all.filter(j => matchesJob(j, p, teamName))
  const filtered = match(params)
  return {
    jobs: filtered.slice((page - 1) * pageSize, page * pageSize),
    total: filtered.length,
    page,
    pageSize,
    facets: {
      countries: facet(match({ ...params, country: undefined }), j => j.locations.map(l => l.country)),
      teams: facet(match({ ...params, team: undefined }), j => [j.team]),
      workTypes: facet(match({ ...params, workType: undefined }), j => [j.workType]),
    },
  }
}

export function computeStats(all: Job[]): JobStats {
  const stats: JobStats = { total: all.length, byCountry: {}, byTeam: {} }
  for (const j of all) {
    stats.byTeam[j.team] = (stats.byTeam[j.team] ?? 0) + 1
    for (const c of new Set(j.locations.map(l => l.country))) stats.byCountry[c] = (stats.byCountry[c] ?? 0) + 1
  }
  return stats
}

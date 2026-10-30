import { countries } from '../../data/countries'
import { teams } from '../../data/teams'
import type { FacetCount, Job, JobSearchParams, JobSearchResult, JobStats, JobsProvider, WorkType } from './types'

/**
 * Deterministic sample data so the UI can be built and reviewed before the
 * Workday integration exists. Remove once `VITE_JOBS_PROVIDER=workday`.
 */

const titlesByTeam: Record<string, string[]> = {
  'customer-service': ['Customer Support Specialist', 'Technical Support Agent', 'Customer Advocacy Lead', 'Support Team Manager'],
  executive: ['Chief of Staff', 'Executive Business Partner', 'VP, Strategy'],
  facilities: ['Workplace Experience Coordinator', 'Facilities Manager'],
  finance: ['Financial Analyst', 'Senior Accountant', 'FP&A Manager', 'Payroll Specialist'],
  fulfillment: ['Website Builder Specialist', 'Domain Services Analyst', 'Fulfillment Operations Lead'],
  'human-resources': ['HR Business Partner', 'Talent Acquisition Partner', 'People Operations Specialist'],
  legal: ['Corporate Counsel', 'Privacy & Compliance Analyst', 'Paralegal'],
  marketing: ['Product Marketing Manager', 'Content Marketing Specialist', 'SEO Strategist', 'Lifecycle Marketing Manager'],
  product: ['Product Manager', 'Senior Product Designer', 'UX Researcher', 'Product Owner'],
  sales: ['Inside Sales Representative', 'Account Executive', 'Partnerships Manager', 'Sales Team Lead'],
  'technology-and-engineering': ['Senior Software Engineer', 'Site Reliability Engineer', 'Data Engineer', 'System Administrator', 'Machine Learning Engineer', 'QA Engineer'],
}

const citiesByCountry: Record<string, string[]> = {
  argentina: ['Buenos Aires'],
  brazil: ['Florianópolis'],
  canada: ['Toronto'],
  india: ['Mumbai', 'Bengaluru'],
  italy: ['Milan'],
  netherlands: ['Amsterdam'],
  philippines: ['Cebu'],
  spain: ['Madrid'],
  'united-kingdom': ['London'],
  'united-states': ['Jacksonville', 'Orem', 'Tempe'],
}

const brands: Job['brand'][] = ['Bluehost', 'HostGator', 'Yoast', 'YITH']
const workTypes: WorkType[] = ['Remote', 'Hybrid', 'On-site']

function buildJobs(): Job[] {
  const jobs: Job[] = []
  let n = 0
  for (const team of teams) {
    const titles = titlesByTeam[team.slug] ?? ['Specialist']
    countries.forEach((country, ci) => {
      // Spread roles unevenly so counts look realistic.
      const perCountry = (team.slug.length + ci * 3) % 4
      for (let i = 0; i < perCountry; i++) {
        n++
        const cities = citiesByCountry[country.slug] ?? [country.name]
        const title = titles[(i + ci) % titles.length]
        jobs.push({
          id: `BH-${String(1000 + n)}`,
          title,
          team: team.slug,
          brand: brands[(n + ci) % brands.length],
          locations: [{ city: cities[i % cities.length], country: country.slug }],
          workType: workTypes[(n + i) % workTypes.length],
          employmentType: 'Full-time',
          postedAt: new Date(Date.UTC(2026, 9, 28 - (n % 30))).toISOString(),
          summary: `Join our ${team.name} team and help millions of small businesses succeed online.`,
          description: {
            about: `As a ${title} at Bluehost, you'll work with people across the globe to build, host, and grow the businesses of our customers. You'll own meaningful work from day one, with the support of a team that celebrates what we achieve together.`,
            responsibilities: [
              'Partner with teammates across brands and time zones to deliver great customer outcomes',
              'Own projects end to end, from idea to launch and iteration',
              'Share knowledge, mentor others, and help shape how we work',
              'Use data and customer feedback to continuously improve',
            ],
            requirements: [
              'Relevant experience in a similar role',
              'Clear written and spoken communication in English',
              'A customer-first mindset and a bias for action',
            ],
            niceToHave: ['Experience with WordPress or web hosting', 'Comfort using AI tools in your daily work'],
          },
          applyUrl: '#apply',
        })
      }
    })
  }
  return jobs
}

const allJobs = buildJobs()

function facet(jobs: Job[], key: (j: Job) => string[]): FacetCount[] {
  const map = new Map<string, number>()
  for (const j of jobs) for (const v of new Set(key(j))) map.set(v, (map.get(v) ?? 0) + 1)
  return [...map].map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count)
}

function matches(job: Job, p: JobSearchParams): boolean {
  if (p.team && job.team !== p.team) return false
  if (p.country && !job.locations.some(l => l.country === p.country)) return false
  if (p.workType && job.workType !== p.workType) return false
  // The mock has no geo data, so `location` is a simple city match and `radiusMiles` is ignored.
  if (p.location && !job.locations.some(l => l.city.toLowerCase().includes(p.location!.toLowerCase()))) return false
  if (p.keyword) {
    const q = p.keyword.toLowerCase()
    const team = teams.find(t => t.slug === job.team)?.name ?? ''
    const hay = `${job.title} ${team} ${job.brand} ${job.locations.map(l => l.city).join(' ')}`.toLowerCase()
    if (!hay.includes(q)) return false
  }
  return true
}

const delay = <T,>(v: T) => new Promise<T>(r => setTimeout(() => r(v), 150))

export const mockProvider: JobsProvider = {
  async searchJobs(params) {
    const page = params.page ?? 1
    const pageSize = params.pageSize ?? 10
    const filtered = allJobs.filter(j => matches(j, params))
    const result: JobSearchResult = {
      jobs: filtered.slice((page - 1) * pageSize, page * pageSize),
      total: filtered.length,
      page,
      pageSize,
      facets: {
        countries: facet(allJobs.filter(j => matches(j, { ...params, country: undefined })), j => j.locations.map(l => l.country)),
        teams: facet(allJobs.filter(j => matches(j, { ...params, team: undefined })), j => [j.team]),
        workTypes: facet(allJobs.filter(j => matches(j, { ...params, workType: undefined })), j => [j.workType]),
      },
    }
    return delay(result)
  },

  async getJob(id) {
    return delay(allJobs.find(j => j.id === id) ?? null)
  },

  async getJobStats() {
    const stats: JobStats = { total: allJobs.length, byCountry: {}, byTeam: {} }
    for (const j of allJobs) {
      stats.byTeam[j.team] = (stats.byTeam[j.team] ?? 0) + 1
      for (const c of new Set(j.locations.map(l => l.country))) stats.byCountry[c] = (stats.byCountry[c] ?? 0) + 1
    }
    return delay(stats)
  },
}

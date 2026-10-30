import { countries } from '../../data/countries'
import { teams } from '../../data/teams'
import { computeStats, searchJobs } from './search'
import type { Job, JobsProvider, WorkType } from './types'

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

const teamName = (slug: string) => teams.find(t => t.slug === slug)?.name ?? ''

const delay = <T,>(v: T) => new Promise<T>(r => setTimeout(() => r(v), 150))

export const mockProvider: JobsProvider = {
  async searchJobs(params) {
    return delay(searchJobs(allJobs, params, teamName))
  },

  async getJob(id) {
    return delay(allJobs.find(j => j.id === id) ?? null)
  },

  async getJobStats() {
    return delay(computeStats(allJobs))
  },
}

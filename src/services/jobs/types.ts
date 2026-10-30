/**
 * Job data contracts used by every page of the career site.
 *
 * The UI only ever talks to these types. To plug in Workday, implement
 * `JobsProvider` (see ./workdayProvider.ts) and map the Workday payload
 * onto these shapes — no component needs to change.
 */

export type WorkType = 'Remote' | 'Hybrid' | 'On-site'

export interface JobLocation {
  city: string
  /** Matches `Country.slug` in src/data/countries.ts, e.g. "united-states". */
  country: string
}

export interface Job {
  id: string
  title: string
  /** Matches `Team.slug` in src/data/teams.ts, e.g. "customer-service". */
  team: string
  brand: 'Bluehost' | 'HostGator' | 'Yoast' | 'YITH'
  locations: JobLocation[]
  workType: WorkType
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship'
  /** ISO date string. */
  postedAt: string
  /** Short teaser shown on result cards. */
  summary: string
  /** Rich description sections shown on the role page. */
  description?: {
    about?: string
    responsibilities?: string[]
    requirements?: string[]
    niceToHave?: string[]
  }
  /** Where the "Apply now" button sends the candidate (Workday apply URL). */
  applyUrl: string
}

export interface JobSearchParams {
  keyword?: string
  /** Country slug. */
  country?: string
  /** Team slug. */
  team?: string
  workType?: WorkType
  /** Free-text city / ZIP from the "Location" field. */
  location?: string
  /** Search radius around `location`, in miles (Workday supports distance search). */
  radiusMiles?: number
  page?: number
  pageSize?: number
}

export interface FacetCount {
  value: string
  count: number
}

export interface JobSearchResult {
  jobs: Job[]
  total: number
  page: number
  pageSize: number
  /** Counts for the filter dropdowns, computed against the current search. */
  facets: {
    countries: FacetCount[]
    teams: FacetCount[]
    workTypes: FacetCount[]
  }
}

/** Aggregate numbers shown across the site (hero, team cards, country cards…). */
export interface JobStats {
  total: number
  byCountry: Record<string, number>
  byTeam: Record<string, number>
}

export interface JobsProvider {
  searchJobs(params: JobSearchParams): Promise<JobSearchResult>
  getJob(id: string): Promise<Job | null>
  getJobStats(): Promise<JobStats>
}

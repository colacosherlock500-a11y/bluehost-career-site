/**
 * How Workday values map onto the career site's teams, countries and brands.
 *
 * EDIT THIS FILE once you see real tenant data (GET /api/health lists any
 * job families / locations that could not be mapped). Exact matches in the
 * `*Overrides` tables win over the keyword rules.
 *
 * Slugs must match src/data/teams.ts and src/data/countries.ts.
 */

/** Exact Workday Job Family (Group) name -> team slug. */
export const familyOverrides: Record<string, string> = {
  // 'Technology - Engineering': 'technology-and-engineering',
  // 'Customer Care': 'customer-service',
}

/** Keyword rules, checked in order against the job family, then the job title. */
export const teamRules: [slug: string, pattern: RegExp][] = [
  ['legal', /\b(legal|counsel|compliance|privacy|paralegal|attorney)\b/i],
  ['finance', /\b(financ\w*|accounting|accountant|payroll|fp&a|tax|treasury|procurement|controller)\b/i],
  ['human-resources', /\b(human resources|hr|people|talent|recruit\w*)\b/i],
  ['facilities', /\b(facilit\w*|workplace|real estate|office manager)\b/i],
  ['fulfillment', /\b(fulfil+ment|website build\w*|web build\w*|domain\w*)\b/i],
  ['marketing', /\b(marketing|seo|content|brand|communications|social media|copywrit\w*)\b/i],
  ['sales', /\b(sales|account executive|partnerships?|business development)\b/i],
  ['customer-service', /\b(customer|support|care|advocacy|success|service desk)\b/i],
  ['technology-and-engineering', /\b(engineer\w*|developer|software|technology|it|devops|sre|data|security|qa|architect|system admin\w*|machine learning)\b/i],
  ['product', /\b(product|ux|ui|design\w*|research\w*)\b/i],
  ['executive', /\b(executive|chief|vp|vice president|president)\b/i],
]

/** Team used when nothing matches. */
export const fallbackTeam = 'customer-service'

/** Exact Workday location name -> country slug (for locations without a country). */
export const locationOverrides: Record<string, string> = {
  // 'HQ - Building 2': 'united-states',
}

/** Country names / ISO codes as Workday may write them -> country slug. */
export const countryAliases: Record<string, string[]> = {
  'united-states': ['United States of America', 'United States', 'USA', 'US', 'U.S.'],
  argentina: ['Argentina', 'ARG', 'AR'],
  brazil: ['Brazil', 'Brasil', 'BRA', 'BR'],
  canada: ['Canada', 'CAN', 'CA'],
  india: ['India', 'IND', 'IN'],
  netherlands: ['Netherlands', 'The Netherlands', 'Holland', 'NLD', 'NL'],
  philippines: ['Philippines', 'PHL', 'PH'],
  'united-kingdom': ['United Kingdom', 'Great Britain', 'England', 'Scotland', 'UK', 'GBR', 'GB'],
  italy: ['Italy', 'Italia', 'ITA', 'IT'],
  spain: ['Spain', 'España', 'ESP', 'ES'],
}

/** Office cities, used when a location names a city but no country. */
export const cityCountry: Record<string, string> = {
  jacksonville: 'united-states', orem: 'united-states', tempe: 'united-states', burlington: 'united-states', houston: 'united-states', austin: 'united-states',
  'buenos aires': 'argentina',
  'florianópolis': 'brazil', florianopolis: 'brazil', 'são paulo': 'brazil', 'sao paulo': 'brazil',
  toronto: 'canada', vancouver: 'canada',
  mumbai: 'india', bengaluru: 'india', bangalore: 'india', hyderabad: 'india', mangalore: 'india', mangaluru: 'india', pune: 'india',
  amsterdam: 'netherlands',
  cebu: 'philippines', manila: 'philippines', makati: 'philippines', taguig: 'philippines',
  london: 'united-kingdom',
  milan: 'italy', rome: 'italy',
  madrid: 'spain', barcelona: 'spain',
}

/** Company / hiring organization -> brand. Defaults to Bluehost. */
export const brandRules: [brand: 'HostGator' | 'Yoast' | 'YITH', pattern: RegExp][] = [
  ['HostGator', /hostgator/i],
  ['Yoast', /yoast/i],
  ['YITH', /\byith\b/i],
]

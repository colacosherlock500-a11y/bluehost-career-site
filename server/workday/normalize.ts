import type { Job, JobLocation } from '../../src/services/jobs/types.ts'
import { brandRules, cityCountry, countryAliases, fallbackTeam, familyOverrides, locationOverrides, teamRules } from './mapping.ts'
import { htmlToText, sanitizeHtml } from './sanitize.ts'
import type { RawPosting } from './types.ts'

/** Values that fell through to a fallback, reported on /api/health so mapping.ts can be tuned. */
export interface Unmapped {
  families: Set<string>
  locations: Set<string>
}

const slugify = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const byExactAlias = new Map(Object.entries(countryAliases).flatMap(([slug, aliases]) => aliases.map(a => [a.toLowerCase(), slug] as const)))
// Full names are matched anywhere in a location string; short codes only as whole tokens (see below).
const nameRules = Object.entries(countryAliases).flatMap(([slug, aliases]) =>
  aliases.filter(a => a.length > 3).map(a => [slug, new RegExp(`(^|[^\\p{L}])${escapeRe(a)}($|[^\\p{L}])`, 'iu')] as const),
)
const isCode = (t: string) => /^[A-Z]{2,3}$/.test(t)
const US_STATES = new Set('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC'.split(' '))
const CA_PROVINCES = new Set('AB BC MB NB NL NS NT NU ON PE QC SK YT'.split(' '))

function countryFromField(country: string | undefined) {
  if (!country) return undefined
  return byExactAlias.get(country.trim().toLowerCase()) ?? nameRules.find(([, re]) => re.test(country))?.[0]
}

/** Split "IND - Mumbai", "Mumbai, India", "US-FL-Jacksonville", "Remote | Brazil" into tokens. */
function tokens(name: string) {
  return name
    .split(/\s*[,|/]\s*|\s+[-–—]\s+/)
    .flatMap(t => (/^[A-Z]{2,3}-/.test(t) ? t.split('-') : [t]))
    .map(t => t.trim())
    .filter(Boolean)
}

function parseLocation(loc: { name: string; country?: string }, unmapped: Unmapped): JobLocation {
  const parts = tokens(loc.name)
  let country: string | undefined = locationOverrides[loc.name] ?? countryFromField(loc.country) ?? nameRules.find(([, re]) => re.test(loc.name))?.[0]
  // A leading 2–3 letter code ("US-FL-…", "IND - …") or any 3-letter code ("…, USA") names the country.
  // Two-letter codes elsewhere are ignored: "Los Angeles, CA" is California, not Canada.
  country ??= parts.map((t, i) => (isCode(t) && (i === 0 || t.length === 3) ? byExactAlias.get(t.toLowerCase()) : undefined)).find(Boolean)
  country ??= parts.map(t => cityCountry[t.toLowerCase()]).find(Boolean)
  // "City, ST" with a trailing US state / Canadian province code.
  const region = parts.length > 1 ? parts.at(-1)! : ''
  country ??= US_STATES.has(region) ? 'united-states' : CA_PROVINCES.has(region) ? 'canada' : undefined

  // City = first token that is not a country, a state/country code or a work-mode word.
  const isNoise = (t: string) => /^(remote|hybrid|virtual|home based|office)$/i.test(t) || byExactAlias.has(t.toLowerCase()) || isCode(t)
  const city = parts.find(t => !isNoise(t)) ?? (/remote/i.test(loc.name) ? 'Remote' : loc.name)

  if (!country) {
    unmapped.locations.add(loc.country ? `${loc.name} (${loc.country})` : loc.name)
    country = loc.country ? slugify(loc.country) : parts.length > 1 ? slugify(parts.at(-1)!) : 'other'
  }
  return { city, country }
}

function teamFor(raw: RawPosting, unmapped: Unmapped) {
  if (raw.family && familyOverrides[raw.family]) return familyOverrides[raw.family]
  for (const text of [raw.family, raw.title]) {
    const hit = text && teamRules.find(([, re]) => re.test(text))
    if (hit) return hit[0]
  }
  unmapped.families.add(raw.family ? `${raw.family} — "${raw.title}"` : `(no family) "${raw.title}"`)
  return fallbackTeam
}

function workType(raw: RawPosting): Job['workType'] {
  const t = `${raw.remoteType ?? ''} ${raw.locations.map(l => l.name).join(' ')}`
  if (/hybrid|flex/i.test(raw.remoteType ?? '')) return 'Hybrid'
  if (/remote|virtual|home/i.test(t)) return 'Remote'
  if (/hybrid/i.test(t)) return 'Hybrid'
  return 'On-site'
}

function employmentType(raw: RawPosting): Job['employmentType'] {
  const t = `${raw.timeType ?? ''} ${raw.jobType ?? ''} ${raw.title}`
  if (/intern/i.test(t)) return 'Internship'
  if (/contract|contingent|temporary|fixed term/i.test(t)) return 'Contract'
  if (/part/i.test(raw.timeType ?? '')) return 'Part-time'
  return 'Full-time'
}

function summarize(text: string) {
  if (!text) return ''
  if (text.length <= 180) return text
  const cut = text.slice(0, 180)
  const sentence = cut.lastIndexOf('. ')
  return sentence > 80 ? cut.slice(0, sentence + 1) : `${cut.slice(0, cut.lastIndexOf(' '))}…`
}

/** Map one Workday posting onto the site's `Job` contract. */
export function toJob(raw: RawPosting, unmapped: Unmapped, careerSiteUrl?: string): Job {
  const html = raw.descriptionHtml ? sanitizeHtml(raw.descriptionHtml) : undefined
  const posted = raw.postedAt ? new Date(raw.postedAt) : null
  const company = `${raw.company ?? ''} ${raw.title}`
  const locations = raw.locations.map(l => parseLocation(l, unmapped))
  return {
    id: raw.id,
    title: raw.title.trim(),
    team: teamFor(raw, unmapped),
    brand: brandRules.find(([, re]) => re.test(company))?.[0] ?? 'Bluehost',
    locations: locations.length ? locations : [{ city: 'Remote', country: 'other' }],
    workType: workType(raw),
    employmentType: employmentType(raw),
    postedAt: posted && !Number.isNaN(posted.getTime()) ? posted.toISOString() : new Date().toISOString(),
    summary: summarize(html ? htmlToText(html) : ''),
    descriptionHtml: html,
    applyUrl: raw.applyUrl ?? careerSiteUrl ?? '#',
  }
}

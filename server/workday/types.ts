/**
 * Source-neutral job posting, as read from Workday before it is mapped onto
 * the site's `Job` type (see normalize.ts). Every adapter produces these.
 */
export interface RawPosting {
  id: string
  title: string
  /** Job Family / Job Family Group / Job Category — drives the team mapping. */
  family?: string
  /** Company or hiring organization — drives the brand mapping. */
  company?: string
  locations: { name: string; country?: string }[]
  remoteType?: string
  timeType?: string
  jobType?: string
  /** Posting start date (any format Date can parse). */
  postedAt?: string
  descriptionHtml?: string
  applyUrl?: string
}

export interface WorkdayAdapter {
  readonly name: string
  /** Pull every open posting. `previous` holds the last sync, to skip unchanged detail calls. */
  fetchAll(previous: Map<string, RawPosting>): Promise<RawPosting[]>
  /** Optional: fetch fields the list call does not return (e.g. the description). */
  fetchDetail?(posting: RawPosting): Promise<RawPosting>
}

/** Overlay `extra` onto `base`, ignoring empty values so a sparse detail call never erases list data. */
export function mergePostings(base: RawPosting, extra: Partial<RawPosting>): RawPosting {
  const merged: Record<string, unknown> = { ...base }
  for (const [k, v] of Object.entries(extra)) {
    if (v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0)) merged[k] = v
  }
  return merged as unknown as RawPosting
}

import type { Job } from '../src/services/jobs/types.ts'
import { toJob, type Unmapped } from './workday/normalize.ts'
import type { RawPosting, WorkdayAdapter } from './workday/types.ts'

/**
 * In-memory copy of the open postings, re-pulled from Workday on an interval.
 * The site reads from here, so visitors never wait on (or overload) Workday,
 * and a failed sync keeps serving the last good data.
 */
export class JobStore {
  jobs: Job[] = []
  private byId = new Map<string, Job>()
  private raw = new Map<string, RawPosting>()
  private details = new Map<string, Promise<Job>>()
  private syncing: Promise<void> | null = null
  private timer: NodeJS.Timeout | undefined
  private readonly adapter: WorkdayAdapter
  private readonly careerSiteUrl?: string

  status = {
    source: '',
    ready: false,
    syncing: false,
    lastSyncAt: null as string | null,
    lastSyncMs: 0,
    lastError: null as string | null,
    nextSyncAt: null as string | null,
    jobCount: 0,
    unmapped: { families: [] as string[], locations: [] as string[] },
  }

  constructor(adapter: WorkdayAdapter, careerSiteUrl?: string) {
    this.adapter = adapter
    this.careerSiteUrl = careerSiteUrl
    this.status.source = adapter.name
  }

  /** Pull everything from Workday now. Concurrent calls share one sync. */
  sync(): Promise<void> {
    this.syncing ??= this.runSync().finally(() => {
      this.syncing = null
      this.status.syncing = false
    })
    return this.syncing
  }

  private async runSync() {
    this.status.syncing = true
    const started = Date.now()
    try {
      const raws = await this.adapter.fetchAll(this.raw)
      const unmapped: Unmapped = { families: new Set(), locations: new Set() }
      const jobs = raws.map(r => toJob(r, unmapped, this.careerSiteUrl)).sort((a, b) => b.postedAt.localeCompare(a.postedAt))
      this.raw = new Map(raws.map(r => [r.id, r]))
      this.jobs = jobs
      this.byId = new Map(jobs.map(j => [j.id, j]))
      this.details.clear()
      Object.assign(this.status, {
        ready: true,
        lastSyncAt: new Date().toISOString(),
        lastError: null,
        jobCount: jobs.length,
        unmapped: { families: [...unmapped.families].sort(), locations: [...unmapped.locations].sort() },
      })
      console.log(`[jobs] synced ${jobs.length} postings from ${this.adapter.name} in ${Date.now() - started} ms`)
    } catch (e) {
      this.status.lastError = (e as Error).message
      console.error(`[jobs] sync failed (keeping ${this.jobs.length} cached postings): ${(e as Error).message}`)
    } finally {
      this.status.lastSyncMs = Date.now() - started
    }
  }

  start(intervalMs: number) {
    const schedule = () => {
      this.status.nextSyncAt = new Date(Date.now() + intervalMs).toISOString()
    }
    void this.sync()
    schedule()
    this.timer = setInterval(() => {
      schedule()
      void this.sync()
    }, intervalMs)
    this.timer.unref()
  }

  /** One job; fetches the full description on first view when the list call lacks it. */
  async getJob(id: string): Promise<Job | null> {
    const job = this.byId.get(id)
    if (!job) return null
    const raw = this.raw.get(id)
    if (job.descriptionHtml || !raw || !this.adapter.fetchDetail) return job
    let pending = this.details.get(id)
    if (!pending) {
      pending = this.adapter.fetchDetail(raw).then(full => {
        const unmapped: Unmapped = { families: new Set(), locations: new Set() }
        const detailed = toJob(full, unmapped, this.careerSiteUrl)
        this.raw.set(id, full)
        this.byId.set(id, detailed)
        this.jobs = this.jobs.map(j => (j.id === id ? detailed : j))
        return detailed
      })
      this.details.set(id, pending)
      pending.catch(() => this.details.delete(id))
    }
    return pending.catch(() => job)
  }
}

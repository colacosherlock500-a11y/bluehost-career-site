import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer, type ServerResponse } from 'node:http'
import { extname, join, normalize, resolve } from 'node:path'
import { computeStats, searchJobs } from '../src/services/jobs/search.ts'
import type { JobSearchParams, WorkType } from '../src/services/jobs/types.ts'
import { loadConfig, type Config } from './config.ts'
import { JobStore } from './store.ts'
import { cxsAdapter } from './workday/cxs.ts'
import { raasAdapter } from './workday/raas.ts'
import { restAdapter } from './workday/rest.ts'
import type { WorkdayAdapter } from './workday/types.ts'

/**
 * Careers API + static site server.
 *
 *   GET  /api/health          sync status, last error, unmapped Workday values
 *   GET  /api/jobs            search (keyword, country, team, workType, location, page, pageSize)
 *   GET  /api/jobs/stats      totals by country and team
 *   GET  /api/jobs/:id        one job (with full description)
 *   POST /api/jobs/refresh    re-pull from Workday now (Authorization: Bearer $JOBS_REFRESH_SECRET)
 *   *                         the built site from ./dist (production)
 */

const config = loadConfig()

function createAdapter(c: Config): WorkdayAdapter | null {
  if (c.source === 'rest') return restAdapter(c.rest!, c.careerSiteUrl)
  if (c.source === 'raas') return raasAdapter(c.raas!, c.careerSiteUrl)
  if (c.source === 'cxs') return cxsAdapter(c.cxs!, c.careerSiteUrl)
  return null
}

const adapter = createAdapter(config)
const store = adapter ? new JobStore(adapter, config.careerSiteUrl) : null
store?.start(config.syncIntervalMs)
if (!store) console.warn('[jobs] WORKDAY_SOURCE is not set — /api/jobs will answer 503. See .env.example.')

function send(res: ServerResponse, status: number, body: unknown, cacheSeconds = 0) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': cacheSeconds ? `public, max-age=${cacheSeconds}` : 'no-store',
  })
  res.end(JSON.stringify(body))
}

const WORK_TYPES: WorkType[] = ['Remote', 'Hybrid', 'On-site']

function parseSearch(q: URLSearchParams): JobSearchParams {
  const str = (k: string) => q.get(k)?.trim() || undefined
  const num = (k: string) => (q.has(k) && Number.isFinite(Number(q.get(k))) ? Number(q.get(k)) : undefined)
  const workType = str('workType') as WorkType | undefined
  return {
    keyword: str('keyword'),
    country: str('country'),
    team: str('team'),
    workType: workType && WORK_TYPES.includes(workType) ? workType : undefined,
    location: str('location'),
    radiusMiles: num('radiusMiles'),
    page: num('page'),
    pageSize: num('pageSize'),
  }
}

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.json': 'application/json', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.mp4': 'video/mp4',
}
const staticRoot = resolve(config.staticDir)

function serveStatic(pathname: string, res: ServerResponse) {
  const file = normalize(join(staticRoot, decodeURIComponent(pathname)))
  const target = file.startsWith(staticRoot) && existsSync(file) && statSync(file).isFile() ? file : join(staticRoot, 'index.html') // SPA fallback
  if (!existsSync(target)) return send(res, 404, { error: 'Not found. Run `npm run build` to serve the site from this server.' })
  res.writeHead(200, {
    'Content-Type': MIME[extname(target)] ?? 'application/octet-stream',
    'Cache-Control': target.includes(`${join(staticRoot, 'assets')}`) ? 'public, max-age=31536000, immutable' : 'no-cache',
  })
  createReadStream(target).pipe(res)
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost')
  const path = url.pathname.replace(/\/+$/, '') || '/'

  try {
    if (!path.startsWith('/api/')) return serveStatic(url.pathname, res)

    if (path === '/api/health') return send(res, store?.status.ready ? 200 : 503, store?.status ?? { ready: false, error: 'WORKDAY_SOURCE not configured' })

    if (!store) return send(res, 503, { error: 'Workday integration is not configured on the server.' })

    if (path === '/api/jobs/refresh' && req.method === 'POST') {
      if (!config.refreshSecret || req.headers.authorization !== `Bearer ${config.refreshSecret}`) return send(res, 401, { error: 'Unauthorized' })
      await store.sync()
      return send(res, 200, store.status)
    }

    if (req.method !== 'GET') return send(res, 405, { error: 'Method not allowed' })

    if (!store.status.ready) {
      // First sync still running (or failed): wait for it rather than answering empty.
      await store.sync()
      if (!store.status.ready) return send(res, 503, { error: 'Jobs are temporarily unavailable.' })
    }

    if (path === '/api/jobs') return send(res, 200, searchJobs(store.jobs, parseSearch(url.searchParams)), 60)
    if (path === '/api/jobs/stats') return send(res, 200, computeStats(store.jobs), 60)

    const id = /^\/api\/jobs\/([^/]+)$/.exec(path)?.[1]
    if (id) {
      const job = await store.getJob(decodeURIComponent(id))
      return job ? send(res, 200, job, 300) : send(res, 404, { error: 'Job not found' })
    }

    send(res, 404, { error: 'Not found' })
  } catch (e) {
    console.error('[api]', e)
    send(res, 500, { error: 'Internal error' })
  }
})

server.listen(config.port, () => console.log(`[api] listening on http://localhost:${config.port} (source: ${adapter?.name ?? 'not configured'})`))

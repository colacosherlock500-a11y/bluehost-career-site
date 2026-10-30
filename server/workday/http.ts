/** fetch() with a timeout and retries on rate limits / transient Workday errors. */

export class HttpError extends Error {
  readonly status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

export async function fetchJson<T>(url: string, init: RequestInit = {}, attempts = 3): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    let res: Response
    try {
      res = await fetch(url, { ...init, headers: { Accept: 'application/json', ...init.headers }, signal: AbortSignal.timeout(30_000) })
    } catch (e) {
      if (attempt >= attempts) throw new Error(`Request to ${new URL(url).host} failed: ${(e as Error).message}`)
      await sleep(1000 * 2 ** attempt)
      continue
    }
    if (res.ok) return (await res.json()) as T
    const retryable = res.status === 429 || res.status >= 500
    if (!retryable || attempt >= attempts) {
      const body = (await res.text().catch(() => '')).slice(0, 300)
      throw new HttpError(res.status, `Workday responded ${res.status} for ${new URL(url).pathname}${body ? `: ${body}` : ''}`)
    }
    const retryAfter = Number(res.headers.get('retry-after'))
    await sleep(retryAfter > 0 ? retryAfter * 1000 : 1000 * 2 ** attempt)
  }
}

/** Run `fn` over `items` with at most `limit` in flight (be gentle with the tenant). */
export async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length)
  let next = 0
  const worker = async () => {
    while (next < items.length) {
      const i = next++
      out[i] = await fn(items[i])
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return out
}

export const basicAuth = (user: string, pass: string) => `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`

import type { JobSearchParams } from './jobs'

/**
 * Job alert sign-up ("Get job alerts for this search by email").
 * INTEGRATION: point this at Workday's job-alert flow or your marketing/ATS email
 * service. Until then it resolves after a short delay so the UI can be reviewed.
 */
export async function createJobAlert(email: string, search: JobSearchParams): Promise<void> {
  const endpoint = import.meta.env.VITE_JOB_ALERTS_URL
  if (endpoint) {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, search }),
    })
    if (!res.ok) throw new Error(`Job alert sign-up failed (${res.status})`)
    return
  }
  await new Promise(r => setTimeout(r, 400))
}

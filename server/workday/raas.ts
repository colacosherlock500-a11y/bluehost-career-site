import type { RaasConfig } from '../config.ts'
import { basicAuth, fetchJson } from './http.ts'
import type { RawPosting, WorkdayAdapter } from './types.ts'

/**
 * Workday Report-as-a-Service (custom report exposed as a web service),
 * authenticated with an Integration System User (ISU) username + password.
 *
 *   GET {host}/ccx/service/customreport2/{tenant}/{owner}/{report}?format=json
 *   -> { "Report_Entry": [ { ...one row per open job posting... } ] }
 *
 * Ask the Workday developer to build the report with these column aliases
 * (case-insensitive; anything missing is simply left empty):
 *
 *   Job_Posting_ID          Job_Posting_Title      Job_Family_Group
 *   Company                 Primary_Location       Additional_Locations
 *   Country                 Remote_Type            Time_Type
 *   Job_Type                Job_Posting_Start_Date Job_Description
 *   External_Apply_URL
 */

type Row = Record<string, unknown>

function field(row: Row, ...names: string[]): string | undefined {
  for (const name of names) {
    const key = Object.keys(row).find(k => k.toLowerCase() === name.toLowerCase())
    const v = key ? row[key] : undefined
    if (v === undefined || v === null || v === '') continue
    if (Array.isArray(v)) return v.map(x => (typeof x === 'object' && x ? Object.values(x)[0] : x)).join('; ')
    if (typeof v === 'object') return String((v as { Descriptor?: string; descriptor?: string }).Descriptor ?? (v as { descriptor?: string }).descriptor ?? '')
    return String(v)
  }
  return undefined
}

export function raasAdapter(cfg: RaasConfig, careerSiteUrl?: string): WorkdayAdapter {
  const url = new URL(cfg.reportUrl)
  if (!url.searchParams.has('format')) url.searchParams.set('format', 'json')

  return {
    name: 'Workday custom report (RaaS)',

    async fetchAll() {
      const res = await fetchJson<{ Report_Entry?: Row[] }>(url.toString(), { headers: { Authorization: basicAuth(cfg.username, cfg.password) } })
      return (res.Report_Entry ?? [])
        .map((row): RawPosting => {
          const id = field(row, 'Job_Posting_ID', 'Job_Requisition_ID', 'ID') ?? ''
          const country = field(row, 'Country')
          const names = [field(row, 'Primary_Location', 'Location'), ...(field(row, 'Additional_Locations')?.split(/;\s*/) ?? [])].filter(Boolean) as string[]
          return {
            id,
            title: field(row, 'Job_Posting_Title', 'Title') ?? '',
            family: field(row, 'Job_Family_Group', 'Job_Family', 'Job_Category'),
            company: field(row, 'Company', 'Brand'),
            locations: names.map((name, i) => ({ name, country: i === 0 ? country : undefined })),
            remoteType: field(row, 'Remote_Type'),
            timeType: field(row, 'Time_Type'),
            jobType: field(row, 'Job_Type', 'Worker_Sub_Type'),
            postedAt: field(row, 'Job_Posting_Start_Date', 'Posted_Date'),
            descriptionHtml: field(row, 'Job_Description'),
            applyUrl: field(row, 'External_Apply_URL', 'External_URL') ?? careerSiteUrl,
          }
        })
        .filter(p => p.id && p.title)
    },
  }
}

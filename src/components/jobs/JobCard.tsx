import { Link } from 'react-router-dom'
import arrowBlue from '../../assets/img/common/arrow-blue-link.svg'
import pin from '../../assets/img/common/location-pin.svg'
import { getCountry } from '../../data/countries'
import { getTeam } from '../../data/teams'
import type { Job } from '../../services/jobs'
import { useT } from '../../i18n/I18n'

export function jobLocationLabel(job: Job) {
  const first = job.locations[0]
  if (!first) return job.workType
  const country = getCountry(first.country)?.name ?? first.country
  const extra = job.locations.length > 1 ? ` +${job.locations.length - 1}` : ''
  return `${first.city}, ${country}${extra}`
}

/** Compact role card ("Open roles" / "Related" sections). */
export function JobCard({ job }: { job: Job }) {
  const t = useT()
  return (
    <Link
      to={`/jobs/${job.id}`}
      className="group relative flex min-w-0 flex-col gap-[10px] rounded-3xl border border-bh-300 bg-white px-[18px] pb-[18px] pt-4 shadow-[0px_-8px_80px_0px_rgba(171,157,251,0.1),0px_8px_80px_0px_rgba(106,246,251,0.1)] transition-shadow hover:shadow-[0_12px_40px_rgba(25,108,223,0.18)]"
    >
      <p className="text-[14px] font-semibold uppercase text-[#939fb0]">
        {job.brand} · {t(getTeam(job.team)?.name ?? job.team)}
      </p>
      <h3 className="pb-3 text-[25px] font-semibold leading-[1.33] tracking-[-0.25px] text-black group-hover:text-bh-blue">{job.title}</h3>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <span className="flex min-w-0 items-center gap-2 text-[15px] leading-[1.3] tracking-[-0.15px] text-[#4e5c6e]">
          <img src={pin} alt="" className="size-[17px]" />
          {jobLocationLabel(job)}
        </span>
        <span className="flex shrink-0 items-center gap-1 text-base font-medium text-bh-blue">
          {t('Apply')}
          <img src={arrowBlue} alt="" className="size-[19.76px] transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}

export function JobCardSkeleton() {
  return <div className="h-[150px] animate-pulse rounded-3xl border border-bh-light-200 bg-bh-light-0" />
}

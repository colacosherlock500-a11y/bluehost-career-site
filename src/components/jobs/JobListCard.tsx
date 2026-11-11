import { Link } from 'react-router-dom'
import arrowBlue from '../../assets/img/common/arrow-blue-link.svg'
import pin from '../../assets/img/common/location-pin.svg'
import { getTeam } from '../../data/teams'
import type { Job } from '../../services/jobs'
import { jobLocationLabel } from './JobCard'
import { useT } from '../../i18n/I18n'

/** Wide result card used in the job search list. */
export function JobListCard({ job }: { job: Job }) {
  const t = useT()
  return (
    <Link
      to={`/jobs/${job.id}`}
      className="group flex flex-col gap-[10px] rounded-3xl border border-bh-300 bg-white px-[19px] py-[17px] shadow-[0px_-8px_80px_0px_rgba(171,157,251,0.1),0px_8px_80px_0px_rgba(106,246,251,0.1)] transition-shadow hover:shadow-[0_12px_40px_rgba(25,108,223,0.18)]"
    >
      <p className="text-[14px] font-semibold uppercase text-[#939fb0]">
        {job.brand} · {t(getTeam(job.team)?.name ?? job.team)} · {t(job.workType)}
      </p>
      <h3 className="text-[25px] font-semibold leading-[1.33] tracking-[-0.25px] group-hover:text-bh-blue">{job.title}</h3>
      <p className="text-[15px] leading-[1.4] tracking-[-0.15px] text-bh-blue-1100">{job.summary}</p>
      <div className="flex items-center justify-between gap-3 pt-1">
        <span className="flex items-center gap-2 text-[15px] leading-[1.3] tracking-[-0.15px] text-[#4e5c6e]">
          <img src={pin} alt="" className="size-[17px]" />
          {jobLocationLabel(job)}
        </span>
        <span className="flex items-center gap-1 text-base font-medium text-bh-blue">
          {t('Apply')}
          <img src={arrowBlue} alt="" className="size-[19.76px] transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}

import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import iconCalendar from '../assets/img/role/icon-calendar.svg'
import iconLocation from '../assets/img/role/icon-location.svg'
import iconTeam from '../assets/img/role/icon-team.svg'
import mesh from '../assets/img/role/mesh.svg'
import { jobLocationLabel } from '../components/jobs/JobCard'
import { OpenRoles } from '../components/jobs/OpenRoles'
import { PromiseCarousel } from '../components/sections/PromiseCarousel'
import { Button } from '../components/ui/Button'
import { getTeam } from '../data/teams'
import { rememberJob, useJob } from '../hooks/useJobs'

function InfoCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex w-full flex-col gap-1.5 rounded-lg border border-bh-300 bg-white px-[18px] pb-[18px] pt-4 shadow-[0px_-8px_80px_0px_rgba(171,157,251,0.1),0px_8px_80px_0px_rgba(106,246,251,0.1)] sm:w-[271px]">
      <div className="flex items-center gap-[9px]">
        <img src={icon} alt="" className="size-7" />
        <p className="text-[17px] font-semibold leading-[1.4] tracking-[-0.17px] text-bh-blue-1100">{label}</p>
      </div>
      <p className="pl-[37px] text-[15px] leading-[1.3] tracking-[-0.15px] text-[#0b1015]">{value}</p>
    </div>
  )
}

function DescSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-[25px] font-semibold leading-[1.33] tracking-[-0.25px]">{title}</h2>
      <div className="text-base leading-[1.4] tracking-[-0.16px]">{children}</div>
    </div>
  )
}

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' })

export default function RolePage() {
  const { id } = useParams()
  const { data: job, loading } = useJob(id)

  useEffect(() => {
    if (job) {
      rememberJob(job.id)
      document.title = `${job.title} · Careers at Bluehost`
    }
    return () => {
      document.title = 'Careers at Bluehost'
    }
  }, [job])

  if (loading) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 pb-24 pt-[130px]">
        <div className="h-12 w-1/3 animate-pulse rounded bg-bh-light-100" />
        <div className="mt-6 h-24 animate-pulse rounded bg-bh-light-0" />
      </div>
    )
  }

  if (!job) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 pt-32 text-center">
        <h1 className="h-section">This role is no longer open</h1>
        <p className="text-lead max-w-xl">It may have been filled or removed. Explore other opportunities that match your skills.</p>
        <Button to="/jobs">View open roles</Button>
      </section>
    )
  }

  const team = getTeam(job.team)
  const d = job.description ?? {}

  return (
    <>
      <article className="px-4 pb-[50px] pt-[110px]">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-[60px]">
          <header className="flex flex-col gap-[30px]">
            <nav aria-label="Breadcrumb" className="text-sm text-night-sky">
              <Link to="/jobs" className="hover:text-bh-blue">Open roles</Link>
              {team && (
                <>
                  {' / '}
                  <Link to={`/our-teams/${team.slug}`} className="hover:text-bh-blue">{team.name}</Link>
                </>
              )}
            </nav>
            <div className="flex max-w-[951px] flex-col gap-[10px]">
              <h1 className="text-[clamp(30px,3vw,38px)] font-semibold leading-[1.33] tracking-[-1.61px]">{job.title}</h1>
              <p className="text-base leading-[1.4] tracking-[-0.16px] text-bh-blue-1100">{job.summary}</p>
            </div>
            <div className="flex flex-wrap gap-[23px]">
              <InfoCard icon={iconLocation} label="Location" value={jobLocationLabel(job)} />
              <InfoCard icon={iconTeam} label="Team" value={team?.name ?? job.team} />
              <InfoCard icon={iconCalendar} label="Posted on" value={formatDate(job.postedAt)} />
            </div>
            <Button href={job.applyUrl} className="self-start">Apply</Button>
          </header>

          {/* INTEGRATION: Workday descriptions are usually HTML; see workdayProvider.mapJob. */}
          <div className="flex flex-col gap-8">
            {d.about && (
              <DescSection title="About the role">
                <p>{d.about}</p>
              </DescSection>
            )}
            {d.responsibilities?.length ? (
              <DescSection title="What you’ll do">
                <ul className="list-disc space-y-1 pl-6">{d.responsibilities.map(r => <li key={r}>{r}</li>)}</ul>
              </DescSection>
            ) : null}
            {d.requirements?.length ? (
              <DescSection title="Basic qualifications">
                <ul className="list-disc space-y-1 pl-6">{d.requirements.map(r => <li key={r}>{r}</li>)}</ul>
              </DescSection>
            ) : null}
            {d.niceToHave?.length ? (
              <DescSection title="Preferred qualifications">
                <ul className="list-disc space-y-1 pl-6">{d.niceToHave.map(r => <li key={r}>{r}</li>)}</ul>
              </DescSection>
            ) : null}
          </div>

          <div className="relative overflow-hidden rounded-2xl px-6 py-16 md:px-20" style={{ backgroundImage: `url("${mesh}")`, backgroundSize: '160% 250%', backgroundPosition: '20% 25%' }}>
            <div className="relative flex flex-col items-center gap-8 text-center">
              <div className="flex flex-col gap-4">
                {/* CONTENT: Figma has placeholder copy ("Ready to Ride?" / lorem ipsum) here. */}
                <h2 className="text-[clamp(30px,3vw,40px)] font-semibold leading-[1.3] tracking-[-0.4px] text-bh-blue-1100">Ready to build with us?</h2>
                <p className="mx-auto max-w-[805px] text-base leading-[1.4] tracking-[-0.16px]">
                  Bring your curiosity and your courage. Apply now and join a global team that helps millions of small businesses succeed online.
                </p>
              </div>
              <Button href={job.applyUrl}>Apply</Button>
            </div>
          </div>
        </div>
      </article>
      <OpenRoles title="Related jobs" filter={{ team: job.team }} excludeId={job.id} />
      <PromiseCarousel />
    </>
  )
}

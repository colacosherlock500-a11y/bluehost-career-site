import { Navigate, useParams } from 'react-router-dom'
import { OpenRoles } from '../components/jobs/OpenRoles'
import { CareerPaths } from '../components/sections/CareerPaths'
import { GlobeSection } from '../components/sections/GlobeSection'
import { JoinCta } from '../components/sections/JoinCta'
import { Testimonials } from '../components/sections/Testimonials'
import { Button } from '../components/ui/Button'
import { getTeam } from '../data/teams'
import { formatOpenRoles, useJobStats } from '../hooks/useJobs'

export default function TeamPage() {
  const { slug } = useParams()
  const team = getTeam(slug)
  const { data: stats } = useJobStats()
  if (!team) return <Navigate to="/our-teams" replace />

  return (
    <>
      <section className="px-4 pt-[102px]">
        <div className="mx-auto max-w-[1346px] rounded-xl px-6 py-[50px] md:px-[73px]" style={{ backgroundImage: 'linear-gradient(189.7deg, #e6f3ff 15%, #d1e7ff 86%)' }}>
          <div className="grid items-center gap-[57px] lg:grid-cols-[618px_1fr]">
            <div className="flex flex-col gap-5">
              <p className="eyebrow">{team.name}</p>
              <h1 className="text-[clamp(32px,3.5vw,43px)] font-semibold leading-[1.18] tracking-[-1.61px]">{team.headline}</h1>
              <p className="text-base leading-[1.4] tracking-[-0.16px]">{team.description}</p>
              <Button href={`#open-roles`} className="self-start">{team.ctaLabel}</Button>
            </div>
            <div className="relative h-[449px] overflow-hidden rounded-[10.7px]">
              <img src={team.image} alt={`${team.name} team at Bluehost`} className="absolute inset-0 size-full object-cover" />
              <span className="absolute bottom-4 right-4 rounded-md bg-bh-blue-1100/60 px-2 py-1 text-[16.5px] leading-[1.4] text-gold backdrop-blur-sm">
                {formatOpenRoles(stats?.byTeam[team.slug])}
              </span>
            </div>
          </div>
        </div>
      </section>
      <CareerPaths items={team.buildAreas.flat()} />
      <div id="open-roles" className="scroll-mt-24">
        <OpenRoles filter={{ team: team.slug }} />
      </div>
      <GlobeSection />
      <Testimonials />
      <JoinCta />
    </>
  )
}

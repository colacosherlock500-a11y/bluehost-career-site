import { useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import heroBg from '../assets/img/teams-page/hero-bg.jpg'
import iconGrid from '../assets/img/teams-page/icon-grid.svg'
import { JoinCta } from '../components/sections/JoinCta'
import { LogoStrip } from '../components/sections/LogoStrip'
import { TeamCube } from '../components/sections/teams/TeamCube'
import { TeamTabs } from '../components/sections/teams/TeamTabs'
import { Button } from '../components/ui/Button'
import { getTeam, teams } from '../data/teams'

const stats = [
  ['10', 'Teams'],
  ['1112', 'Employees'],
  ['16', 'Countries'],
  ['33', 'Affinity groups'],
]

export default function OurTeamsPage() {
  const [params, setParams] = useSearchParams()
  // Once a function is picked, the cube moves to the bottom of the teams section.
  const [docked, setDocked] = useState(false)
  const active = getTeam(params.get('team') ?? undefined) ?? teams[0]
  const cubeArea = useRef<HTMLDivElement>(null)

  return (
    <>
      {/* The hero grid becomes a cube that travels down into the team photo (TeamCube). */}
      <div ref={cubeArea} className="relative">
      <TeamCube container={cubeArea} face={teams.indexOf(active)} docked={docked} />
      <section className="relative overflow-hidden pt-[78px]">
        <img src={heroBg} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="relative mx-auto flex max-w-[1218px] flex-col items-center gap-12 px-4 py-16 lg:h-[562px] lg:flex-row lg:gap-[111px] lg:py-0">
          <img data-cube-start src={iconGrid} alt="" className="w-full max-w-[405px] drop-shadow-[0_20px_40px_rgba(0,42,102,0.12)]" />
          <div className="flex flex-col gap-[26px]">
            <div className="flex flex-col gap-4">
              <p className="text-sm font-medium uppercase leading-[1.2] tracking-[2px]">our teams</p>
              <h1 className="text-[clamp(36px,4vw,48px)] font-semibold leading-[1.2] tracking-[-0.24px]">
                Find where{' '}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(269.8deg, #569dff 12%, #006fdc 97%)' }}>
                  you belong.
                </span>
              </h1>
              <p className="max-w-[560px] text-base leading-[1.4]">Ten teams. One mission. Countless ways to make a lasting impact on millions of people around the world.</p>
            </div>
            <Button to="/jobs" variant="white" className="self-start">View open roles</Button>
            <ul className="mt-2 flex flex-wrap gap-[33px]">
              {stats.map(([n, l]) => (
                <li key={l} className="flex w-[103px] flex-col items-center gap-[5px] rounded-[9.7px] border border-white px-[21px] py-[13px] text-center shadow-[0px_0px_16px_0px_rgba(0,42,102,0.22),12px_6px_24px_0px_rgba(0,0,0,0.08)] backdrop-blur-[3px]">
                  <span className="text-[32px] font-semibold leading-[1.3] tracking-[-0.32px] text-bh-blue">{n}</span>
                  <span className="w-[106px] text-sm font-light leading-[1.3] tracking-[-0.14px]">{l}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <LogoStrip />
      <TeamTabs
        active={active}
        onChange={slug => {
          setDocked(true)
          setParams({ team: slug }, { replace: true, preventScrollReset: true })
        }}
      />
      </div>
      <JoinCta
        eyebrow="Join a team"
        title={
          <>
            There is a place{' '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #196cdf 40%, #83c0fc 100%)' }}>
              for your talent
            </span>{' '}
            here
          </>
        }
        body="Browse open roles across our teams, brands, and locations, and start building what comes next with us."
        showTeamsButton={false}
      />
    </>
  )
}

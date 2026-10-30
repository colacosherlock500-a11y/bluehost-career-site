import { useState } from 'react'
import next from '../../../assets/img/common/carousel-next.svg'
import prev from '../../../assets/img/common/carousel-prev.svg'
import { teams } from '../../../data/teams'
import { formatOpenRoles, useJobStats } from '../../../hooks/useJobs'
import { Button } from '../../ui/Button'
import { SectionHeader } from '../../ui/SectionHeader'

/**
 * "Find the team where you belong" — centred active card with peeking neighbours.
 * Open-role counts per team come from the jobs service.
 */
export function TeamsCarousel() {
  const [index, setIndex] = useState(1)
  const { data: stats } = useJobStats()
  const go = (d: number) => setIndex(i => (i + d + teams.length) % teams.length)
  const at = (d: number) => teams[(index + d + teams.length) % teams.length]
  const active = at(0)

  return (
    <section className="flex flex-col items-center gap-10 overflow-hidden py-[100px]">
      <SectionHeader
        className="px-4"
        eyebrow="our teams"
        title="Find the team where you belong"
        body="Ten teams across our brands share one purpose: helping every small business succeed online. Explore what each team does and where your skills can make a difference."
      />

      <div className="flex w-full flex-col items-center gap-[37px] py-[19px]">
        {/* --card-w = width of the active card (94% of the row height at its 820:481 ratio). */}
        <div className="relative flex h-[clamp(260px,32vw,512px)] w-full items-center justify-center [--card-w:calc(clamp(260px,32vw,512px)*0.94*820/481)]">
          {/* side cards: fill the space between the screen edge and the active card (67px gap) */}
          {[-1, 1].map(d => {
            const t = at(d)
            return (
              <button
                key={`${t.slug}-${d}`}
                onClick={() => go(d)}
                aria-label={d < 0 ? 'Previous team' : 'Next team'}
                className={`absolute top-1/2 hidden h-[87%] w-[calc(50%-var(--card-w)/2-67px)] -translate-y-1/2 overflow-hidden md:block ${d < 0 ? 'left-0 rounded-r-[10px]' : 'right-0 rounded-l-[10px]'}`}
              >
                <img src={t.image} alt="" className={`absolute inset-0 size-full object-cover ${d < 0 ? 'object-right' : 'object-left'}`} />
                <span
                  className={`absolute inset-y-0 w-[min(246px,100%)] ${d < 0 ? 'right-0 -scale-x-100' : 'left-0'}`}
                  style={{ backgroundImage: 'linear-gradient(269.6deg, rgba(25,108,223,0.82) 17%, rgba(0,67,133,0) 99%)' }}
                />
                {/* 160px in from the inner edge, as in Figma, but never closer than 32px to the screen edge */}
                <img
                  src={d < 0 ? prev : next}
                  alt=""
                  className={`absolute top-1/2 size-16 -translate-y-1/2 ${d < 0 ? 'right-[clamp(0px,calc(100%-96px),160px)] rotate-90 -scale-y-100' : 'left-[clamp(0px,calc(100%-96px),160px)] rotate-90'}`}
                />
              </button>
            )
          })}
          {/* active card */}
          <article key={active.slug} className="relative z-10 aspect-[820/481] h-[94%] max-w-[calc(100%-32px)] overflow-hidden rounded-[10.7px] animate-[fadeUp_0.4s_ease-out]">
            <img src={active.image} alt="" className="absolute inset-0 size-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 h-[63%] bg-gradient-to-b from-[rgba(1,33,70,0)] to-[#012146]" />
            <div className="absolute bottom-[9%] left-[5.8%] flex flex-col gap-[18.5px] text-white">
              <div className="flex flex-col gap-[6.8px]">
                <h3 className="text-[clamp(20px,2.2vw,27px)] font-semibold leading-[1.3] tracking-[-0.27px]">{active.name}</h3>
                <p className="max-w-[350px] text-[15.5px] leading-[1.4] tracking-[-0.16px]">{active.headline}</p>
              </div>
              <Button to={`/our-teams/${active.slug}`} variant="white" className="!min-w-0 self-start !py-[13.6px] !text-[15px]">View open roles</Button>
            </div>
            <p className="absolute bottom-[10%] right-[2%] text-[16.5px] leading-[1.4] tracking-[-0.17px] text-gold">{formatOpenRoles(stats?.byTeam[active.slug])}</p>
          </article>
          {/* mobile arrows */}
          <button onClick={() => go(-1)} aria-label="Previous team" className="absolute left-2 z-20 flex size-10 items-center justify-center rounded-full bg-white/80 shadow md:hidden">‹</button>
          <button onClick={() => go(1)} aria-label="Next team" className="absolute right-2 z-20 flex size-10 items-center justify-center rounded-full bg-white/80 shadow md:hidden">›</button>
        </div>

        <div className="flex items-center gap-[5px]" role="tablist" aria-label="Teams">
          {teams.map((t, i) => (
            <button
              key={t.slug}
              role="tab"
              aria-selected={i === index}
              aria-label={t.name}
              onClick={() => setIndex(i)}
              className={`h-[9.6px] rounded-full transition-all ${i === index ? 'w-12 bg-bh-blue' : 'w-[9.6px] bg-[#c2c2c2]'}`}
            />
          ))}
        </div>
      </div>

      <Button to="/our-teams">Meet Our Teams</Button>
    </section>
  )
}

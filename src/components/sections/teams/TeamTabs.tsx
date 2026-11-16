import { teams, type Team } from '../../../data/teams'
import { formatOpenRoles, useJobStats } from '../../../hooks/useJobs'
import { Button } from '../../ui/Button'

/** Tabbed team explorer on the "Our teams" page. */
export function TeamTabs({ active, onChange }: { active: Team; onChange: (slug: string) => void }) {
  const { data: stats } = useJobStats()
  return (
    <section id="teams" className="bg-gradient-to-b from-white to-[#e6f4ff] px-4 pb-20 pt-[48px]">
      <div className="mx-auto flex max-w-[1350px] flex-col items-center gap-[60px]">
        {/* All functions on one line (HR feedback); scrolls sideways on narrow screens. */}
        <div role="tablist" aria-label="Teams" className="no-scrollbar -mx-4 flex w-[calc(100%+32px)] gap-4 overflow-x-auto px-4 lg:gap-2 xl:mx-0 xl:w-full xl:justify-center xl:gap-2.5 xl:overflow-visible xl:px-0">
          {teams.map(t => {
            const selected = t.slug === active.slug
            return (
              <button
                key={t.slug}
                role="tab"
                aria-selected={selected}
                aria-controls="team-panel"
                onClick={() => onChange(t.slug)}
                className={`shrink-0 whitespace-nowrap rounded-xl border px-4 py-2 text-base leading-[1.4] lg:px-3 lg:text-[15px] 2xl:px-4 2xl:text-base tracking-[-0.16px] transition-colors ${
                  selected ? 'border-bh-blue bg-bh-blue font-medium text-white' : 'border-bh-light-100 bg-white text-black hover:border-bh-blue'
                }`}
              >
                {t.tabLabel}
              </button>
            )
          })}
        </div>

        <div id="team-panel" role="tabpanel" key={active.slug} className="grid w-full max-w-[1200px] items-center gap-[57px] animate-[fadeUp_0.4s_ease-out] lg:grid-cols-[618px_1fr]">
          <div className="flex flex-col gap-5">
            <p className="eyebrow">{active.name}</p>
            <h2 className="text-[clamp(32px,3.5vw,43px)] font-semibold leading-[1.18] tracking-[-1.61px]">{active.headline}</h2>
            <p className="text-base leading-[1.4] tracking-[-0.16px]">{active.description}</p>
            <Button to={`/our-teams/${active.slug}`} className="self-start">{active.ctaLabel}</Button>
            <div className="mt-5 flex flex-col gap-[17px]">
              <h3 className="text-[28px] font-semibold leading-[1.3] tracking-[-0.28px]">Where you can build with us:</h3>
              <div className="grid gap-x-0 sm:grid-cols-[271px_283px]">
                {active.buildAreas.map((col, i) => (
                  <ul key={i} className="list-disc">
                    {col.map(item => (
                      <li key={item} className="ms-6 text-base leading-[1.4] tracking-[-0.16px]">{item}</li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative h-[449px] overflow-hidden rounded-[10.7px]">
              <img src={active.image} alt={`${active.name} team at Bluehost`} className="absolute inset-0 size-full object-cover" />
              <span className="absolute bottom-4 right-4 rounded-md bg-bh-blue-1100/60 px-2 py-1 text-[16.5px] leading-[1.4] text-gold backdrop-blur-sm">
                {formatOpenRoles(stats?.byTeam[active.slug])}
              </span>
            </div>
            {/* Where the TeamCube lands: on the photo's bottom-left corner, with a soft shadow that grows as it arrives. */}
            <div data-cube-target aria-hidden className="pointer-events-none absolute -bottom-7 -left-1.5 size-[72px] lg:-bottom-9 lg:-left-[46px] lg:size-[92px]">
              <span className="absolute -bottom-[18px] left-1/2 h-5 w-[120px] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(1,41,87,0.35),transparent)] [opacity:var(--pad-o,0)] [scale:var(--pad-s,0.3)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import { Link } from 'react-router-dom'
import { careerPathIcon } from '../../data/careerPaths'
import { useT } from '../../i18n/I18n'

/**
 * "Career paths — Where you can build with us" icon cards on team pages. Each card opens the
 * job search for that team, searching for the area (e.g. Customer Service → "Retention").
 */
export function CareerPaths({ items, team }: { items: string[]; team?: string }) {
  const t = useT()
  return (
    <section className="px-4 py-[50px]">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-5 text-center">
          <p className="eyebrow">{t('Career paths')}</p>
          <h2 className="h-section">{t('Where you can build with us')}</h2>
        </div>
        <ul className="flex flex-wrap justify-center gap-5">
          {items.map(label => {
            const q = new URLSearchParams({ ...(team ? { team } : {}), keyword: label })
            return (
              <li key={label} className="flex w-[224px]">
                <Link
                  to={`/jobs?${q}`}
                  className="group flex w-full flex-col gap-5 rounded-3xl bg-white p-4 shadow-[0px_-8px_80px_0px_rgba(171,157,251,0.1),0px_8px_80px_0px_rgba(106,246,251,0.1)] outline-none transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(25,108,223,0.18)] focus-visible:ring-2 focus-visible:ring-bh-blue"
                >
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-[#e6f3ff] transition-colors duration-300 group-hover:bg-[#d4e9ff]">
                    <img src={careerPathIcon(label)} alt="" className="size-7 object-contain" />
                  </span>
                  <span className="text-[18px] font-medium leading-[1.3] tracking-[-0.18px]">{t(label)}</span>
                  <span className="mt-auto flex items-center gap-1 text-sm font-medium text-bh-blue">
                    {t('View roles')}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

import { useState } from 'react'
import { benefitCountries, benefitIcon, getBenefits } from '../../../data/benefits'
import { getCountry } from '../../../data/countries'

/** "Benefits that support you, wherever you are" — benefits per country. */
export function Benefits({ id }: { id?: string }) {
  const [country, setCountry] = useState(benefitCountries[0])
  return (
    <section id={id} className="scroll-mt-24 overflow-x-clip px-4 py-[60px]">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-10">
        <div className="flex max-w-[909px] flex-col items-center gap-5 text-center">
          <p className="eyebrow">Benefits and wellbeing</p>
          <h2 className="h-section">
            <span className="text-bh-blue">Benefits</span> that support you, wherever you are
          </h2>
          <p className="text-lead max-w-[864px]">We care about the whole person. Our benefits are designed around what matters most in each country where we work, so the details vary by location.</p>
        </div>
        <div role="tablist" aria-label="Country" className="no-scrollbar -mx-4 flex w-[calc(100%+32px)] gap-[13px] overflow-x-auto px-4 xl:mx-0 xl:w-auto xl:justify-center xl:overflow-visible">
          {benefitCountries.map(slug => {
            const c = getCountry(slug)!
            const active = slug === country
            return (
              <button key={slug} role="tab" aria-selected={active} onClick={() => setCountry(slug)} className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl border px-3 py-2 text-base tracking-[-0.16px] ${active ? 'border-bh-blue bg-bh-blue font-medium text-white' : 'border-bh-light-100 bg-white hover:border-bh-blue'}`}>
                <img src={c.flag} alt="" className="size-[27px]" />
                {c.name}
              </button>
            )
          })}
        </div>
        {/* All of a country's benefits on one line (HR feedback): a single row that scrolls sideways. */}
        <ul
          key={country}
          aria-label={`Benefits in ${getCountry(country)!.name}`}
          className="no-scrollbar -mx-4 flex w-[calc(100%+32px)] snap-x snap-mandatory gap-4 overflow-x-auto px-4 py-6 animate-[fadeUp_0.4s_ease-out] [scroll-padding-inline:16px] xl:mx-[calc(600px-50vw)] xl:w-screen xl:px-[clamp(16px,3vw,48px)] xl:[scroll-padding-inline:clamp(16px,3vw,48px)]"
        >
          {getBenefits(country).map(b => (
            <li
              key={b}
              tabIndex={0}
              className="group relative flex min-h-[160px] w-[200px] shrink-0 snap-start flex-col justify-between gap-4 overflow-hidden rounded-2xl border border-bh-light-200 bg-white p-[18px] shadow-[0px_-8px_80px_0px_rgba(171,157,251,0.1),0px_8px_80px_0px_rgba(106,246,251,0.1)] outline-none transition-[translate,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1.5 hover:border-transparent hover:shadow-[0_18px_40px_rgba(25,108,223,0.28)] focus-visible:-translate-y-1.5 focus-visible:ring-2 focus-visible:ring-bh-blue"
            >
              {/* gradient that sweeps in on hover */}
              <span aria-hidden className="absolute inset-0 bg-[linear-gradient(135deg,#0e3b79_0%,#196cdf_45%,#51bff2_100%)] bg-[length:220%_220%] bg-[position:100%_100%] opacity-0 transition-[opacity,background-position] duration-500 ease-out group-hover:bg-[position:0%_0%] group-hover:opacity-100 group-focus-visible:bg-[position:0%_0%] group-focus-visible:opacity-100" />
              <span className="relative flex size-[38px] items-center justify-center rounded-lg bg-icon-bg transition-colors duration-300 group-hover:bg-white group-focus-visible:bg-white">
                <img src={benefitIcon(b)} alt="" className="size-7" />
              </span>
              <p className="relative text-[17px] font-semibold leading-[1.3] tracking-[-0.17px] text-bh-blue-1100 transition-colors duration-300 group-hover:text-white group-focus-visible:text-white">{b}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

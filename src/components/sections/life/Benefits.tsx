import { useState } from 'react'
import { benefitCountries, benefitIcon, getBenefits } from '../../../data/benefits'
import { getCountry } from '../../../data/countries'

/** "Benefits that support you, wherever you are" — benefits per country. */
export function Benefits({ id }: { id?: string }) {
  const [country, setCountry] = useState(benefitCountries[0])
  return (
    <section id={id} className="scroll-mt-24 px-4 py-[60px]">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-10">
        <div className="flex max-w-[909px] flex-col items-center gap-5 text-center">
          <p className="eyebrow">Benefits and wellbeing</p>
          <h2 className="h-section">
            <span className="text-bh-blue">Benefits</span> that support you, wherever you are
          </h2>
          <p className="text-lead max-w-[864px]">We care about the whole person. Our benefits are designed around what matters most in each country where we work, so the details vary by location.</p>
        </div>
        <div role="tablist" aria-label="Country" className="no-scrollbar -mx-4 flex w-[calc(100%+32px)] gap-[13px] overflow-x-auto px-4 lg:mx-0 lg:w-auto lg:flex-wrap lg:justify-center">
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
        <ul key={country} className="grid w-full gap-[22px] sm:grid-cols-2 lg:grid-cols-4 animate-[fadeUp_0.4s_ease-out]">
          {getBenefits(country).map(b => (
            <li key={b} className="flex min-h-[145px] flex-col gap-4 rounded-2xl border border-bh-light-200 bg-white p-[18px] shadow-[0px_-8px_80px_0px_rgba(171,157,251,0.1),0px_8px_80px_0px_rgba(106,246,251,0.1)]">
              <span className="flex size-[38px] items-center justify-center rounded-lg bg-icon-bg">
                <img src={benefitIcon(b)} alt="" className="size-7" />
              </span>
              <p className="text-[17px] font-semibold leading-[1.4] tracking-[-0.17px] text-bh-blue-1100">{b}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

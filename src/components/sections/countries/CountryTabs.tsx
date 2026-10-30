import { countries, getCountry } from '../../../data/countries'
import { CountryDetail, OfficeCards } from './CountryDetail'

/** Flag tabs + selected country's detail and offices ("Countries" component in Figma). */
export function CountryTabs({ selected, onSelect }: { selected: string; onSelect: (slug: string) => void }) {
  const country = getCountry(selected) ?? countries[0]
  return (
    <section id="countries" className="scroll-mt-24 bg-gradient-to-b from-white to-[#e6f4ff] px-4 pb-20 pt-10">
      <div className="mx-auto flex max-w-[1500px] flex-col items-center gap-[60px]">
        <div role="tablist" aria-label="Countries" className="no-scrollbar -mx-4 flex w-[calc(100%+32px)] gap-[13px] overflow-x-auto px-4 lg:mx-0 lg:w-auto lg:flex-wrap lg:justify-center">
          {countries.map(c => {
            const active = c.slug === country.slug
            return (
              <button
                key={c.slug}
                role="tab"
                aria-selected={active}
                onClick={() => onSelect(c.slug)}
                className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl border px-3 py-2 text-base leading-[1.4] tracking-[-0.16px] transition-colors ${
                  active ? 'border-bh-blue bg-bh-blue font-medium text-white' : 'border-bh-light-100 bg-white text-black hover:border-bh-blue'
                }`}
              >
                <img src={c.flag} alt="" className="size-[27px]" />
                {c.name}
              </button>
            )
          })}
        </div>
        <div role="tabpanel" key={country.slug} className="flex w-full flex-col items-center gap-[60px] animate-[fadeUp_0.4s_ease-out]">
          <CountryDetail country={country} />
          <OfficeCards country={country} />
        </div>
      </div>
    </section>
  )
}

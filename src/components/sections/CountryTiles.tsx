import { Link } from 'react-router-dom'
import { countries } from '../../data/countries'
import { Marquee } from '../ui/Marquee'
import { useT } from '../../i18n/I18n'

function Tile({ slug, name, tile }: { slug: string; name: string; tile: string }) {
  const t = useT()
  return (
    <Link to={`/locations/${slug}`} className="group flex shrink-0 gap-[18px]">
      <span className="flex h-[153px] items-center justify-center rounded-[14px] border border-bh-blue-500 bg-bh-blue px-[52px] text-[37px] font-semibold leading-[50.6px] tracking-[-1.61px] whitespace-nowrap text-white transition-colors group-hover:bg-bh-blue-900">
        {t(name)}
      </span>
      <span className="block h-[154px] w-[192px] overflow-hidden rounded-[14px]">
        <img src={tile} alt="" className="size-full object-cover transition-transform duration-500 group-hover:scale-110" />
      </span>
    </Link>
  )
}

/** Two rows of country name + photo tiles flowing continuously across the screen in opposite directions (swipe/drag too). */
export function CountryTiles() {
  const t = useT()
  const half = Math.ceil(countries.length / 2)
  const rows = [countries.slice(0, half), countries.slice(half)]
  return (
    <section aria-label={t('Our countries')} className="flex flex-col gap-[18px] py-6">
      {rows.map((row, i) => (
        <Marquee key={i} gap={18} reverse={i === 1} flow={i === 1 ? 34 : 42}>
          {row.map(c => (
            <Tile key={c.slug} {...c} />
          ))}
        </Marquee>
      ))}
    </section>
  )
}

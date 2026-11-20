import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import arrowLink from '../../../assets/img/common/arrow-blue-link.svg'
import quoteIcon from '../../../assets/img/common/quote.svg'
import { type Country, type Office, type Quote } from '../../../data/countries'
import { getTeam } from '../../../data/teams'
import { Button } from '../../ui/Button'

const initials = (name: string) => name.split(' ').map(w => w[0]).slice(0, 2).join('')

export function QuoteCard({ quote }: { quote: Quote }) {
  return (
    <figure className="relative flex min-h-[291px] w-full max-w-[460px] flex-col justify-between gap-6 overflow-hidden rounded-[10.7px] p-7 pr-[75px] text-white" style={{ backgroundImage: 'linear-gradient(123deg, #4a9cff 1%, #196cdf 96%)' }}>
      <img src={quoteIcon} alt="" className="absolute right-3 top-3 size-[50px]" />
      <blockquote className="max-w-[333px] text-sm leading-[1.37]">{quote.text}</blockquote>
      <figcaption className="flex items-center gap-[18px]">
        <span className="flex shrink-0 items-center justify-center rounded-[9.8px] border border-white p-1 shadow-[13px_6.5px_26px_0px_rgba(0,0,0,0.08)] backdrop-blur-[3.4px]" style={{ backgroundImage: 'linear-gradient(138deg, rgba(248,251,255,0.17) 0%, rgba(255,255,255,0.17) 100%)' }}>
          {quote.photo ? (
            <img src={quote.photo} alt="" className="h-[62.7px] w-[70.9px] rounded-[7.6px] border-[0.1px] border-bh-light-400 bg-bh-light-200 object-cover" />
          ) : (
            <span aria-hidden className="flex h-[62.7px] w-[70.9px] items-center justify-center rounded-[7.6px] bg-white/20 text-xl font-semibold">
              {initials(quote.name)}
            </span>
          )}
        </span>
        <span className="flex flex-col gap-[7px] leading-[1.2]">
          <span className="text-[17px] font-medium">{quote.name}</span>
          <span className="text-sm text-bh-light-300">{quote.role}</span>
        </span>
      </figcaption>
    </figure>
  )
}

export function OfficeCard({ office, country }: { office: Office; country: Country }) {
  const href = office.remote ? `/jobs?country=${country.slug}&workType=Remote` : `/jobs?country=${country.slug}&keyword=${encodeURIComponent(office.city)}`
  return (
    <div className="flex flex-col items-center gap-[37px] rounded-3xl border border-bh-300 bg-white px-[18px] pb-[18px] pt-4 shadow-[0px_-8px_80px_0px_rgba(171,157,251,0.1),0px_8px_80px_0px_rgba(106,246,251,0.1)] sm:flex-row">
      <div className="h-[269px] w-full overflow-hidden rounded-2xl bg-bh-light-200 sm:w-[251px] sm:shrink-0 lg:flex-1">
        <img src={office.image} alt={office.remote ? `Remote work in ${country.name}` : `${office.city} office`} className="size-full object-cover" />
      </div>
      <div className="flex w-full flex-col gap-[10px] sm:w-[258px] sm:shrink-0">
        <p className="text-[15px] font-bold uppercase text-[#939fb0]">{office.label}</p>
        <p className="pb-3 text-[25px] font-semibold leading-[1.33] tracking-[-0.25px]">{office.city}</p>
        <Link to={href} className="flex items-center gap-1 self-start text-base font-medium capitalize text-bh-blue hover:underline">
          View open roles
          <img src={arrowLink} alt="" className="size-[19.76px]" />
        </Link>
      </div>
    </div>
  )
}

export function OfficeCards({ country }: { country: Country }) {
  return (
    <div className={`mx-auto grid w-full gap-[30px] ${country.offices.length > 1 ? 'max-w-[1198px] lg:grid-cols-2' : 'max-w-[584px]'}`}>
      {country.offices.map(o => (
        <OfficeCard key={o.city} office={o} country={country} />
      ))}
    </div>
  )
}

/** Country intro: flag eyebrow, headline, copy, teams, values, CTAs + colleague quote. */
export function CountryDetail({ country, headingLevel = 'h2' }: { country: Country; headingLevel?: 'h1' | 'h2' }) {
  const Heading = headingLevel
  const teamLinks = country.teams.map(slug => getTeam(slug)).filter(Boolean)
  return (
    <div className="grid w-full max-w-[1200px] items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(300px,460px)] lg:pl-[21px] xl:grid-cols-[640px_1fr]">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-[10px]">
          <img src={country.flag} alt="" className="size-6" />
          <p className="eyebrow">{country.name}</p>
        </div>
        <Heading className="h-section">{country.headline}</Heading>
        <p className="text-base leading-[1.4] tracking-[-0.16px]">{country.description}</p>
        <div className="flex flex-col gap-[10px]">
          <p className="text-[18px] font-semibold leading-[1.3] tracking-[-0.18px]">Teams here:</p>
          <p className="text-base leading-[1.4] tracking-[-0.16px]">
            {teamLinks.map((t, i) => (
              <Fragment key={t!.slug}>
                {i > 0 && (i === teamLinks.length - 1 ? ', and ' : ', ')}
                <Link to={`/our-teams/${t!.slug}`} className="text-bh-blue hover:underline">{t!.name === 'Technology and Engineering' ? 'Engineering' : t!.name}</Link>
              </Fragment>
            ))}
          </p>
        </div>
        <div className="flex items-center gap-[10px]">
          {country.values.map((v, i) => (
            <Fragment key={v}>
              {i > 0 && <span className="h-[28.5px] w-px bg-black" aria-hidden />}
              <span className="eyebrow">{v}</span>
            </Fragment>
          ))}
        </div>
        <div className="flex flex-wrap gap-5">
          <Button to={`/jobs?country=${country.slug}`}>View All open roles</Button>
          <Button to={`/around-the-world?country=${country.slug}#globe`} variant="outline">See benefits in {country.name}</Button>
        </div>
      </div>
      {country.quotes.length > 0 && (
        <div className="flex min-w-0 flex-col items-center gap-5 lg:items-end">
          {country.quotes.map(q => (
            <QuoteCard key={q.name} quote={q} />
          ))}
        </div>
      )}
    </div>
  )
}

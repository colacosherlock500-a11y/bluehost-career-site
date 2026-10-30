import { useSearchParams } from 'react-router-dom'
import iconDiversity from '../assets/img/atw/icon-diversity.svg'
import iconLanguage from '../assets/img/atw/icon-language.svg'
import iconLocation from '../assets/img/atw/icon-location.svg'
import wordcamp from '../assets/img/atw/wordcamp.jpg'
import { CountryTabs } from '../components/sections/countries/CountryTabs'
import { GlobeSection } from '../components/sections/GlobeSection'
import { JoinCta } from '../components/sections/JoinCta'
import { LogoStrip } from '../components/sections/LogoStrip'
import { VideoHero } from '../components/sections/VideoHero'
import { Button } from '../components/ui/Button'
import { FeatureCard } from '../components/ui/FeatureCard'
import { countries } from '../data/countries'

const features = [
  { icon: iconDiversity, title: 'Collaboration without borders', body: 'Teams in the Americas, Europe, and Asia work together on the same products and the same customers every day.' },
  { icon: iconLanguage, title: 'Many languages, one purpose', body: 'We support customers in English, Portuguese, Spanish, and more, and we celebrate the cultures behind every language.' },
  { icon: iconLocation, title: 'Local roots, global reach', body: 'Each location brings its own traditions and strengths, and every one of them helps small businesses around the world.' },
]

export default function AroundTheWorldPage() {
  const [params, setParams] = useSearchParams()
  const selected = params.get('country')
  const tab = selected ?? countries[0].slug
  const select = (slug: string | null) => {
    const next = new URLSearchParams(params)
    if (slug) next.set('country', slug)
    else next.delete('country')
    setParams(next, { replace: true, preventScrollReset: true })
  }

  return (
    <>
      <VideoHero className="h-[600px] md:h-[894px]">
        <div className="absolute inset-x-0 top-[42px] flex flex-col items-center px-4 text-center md:top-[52px]">
          <h1 className="text-[clamp(34px,4vw,52px)] font-semibold leading-[1.2] tracking-[-0.5px] text-white">
            One team, <span className="text-bh-light-300">a world of possibilities.</span>
          </h1>
        </div>
        <div className="absolute inset-x-0 bottom-[110px] flex justify-center md:bottom-[150px]">
          <Button to="/jobs" variant="white">View open roles</Button>
        </div>
      </VideoHero>
      <LogoStrip />

      <section className="px-4 py-[100px]">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-6 text-center">
            <p className="eyebrow">Global by nature</p>
            <h2 className="text-[clamp(34px,4vw,48px)] font-semibold leading-[1.2] tracking-[-0.24px]">
              Different places, <span className="text-bh-blue">one sense of belonging</span>
            </h2>
            <p className="max-w-[926px] text-base leading-[1.4] tracking-[-0.08px] text-bh-blue-950">
              Working at Bluehost means collaborating with colleagues in other time zones, learning from new perspectives, and building friendships that cross borders. Our differences make our ideas stronger, and our shared values keep us connected wherever we are.
            </p>
          </div>
          <div className="grid w-full gap-[30px] md:grid-cols-3">
            {features.map(f => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      <GlobeSection
        id="globe"
        eyebrow="Where we work"
        title={<>Explore our <span className="text-bh-blue">global footprint</span></>}
        body="Select a country to meet the team, see our offices, and discover open roles near you."
        selected={selected}
        onSelect={select}
      />
      <CountryTabs selected={tab} onSelect={select} />

      <section className="px-4 py-[60px]">
        <div className="relative mx-auto min-h-[462px] max-w-[1200px] overflow-hidden rounded-3xl" style={{ backgroundImage: 'linear-gradient(159deg, #0a1f45 0%, #00a4fc 100%)' }}>
          <img src={wordcamp} alt="Bluehost team at WordCamp US 2026" className="absolute left-[14.5%] top-[-46%] h-[198%] w-[101.5%] max-w-none object-cover max-md:inset-0 max-md:size-full" />
          <div className="absolute inset-y-0 left-0 w-[54%] blur-[3.4px] max-md:w-full" style={{ backgroundImage: 'linear-gradient(88deg, #043f91 52%, rgba(25,108,223,0) 97%)' }} />
          <div className="relative flex max-w-[490px] flex-col gap-6 px-8 py-16 text-white md:pl-[76px] md:pt-[80px]">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium uppercase leading-[1.2] tracking-[2px]">And beyond</p>
              <h2 className="text-[clamp(30px,3vw,40px)] font-semibold leading-[1.3] tracking-[-0.4px]">Our team reaches even further</h2>
            </div>
            <p className="max-w-[413px] text-base leading-[1.4] tracking-[-0.16px]">
              Most of our colleagues work remotely, from homes across all 10 of our countries. Working together from different parts of the world brings a diversity of cultures, languages, and ideas that makes our work stronger. Wherever we are, we are part of the same team, with the same purpose.
            </p>
          </div>
        </div>
      </section>

      <JoinCta
        eyebrow="Find your place"
        title={
          <>
            Wherever you are, you can{' '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #196cdf 30%, #83c0fc 100%)' }}>
              belong here
            </span>
          </>
        }
        body="Explore open roles in your country or discover remote opportunities, and join a global team that puts customers first and grows together."
      />
    </>
  )
}

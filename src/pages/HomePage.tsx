import { CountryTiles } from '../components/sections/CountryTiles'
import { GlobeSection } from '../components/sections/GlobeSection'
import { HomeHero } from '../components/sections/home/HomeHero'
import { LifeBanner } from '../components/sections/home/LifeBanner'
import { Numbers } from '../components/sections/home/Numbers'
import { TeamsCarousel } from '../components/sections/home/TeamsCarousel'
import { WhyBluehost } from '../components/sections/home/WhyBluehost'
import { JoinCta } from '../components/sections/JoinCta'
import { Testimonials } from '../components/sections/Testimonials'
import { VideoSection } from '../components/sections/VideoSection'

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <WhyBluehost />
      <VideoSection />
      <Numbers />
      <TeamsCarousel />
      <GlobeSection />
      <CountryTiles />
      <LifeBanner />
      <Testimonials />
      <JoinCta />
    </>
  )
}

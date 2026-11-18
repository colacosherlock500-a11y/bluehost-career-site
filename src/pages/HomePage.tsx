import { CountryTiles } from '../components/sections/CountryTiles'
import { GlobeSection } from '../components/sections/GlobeSection'
import { HomeHero } from '../components/sections/home/HomeHero'
import { LifeBanner } from '../components/sections/home/LifeBanner'
import { Numbers } from '../components/sections/home/Numbers'
import { TeamsCarousel } from '../components/sections/home/TeamsCarousel'
import { WhyBluehost } from '../components/sections/home/WhyBluehost'
import { JoinCta } from '../components/sections/JoinCta'
import { Testimonials } from '../components/sections/Testimonials'
import { PullUp } from '../components/ui/PullUp'
import { VideoSection } from '../components/sections/VideoSection'

// Brand banner video, served from Newfold's Scene7 media server.
// VITE_BRAND_VIDEO_URL can point it elsewhere (e.g. a smaller copy for previews).
const BRAND_VIDEO = import.meta.env.VITE_BRAND_VIDEO_URL || 'https://newfold.scene7.com/is/content/NewfoldDigital/banner-4'

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <WhyBluehost />
      <VideoSection src={BRAND_VIDEO} title="Life at Bluehost" autoPlay />
      <Numbers />
      {/* the globe's section slides up over the frozen functions carousel (ref. jobs.uber.com) */}
      <PullUp under={<TeamsCarousel />}>
        <GlobeSection />
      </PullUp>
      <CountryTiles />
      <LifeBanner />
      <Testimonials />
      <JoinCta />
    </>
  )
}

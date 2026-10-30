import eyebrowIcon from '../../../assets/img/common/eyebrow-icon.png'
import { JobSearchBar } from '../JobSearchBar'
import { LogoStrip } from '../LogoStrip'
import { VideoHero } from '../VideoHero'

export function HomeHero() {
  return (
    <>
      <VideoHero>
        <h1 className="sr-only">Careers at Bluehost</h1>
      </VideoHero>
      <section className="bg-gradient-to-b from-[#e6f4ff] to-[#d4ebff] px-4 py-[59px]">
        <div className="mx-auto flex max-w-[1150px] flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-5 text-center">
            <p className="flex items-center gap-px px-[11px] eyebrow">
              <img src={eyebrowIcon} alt="" className="h-[30px] w-12 -scale-y-100 rotate-180 object-contain" />
              Find your next role
            </p>
            <h2 className="h-section">
              A place where people can{' '}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #196cdf 43%, #0e57bd 57%)' }}>
                belong
              </span>
            </h2>
          </div>
          <JobSearchBar />
        </div>
      </section>
      <LogoStrip />
    </>
  )
}

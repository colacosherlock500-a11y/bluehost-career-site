import { useEffect, useState } from 'react'
import eyebrowIcon from '../../../assets/img/common/eyebrow-icon.png'
import { JobSearchBar } from '../JobSearchBar'
import { LogoStrip } from '../LogoStrip'
import { VideoHero } from '../VideoHero'

const WORDS = ['belong', 'build', 'grow', 'shine']

/**
 * Figma dev note: the blue word changes one at a time (belong → build → grow → shine).
 * Each word rolls up out of view as the next rolls in. The slot is as wide as the
 * longest word so the heading never reflows. Reduced motion: the words swap without sliding.
 */
function RotatingWord() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setI(n => (n + 1) % WORDS.length), 2400)
    return () => window.clearInterval(id)
  }, [])
  return (
    <span className="relative -mb-[0.12em] inline-grid overflow-hidden pb-[0.12em] align-baseline">
      {/* Screen readers get one stable sentence instead of a word changing every few seconds. */}
      <span className="sr-only">belong, build, grow, and shine</span>
      {WORDS.map((w, n) => {
        const offset = (n - i + WORDS.length) % WORDS.length
        const state = offset === 0 ? 'translate-y-0 opacity-100' : offset === WORDS.length - 1 ? '-translate-y-full opacity-0' : 'translate-y-full opacity-0'
        return (
          <span
            key={w}
            aria-hidden
            className={`col-start-1 row-start-1 bg-clip-text text-left text-transparent transition-[translate,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-opacity motion-reduce:translate-y-0 ${state}`}
            style={{ backgroundImage: 'linear-gradient(90deg, #196cdf 43%, #0e57bd 57%)' }}
          >
            {w}
          </span>
        )
      })}
    </span>
  )
}

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
              A place where people can <RotatingWord />
            </h2>
          </div>
          <JobSearchBar />
        </div>
      </section>
      <LogoStrip />
    </>
  )
}

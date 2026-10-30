import type { ReactNode } from 'react'
import square from '../../assets/img/common/square.svg'
import heroPoster from '../../assets/img/home/hero-bg.jpg'

interface VideoHeroProps {
  /**
   * MEDIA: the Figma hero uses a video fill (rotating digital globe) that can't be exported
   * from Figma. Drop the MP4 into /public (e.g. /videos/globe.mp4) and pass its path here;
   * until then the exported still frame is shown.
   */
  videoSrc?: string
  children?: ReactNode
  className?: string
}

/** Dark globe hero with the glassy 3×3 Bluehost "grid" mark in the centre. */
export function VideoHero({ videoSrc, children, className = 'h-[640px] md:h-[826px]' }: VideoHeroProps) {
  return (
    <section className={`relative overflow-hidden bg-[#0b2d6b] ${className}`}>
      {videoSrc ? (
        <video className="absolute inset-0 size-full object-cover" src={videoSrc} poster={heroPoster} autoPlay muted loop playsInline aria-hidden />
      ) : (
        <img src={heroPoster} alt="" className="absolute inset-0 size-full object-cover" />
      )}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 grid w-[min(368.7px,70vw)] -translate-x-1/2 -translate-y-1/2 grid-cols-3 grid-rows-3 gap-x-[6.7%] gap-y-[7.4%]"
        style={{ aspectRatio: '368.7 / 376' }}
      >
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className="relative overflow-hidden rounded-[5.9px] border-[0.66px] border-white/30 bg-white/33 mix-blend-screen">
            <img src={square} alt="" className="absolute -inset-[29%] size-[158%] max-w-none" />
          </div>
        ))}
      </div>
      {children}
    </section>
  )
}

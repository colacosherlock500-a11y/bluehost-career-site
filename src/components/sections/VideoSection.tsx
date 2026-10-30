import { useEffect, useRef, useState } from 'react'

interface VideoSectionProps {
  /** MP4 URL (CDN or /public). */
  src?: string
  /** YouTube / Vimeo / Wistia embed URL, as an alternative to `src`. */
  embedUrl?: string
  poster?: string
  title?: string
  /**
   * Play muted on a continuous loop, like a banner. Browsers only allow muted autoplay,
   * so a sound toggle is shown. Visitors who prefer reduced motion get a play button instead.
   */
  autoPlay?: boolean
}

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function VideoSection({ src, embedUrl, poster, title = 'Life at Bluehost', autoPlay = false }: VideoSectionProps) {
  const box = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [near, setNear] = useState(false)
  const [muted, setMuted] = useState(true)
  const banner = autoPlay && !reducedMotion()

  // The banner video is large: only fetch it once the section is close to the screen,
  // and pause it while it is scrolled out of view.
  useEffect(() => {
    if (!banner || !box.current) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true)
        const v = video.current
        if (!v) return
        if (entry.isIntersecting) v.play().catch(() => undefined)
        else v.pause()
      },
      { rootMargin: '400px 0px' },
    )
    io.observe(box.current)
    return () => io.disconnect()
  }, [banner])

  return (
    <section className="bg-bh-light-0 px-4 py-[59px]">
      <div ref={box} className="relative mx-auto aspect-[1439/809.5] w-full max-w-[1439px] overflow-hidden bg-black">
        {embedUrl ? (
          <iframe className="size-full" src={embedUrl} title={title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
        ) : src && banner ? (
          <>
            <video ref={video} className="size-full object-cover" src={near ? src : undefined} poster={poster} autoPlay muted={muted} loop playsInline preload="none" aria-label={title} />
            <button
              type="button"
              onClick={() => setMuted(m => !m)}
              aria-pressed={!muted}
              aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
              className="absolute bottom-4 left-4 flex size-11 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition hover:bg-black/65 focus-visible:outline-2 focus-visible:outline-white"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M11 5 6 9H2v6h4l5 4V5z" fill="currentColor" />
                {muted ? <path d="m23 9-6 6M17 9l6 6" /> : <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" />}
              </svg>
            </button>
          </>
        ) : src ? (
          <video className="size-full object-cover" src={src} poster={poster} controls loop={autoPlay} playsInline preload="metadata" aria-label={title} />
        ) : (
          <div className="flex size-full items-center justify-center" aria-label={`${title} video coming soon`}>
            <span className="flex size-20 items-center justify-center rounded-full border-2 border-white/40 text-white/70">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M8 5v14l11-7z" /></svg>
            </span>
          </div>
        )}
      </div>
    </section>
  )
}

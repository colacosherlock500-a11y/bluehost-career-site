/**
 * MEDIA: Figma shows a "Video Draft" placeholder here. Pass `src` (MP4 in /public or a CDN URL)
 * or `embedUrl` (YouTube/Vimeo/Wistia) once the final brand video is ready.
 */
export function VideoSection({ src, embedUrl, poster, title = 'Life at Bluehost' }: { src?: string; embedUrl?: string; poster?: string; title?: string }) {
  return (
    <section className="bg-bh-light-0 px-4 py-[59px]">
      <div className="mx-auto aspect-[1439/809.5] w-full max-w-[1439px] overflow-hidden bg-black">
        {embedUrl ? (
          <iframe className="size-full" src={embedUrl} title={title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
        ) : src ? (
          <video className="size-full object-cover" src={src} poster={poster} controls playsInline />
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

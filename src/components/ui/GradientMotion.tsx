/**
 * Soft blue gradient in slow movement, for the Life at Bluehost hero (Figma: the
 * "soft blue gradient light movement" video). The video itself could not be exported
 * from Figma, so this draws the same effect with drifting blurred light blobs; set
 * VITE_LIFE_HERO_VIDEO_URL to play the original video (looped, muted) on top instead.
 */
const VIDEO = import.meta.env.VITE_LIFE_HERO_VIDEO_URL as string | undefined

export function GradientMotion({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`absolute inset-0 overflow-hidden bg-[#eaf4ff] ${className}`}>
      <span className="blob-a absolute -left-[15%] -top-[25%] h-[85%] w-[70%] rounded-full bg-[radial-gradient(closest-side,#9fd2ff,transparent)] opacity-90 blur-[40px]" />
      <span className="blob-b absolute -right-[15%] top-[5%] h-[90%] w-[65%] rounded-full bg-[radial-gradient(closest-side,#5fa5ff,transparent)] opacity-70 blur-[50px]" />
      <span className="blob-c absolute bottom-[-35%] left-[20%] h-[80%] w-[60%] rounded-full bg-[radial-gradient(closest-side,#ffffff,transparent)] opacity-90 blur-[30px]" />
      {VIDEO && <video src={VIDEO} autoPlay muted loop playsInline className="absolute inset-0 size-full object-cover" />}
    </div>
  )
}
